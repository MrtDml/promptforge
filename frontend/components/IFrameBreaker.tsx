"use client";
import { useEffect } from "react";

// PayTR ödeme sonrası iFrame içinden üst pencereye çıkar
export default function IFrameBreaker() {
  useEffect(() => {
    if (window.self !== window.top) {
      window.top!.location.href = window.self.location.href;
    }
  }, []);
  return null;
}
