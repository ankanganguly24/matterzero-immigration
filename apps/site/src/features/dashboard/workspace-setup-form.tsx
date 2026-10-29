"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { SelectControl } from "@/components/forms/select-control";
import styles from "./workspace-setup.module.css";

const fields = [
  {
    name: "organizationType",
    label: "Organization type",
    options: [
      ["consultancy", "Immigration consultancy"],
      ["law_firm", "Law firm"],
      ["in_house", "In-house immigration team"],
      ["other", "Other"],
    ],
  },
  {
    name: "market",
    label: "Primary market",
    options: [
      ["india", "India"],
      ["united_states", "United States"],
      ["other", "Other / multiple markets"],
    ],
  },
  {
    name: "teamSize",
    label: "Team size",
    options: [
      ["1", "Just me"],
      ["2-5", "2–5 people"],
      ["6-15", "6–15 people"],
      ["16+", "16 or more people"],
    ],
  },
  {
    name: "primaryFocus",
    label: "Primary workflow to organize",
    options: [
      ["business", "Business / employment immigration"],
      ["student", "Student immigration"],
      ["family", "Family immigration"],
      ["other", "Other / mixed workflows"],
    ],
  },
] as const;

export function WorkspaceSetupForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function createWorkspace(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = (await response.json()) as {
        workspace?: { id: string };
        error?: string;
      };
      if (!response.ok || !result.workspace) {
        setError(result.error ?? "We couldn’t create the workspace. Please try again.");
        return;
      }
      router.push(`/dashboard/${result.workspace.id}`);
      router.refresh();
    } catch {
      setError("Workspace setup is temporarily unavailable. Please try again shortly.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={createWorkspace}>
      <div className={styles.nameField}>
        <label htmlFor="workspace-name">Workspace name</label>
        <input
          id="workspace-name"
          name="name"
          type="text"
          minLength={2}
          maxLength={120}
          autoComplete="organization"
          placeholder="For example, Northstar Immigration"
          required
        />
        <small>Use your firm or team name.</small>
      </div>

      <div className={styles.fieldGrid}>
        {fields.map((field) => (
          <div className={styles.field} key={field.name}>
            <label htmlFor={`workspace-${field.name}`}>{field.label}</label>
            <SelectControl
              density="spacious"
              id={`workspace-${field.name}`}
              name={field.name}
              required
              defaultValue=""
            >
              <option value="" disabled>
                Choose an option
              </option>
              {field.options.map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </SelectControl>
          </div>
        ))}
      </div>

      <p className={styles.privacyNote}>
        This is workspace setup only. Don’t enter applicant names, case details, or document
        information here.
      </p>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <button className={styles.submitButton} type="submit" disabled={pending}>
        {pending ? "Creating workspace…" : "Create workspace"}
        {!pending ? <span aria-hidden="true">→</span> : null}
      </button>
    </form>
  );
}
