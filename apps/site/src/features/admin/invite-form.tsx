"use client";

import { useState, type SubmitEvent } from "react";
import { TextField } from "@/components/forms/text-field";
import styles from "./admin.module.css";

export function InviteForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);

  async function sendInvitation(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setPending(true);

    try {
      const response = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        setError(result.error ?? "The invitation could not be sent.");
      } else {
        setSuccess(result.message ?? `Invitation sent to ${email}.`);
        setEmail("");
      }
    } catch {
      setError("Could not reach MatterZero. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={sendInvitation}>
      <TextField
        id="pilot-email"
        label="Pilot team member’s email"
        type="email"
        name="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={254}
        placeholder="name@consultancy.com"
        value={email}
        onValueChange={setEmail}
        required
      />
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className={styles.success} role="status">
          {success}
        </p>
      ) : null}
      <button className="button button--primary" type="submit" disabled={pending}>
        {pending ? "Sending invitation…" : "Send sign-in invitation"}
      </button>
      <p className={styles.note}>
        The invitation gives this email an account. They can then sign in with a secure email link.
        It does not grant access to applicant data; that workspace isn’t built yet.
      </p>
    </form>
  );
}
