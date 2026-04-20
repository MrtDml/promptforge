"use client";

import { useEffect } from "react";

interface Props {
  event: string;
  params?: Record<string, unknown>;
}

export default function TikTokEvent({ event, params }: Props) {
  useEffect(() => {
    window.ttq?.track(event, params ?? {});
  }, [event, params]);

  return null;
}
