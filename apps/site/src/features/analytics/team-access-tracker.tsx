"use client";

import { useEffect } from "react";
import { identifyTeamMember } from "@/lib/analytics/posthog";

export function TeamAccessTracker({ userId }: { userId: string }) {
  useEffect(() => {
    identifyTeamMember(userId);
  }, [userId]);

  return null;
}
