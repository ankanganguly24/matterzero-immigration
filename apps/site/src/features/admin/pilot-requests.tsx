"use client";

import { useEffect, useState } from "react";
import styles from "./admin.module.css";

type PilotRequest = {
  id: string;
  email: string;
  organization: string;
  status: "pending" | "approved" | "declined";
  created_at: string;
  reviewed_at: string | null;
};

export function PilotRequests() {
  const [requests, setRequests] = useState<PilotRequest[]>([]);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/pilot-requests", { cache: "no-store" });
      const result = (await response.json()) as { requests?: PilotRequest[]; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Pilot requests could not be loaded.");
      setRequests(result.requests ?? []);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Pilot requests could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function review(id: string, action: "approve" | "decline") {
    setPendingId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/pilot-requests/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "The request could not be reviewed.");
      await load();
    } catch (reviewError) {
      setError(
        reviewError instanceof Error ? reviewError.message : "The request could not be reviewed.",
      );
    } finally {
      setPendingId("");
    }
  }

  return (
    <div className={styles.requestList}>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      {loading ? <p className={styles.note} role="status">Loading pilot requests…</p> : null}
      {!loading && requests.length === 0 && !error ? (
        <p className={styles.note}>No pilot requests yet.</p>
      ) : null}
      {requests.map((item) => (
        <article className={styles.requestCard} key={item.id}>
          <div>
            <p className={styles.requestOrganization}>{item.organization}</p>
            <p className={styles.requestEmail}>{item.email}</p>
            <p className={styles.requestMeta}>
              Received {new Date(item.created_at).toLocaleDateString()} · {item.status}
            </p>
          </div>
          {item.status === "pending" ? (
            <div className={styles.requestActions}>
              <button
                className="button button--primary"
                type="button"
                onClick={() => void review(item.id, "approve")}
                disabled={Boolean(pendingId)}
              >
                {pendingId === item.id ? "Working…" : "Approve and invite"}
              </button>
              <button
                className="button button--secondary"
                type="button"
                onClick={() => void review(item.id, "decline")}
                disabled={Boolean(pendingId)}
              >
                Decline
              </button>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
