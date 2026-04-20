"use client";

import { useEffect } from "react";
import { sha256 } from "@/lib/hash";

interface Props {
  email?: string;
  userId?: string;
}

export default function TikTokIdentify({ email, userId }: Props) {
  useEffect(() => {
    if (!email && !userId) return;

    (async () => {
      const [hashedEmail, hashedId] = await Promise.all([
        email ? sha256(email) : Promise.resolve(undefined),
        userId ? sha256(userId) : Promise.resolve(undefined),
      ]);

      window.ttq?.identify({
        ...(hashedEmail && { email: hashedEmail }),
        ...(hashedId && { external_id: hashedId }),
      });
    })();
  }, [email, userId]);

  return null;
}
