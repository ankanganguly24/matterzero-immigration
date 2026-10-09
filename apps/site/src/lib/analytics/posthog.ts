"use client";

import type { PostHog } from "posthog-js";

export const analyticsEvents = [
  "pilot_cta_header_clicked",
  "pilot_cta_pricing_clicked",
  "pilot_discussion_hero_clicked",
  "sign_in_header_clicked",
  "sign_in_from_pilot_clicked",
  "pilot_from_sign_in_clicked",
  "pilot_request_submitted",
  "pilot_request_already_on_file",
  "pilot_request_failed",
  "sign_in_link_requested",
  "sign_in_access_not_configured",
  "sign_in_link_request_failed",
  "team_access_verified",
] as const;

export type AnalyticsEvent = (typeof analyticsEvents)[number];

const allowedEvents = new Set<string>(["$pageview", "$identify", ...analyticsEvents]);
const publicPaths = new Set(["/", "/login", "/request-pilot", "/resources"]);
const urlProperties = [
  "$current_url",
  "$initial_current_url",
  "$session_entry_url",
  "$referrer",
  "$initial_referrer",
  "$session_entry_referrer",
] as const;

let client: PostHog | null = null;
let clientPromise: Promise<PostHog | null> | null = null;

function withoutQueryOrHash(value: string) {
  if (value === "$direct") return value;
  if (!/^https?:\/\//i.test(value)) return undefined;
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    return undefined;
  }
}

async function getClient(): Promise<PostHog | null> {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (typeof window === "undefined" || !token || !host) return null;

  clientPromise ??= import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(token, {
        api_host: host,
        defaults: "2026-05-30",
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        capture_exceptions: false,
        disable_session_recording: true,
        disable_surveys: true,
        advanced_disable_flags: true,
        person_profiles: "identified_only",
        before_send: (event) => {
          if (!event || !allowedEvents.has(event.event)) return null;
          for (const property of urlProperties) {
            const value = event.properties?.[property];
            if (typeof value === "string") {
              const safeValue = withoutQueryOrHash(value);
              if (safeValue) event.properties[property] = safeValue;
              else delete event.properties[property];
            }
          }
          return event;
        },
      });
      client = posthog;
      return posthog;
    })
    .catch(() => null);

  return clientPromise;
}

export function captureEvent(event: AnalyticsEvent) {
  function send(posthog: PostHog) {
    posthog.capture(
      event,
      undefined,
      event.endsWith("_clicked") ? { send_instantly: true, transport: "sendBeacon" } : undefined,
    );
  }

  if (client) {
    send(client);
    return;
  }
  void getClient().then((posthog) => {
    if (posthog) send(posthog);
  });
}

export function capturePublicPageview(pathname: string) {
  if (!publicPaths.has(pathname) && !pathname.startsWith("/resources/")) return;
  void getClient().then((posthog) =>
    posthog?.capture("$pageview", {
      $current_url: `${window.location.origin}${pathname}`,
      $pathname: pathname,
    }),
  );
}

export function identifyTeamMember(userId: string) {
  if (!userId) return;
  void getClient().then((posthog) => {
    if (!posthog) return;
    posthog.identify(userId);
    posthog.capture("team_access_verified");
  });
}

export function resetAnalyticsIdentity() {
  client?.reset();
}
