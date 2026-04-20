"use client";

import { useEffect } from "react";

interface Props {
  event: string;
  params?: Record<string, unknown>;
}

export default function TikTokEvent({ event, params }: Props) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ttq?.track(event, params ?? {});
  }, [event, params]);

  return null;
}
