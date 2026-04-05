"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

    if (!key) return; // analytics disabled — env var not set

    posthog.init(key, {
      api_host: host,
      capture_pageview: false, // handled via PostHogPageView
      capture_pageleave: true,
      persistence: "localStorage",
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
