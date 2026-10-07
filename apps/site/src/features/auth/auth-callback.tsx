"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./auth.module.css";

export function AuthCallback({ code }: { code?: string }) {
  const [message, setMessage] = useState("Verifying your secure sign-in link…");

  useEffect(() => {
    let cancelled = false;

    async function completeSignIn() {
      const fragment = new URLSearchParams(window.location.hash.slice(1));
      const fragmentError = fragment.get("error_code") || fragment.get("error");

      if (fragmentError) {
        window.location.replace("/login?error=link");
        return;
      }

      const supabase = createClient();
      let error: Error | null = null;

      if (code) {
        const result = await supabase.auth.exchangeCodeForSession(code);
        error = result.error;
      } else {
        const accessToken = fragment.get("access_token");
        const refreshToken = fragment.get("refresh_token");

        if (!accessToken || !refreshToken) {
          window.location.replace("/login?error=link");
          return;
        }

        const result = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        error = result.error;
      }

      if (cancelled) return;

      if (error) {
        window.location.replace("/login?error=link");
        return;
      }

      window.location.replace("/auth/complete");
    }

    completeSignIn().catch(() => {
      if (!cancelled) {
        setMessage("We couldn’t complete that link. Request a fresh sign-in link to continue.");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <main id="main-content" className={styles.page}>
      <section className={styles.card} aria-live="polite">
        <p className={styles.eyebrow}>TEAM ACCESS</p>
        <h1>Completing sign in</h1>
        <p className={styles.intro}>{message}</p>
      </section>
    </main>
  );
}
