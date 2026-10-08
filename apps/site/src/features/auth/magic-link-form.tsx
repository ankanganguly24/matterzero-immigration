"use client";

import { useState, type SubmitEvent } from "react";
import { TextField } from "@/components/forms/text-field";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import styles from "./auth.module.css";

export function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function requestLink(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isSupabaseConfigured()) {
      setError("Sign-in is not configured yet. Please try again later.");
      return;
    }

    setPending(true);
    try {
      const supabase = createClient();
      const { error: requestError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (requestError) {
        if (requestError.code === "over_email_send_rate_limit") {
          setError(
            "Supabase’s test email limit has been reached. Wait up to an hour before requesting another link, then open the newest link once on the device running MatterZero.",
          );
        } else {
          setError(
            process.env.NODE_ENV === "development"
              ? `We couldn’t send a sign-in link. ${requestError.message}`
              : "We couldn’t send a sign-in link. Check the email and try again.",
          );
        }
      } else {
        setSent(true);
      }
    } catch {
      setError("Sign-in is temporarily unavailable. Please try again shortly.");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <span className={styles.successIcon} aria-hidden="true">
          ✓
        </span>
        <h2>Check your inbox</h2>
        <p>If that email belongs to an invited team member, a secure sign-in link is on its way.</p>
        <button className={styles.textButton} type="button" onClick={() => setSent(false)}>
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={requestLink}>
      <TextField
        id="staff-email"
        label="Work email"
        type="email"
        name="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="you@company.com"
        value={email}
        onValueChange={setEmail}
        required
      />
      {error ? (
        <p className={styles.alert} role="alert">
          {error}
        </p>
      ) : null}
      <button className="button button--primary" type="submit" disabled={pending}>
        {pending ? "Sending link…" : "Email me a sign-in link"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className={styles.privacy}>We’ll only use this email to verify your team access.</p>
    </form>
  );
}
