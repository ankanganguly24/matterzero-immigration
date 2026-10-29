"use client";

import { useState } from "react";
import styles from "./matter-hub.module.css";

export function VoiceIntakePreview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
      className={styles.voiceButton}
        onClick={() => {
          setOpen(true);
        }}
      >
      🔒 Enable Voice Agent — Preview
      </button>
      {open ? (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="voice-title"
          >
            <button
              type="button"
              className={styles.modalClose}
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <p className={styles.eyebrow}>ROADMAP PREVIEW</p>
            <h2 id="voice-title">AI Voice Assistant Intake</h2>
            <p>Automate phone calls to applicants to resolve missing FactGraph gaps.</p>
            <div className={styles.roadmapNote}>
              Voice intake is a planned workflow. This preview does not place calls, connect to a
              provider, or send applicant data anywhere.
            </div>
            <button type="button" className={styles.primaryButton} onClick={() => setOpen(false)}>
              Got it
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
