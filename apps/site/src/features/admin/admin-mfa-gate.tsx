"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/forms/text-field";
import { createClient } from "@/lib/supabase/client";
import styles from "./admin.module.css";

type Step = "loading" | "setup" | "challenge";

export function AdminMfaGate({ email }: { email: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("loading");
  const [factorId, setFactorId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    void supabase.auth.mfa.listFactors().then(({ data, error: factorsError }) => {
      if (!active) return;
      if (factorsError) {
        setError(factorsError.message);
        setStep("setup");
        return;
      }

      const verifiedFactor = data.totp.find((factor) => factor.status === "verified");
      if (verifiedFactor) {
        setFactorId(verifiedFactor.id);
        setStep("challenge");
      } else {
        setStep("setup");
      }
    });

    return () => {
      active = false;
    };
  }, []);

  async function beginSetup() {
    setError("");
    setPending(true);
    const supabase = createClient();

    // A previous enrollment attempt may have created the same factor but failed
    // before verification. Supabase won't allow enrolling another factor with
    // the same friendly name, so discard only that still-unverified attempt.
    const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) {
      setPending(false);
      setError(factorsError.message);
      return;
    }

    const pendingFactor = factors.all.find(
      (factor) =>
        factor.factor_type === "totp" &&
        factor.friendly_name === "MatterZero admin authenticator" &&
        factor.status === "unverified",
    );
    if (pendingFactor) {
      const { error: unenrollError } = await supabase.auth.mfa.unenroll({
        factorId: pendingFactor.id,
      });
      if (unenrollError) {
        setPending(false);
        setError(unenrollError.message);
        return;
      }
    }

    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "MatterZero admin authenticator",
    });
    setPending(false);
    if (enrollError) {
      setError(enrollError.message);
      return;
    }
    setFactorId(data.id);
    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
  }

  async function verifyCode() {
    if (!factorId) return;
    setError("");
    setPending(true);
    const supabase = createClient();
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId,
    });
    if (challengeError) {
      setPending(false);
      setError(challengeError.message);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: code.trim(),
    });
    setPending(false);
    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    router.refresh();
  }

  if (step === "loading") {
    return <p className={styles.note}>Checking your authenticator setup…</p>;
  }

  return (
    <section className={styles.card} aria-labelledby="mfa-heading">
      <p className={styles.eyebrow}>ADMIN SECURITY · STEP 2 OF 2</p>
      <h1 id="mfa-heading">
        {step === "challenge" ? "Verify your sign-in" : "Secure admin access"}
      </h1>
      <p className={styles.description}>
        Signed in as <strong>{email}</strong>.{" "}
        {step === "challenge"
          ? "Enter the current code from your authenticator app."
          : "Set up an authenticator app before opening the admin dashboard."}
      </p>

      {step === "setup" && !qrCode ? (
        <button
          className="button button--primary"
          type="button"
          onClick={beginSetup}
          disabled={pending}
        >
          {pending ? "Preparing setup…" : "Set up authenticator"}
        </button>
      ) : null}

      {qrCode ? (
        <div className={styles.setup}>
          {/* Supabase generates this QR code at runtime as a data URI; it is not a static asset. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.qr}
            src={qrCode}
            alt="QR code to add MatterZero to your authenticator app"
            width={240}
            height={240}
          />
          <p className={styles.note}>Scan this QR code with your authenticator app.</p>
          <details>
            <summary>Can’t scan the QR code?</summary>
            <p className={styles.secret}>{secret}</p>
          </details>
        </div>
      ) : null}

      {step === "challenge" || qrCode ? (
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            void verifyCode();
          }}
        >
          <TextField
            id="admin-totp-code"
            label="6-digit authenticator code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            value={code}
            onValueChange={(value) => setCode(value.replace(/\D/g, "").slice(0, 6))}
            required
          />
          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}
          <button
            className="button button--primary"
            type="submit"
            disabled={pending || code.length !== 6}
          >
            {pending
              ? "Verifying…"
              : step === "challenge"
                ? "Verify and continue"
                : "Enable and continue"}
          </button>
        </form>
      ) : null}

      {error && !(step === "challenge" || qrCode) ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <p className={styles.note}>
        Your code is checked by Supabase and is never stored by MatterZero.
      </p>
    </section>
  );
}
