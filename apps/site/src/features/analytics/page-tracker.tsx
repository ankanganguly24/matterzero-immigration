"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  analyticsEvents,
  captureEvent,
  capturePublicPageview,
  resetAnalyticsIdentity,
  type AnalyticsEvent,
} from "@/lib/analytics/posthog";

const allowedEvents = new Set<string>(analyticsEvents);

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    capturePublicPageview(pathname);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLElement>("[data-analytics-event]");
      const name = link?.dataset.analyticsEvent;
      if (name && allowedEvents.has(name)) captureEvent(name as AnalyticsEvent);
    }

    function onSubmit(event: SubmitEvent) {
      if (
        event.target instanceof HTMLFormElement &&
        new URL(event.target.action).pathname === "/auth/signout"
      ) {
        resetAnalyticsIdentity();
      }
    }

    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("submit", onSubmit);
    };
  }, []);

  return null;
}
