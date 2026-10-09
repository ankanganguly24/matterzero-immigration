"use client";

import { useState, type SubmitEvent } from "react";
import { TextField } from "@/components/forms/text-field";
import styles from "./auth.module.css";

export function PilotRequestForm() {
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [alreadyOnFile, setAlreadyOnFile] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/pilot-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, organization }),
      });
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok && response.status !== 409)
        setError(result.error ?? "Your request could not be sent.");
      else {
        setAlreadyOnFile(response.status === 409);
        setMessage(
          result.message ?? "Your request is on file. The team will follow up after review.",
        );
        setEmail("");
        setOrganization("");
      }
    } catch {
      setError("Could not reach MatterZero. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  if (message)
    return (
      <div className={styles.success} role="status">
        <span className={styles.successIcon} aria-hidden="true">
          ✓
        </span>
        <h2>{alreadyOnFile ? "Request already on file" : "Request received"}</h2>
        <p>{message}</p>
      </div>
    );

  return (
    <form className={styles.form} onSubmit={submit}>
      <TextField
        id="pilot-request-email"
        label="Work email"
        type="email"
        name="email"
        autoComplete="email"
        autoCapitalize="none"
        maxLength={254}
        value={email}
        onValueChange={setEmail}
        required
      />
      <TextField
        id="pilot-request-organization"
        label="Organization"
        type="text"
        name="organization"
        autoComplete="organization"
        maxLength={120}
        value={organization}
        onValueChange={setOrganization}
        required
      />
      {error ? (
        <p className={styles.alert} role="alert">
          {error}
        </p>
      ) : null}
      <button className="button button--primary" type="submit" disabled={pending}>
        {pending ? "Sending request…" : "Send pilot request"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className={styles.privacy}>
        We’ll use these details only to follow up about pilot access.
      </p>
    </form>
  );
}
