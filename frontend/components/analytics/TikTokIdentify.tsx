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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ttq?.identify({
        ...(hashedEmail && { email: hashedEmail }),
        ...(hashedId && { external_id: hashedId }),
      });
    })();
  }, [email, userId]);

  return null;
}
