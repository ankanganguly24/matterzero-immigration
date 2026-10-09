"use client";

import { useState, type SubmitEvent } from "react";
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
      <div className={styles.inviteRow}>
        <div className={styles.inviteField}>
          <label htmlFor="pilot-email">Work email</label>
          <input
            id="pilot-email"
            type="email"
            name="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={254}
            placeholder="name@consultancy.com"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
          />
        </div>
        <button className="button button--primary" type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send invitation"}
        </button>
      </div>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      {success ? <p className={styles.success} role="status">{success}</p> : null}
    </form>
  );
}
