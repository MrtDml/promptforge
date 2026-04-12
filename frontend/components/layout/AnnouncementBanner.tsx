"use client";

import { useState, useEffect } from "react";
import { X, Info, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface PublicSettings {
  announcement_active?: string;
  announcement_type?: string;
  announcement_message?: string;
  announcement_link?: string;
  announcement_start?: string;
  announcement_end?: string;
  announcement_image_url?: string;
}

const TYPE_STYLES = {
  info: {
    wrapper: "bg-indigo-950/80 border-b border-indigo-800/60",
    text: "text-indigo-200",
    icon: Info,
    iconClass: "text-indigo-400",
  },
  warning: {
    wrapper: "bg-amber-950/80 border-b border-amber-800/60",
    text: "text-amber-200",
    icon: AlertTriangle,
    iconClass: "text-amber-400",
  },
  success: {
    wrapper: "bg-emerald-950/80 border-b border-emerald-800/60",
    text: "text-emerald-200",
    icon: CheckCircle,
    iconClass: "text-emerald-400",
  },
};

function isWithinDateRange(start?: string, end?: string): boolean {
  const now = new Date();
  if (start && new Date(start) > now) return false;
  if (end && new Date(end) < now) return false;
  return true;
}

export default function AnnouncementBanner() {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/settings/public`)
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  if (dismissed || !settings) return null;
  if (settings.announcement_active !== "true") return null;
  if (!settings.announcement_message?.trim()) return null;
  if (!isWithinDateRange(settings.announcement_start, settings.announcement_end)) return null;

  const type = (settings.announcement_type as keyof typeof TYPE_STYLES) ?? "info";
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.info;
  const Icon = style.icon;

  return (
    <div className={`w-full ${style.wrapper} backdrop-blur-sm`}>
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
        {settings.announcement_image_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={settings.announcement_image_url}
            alt=""
            className="h-5 w-auto flex-shrink-0 object-contain"
          />
        ) : (
          <Icon className={`w-4 h-4 flex-shrink-0 ${style.iconClass}`} />
        )}
        <p className={`flex-1 text-sm ${style.text}`}>
          {settings.announcement_message}
          {settings.announcement_link && (
            <Link
              href={settings.announcement_link}
              className="ml-2 inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              Daha fazla <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </p>
        <button
          onClick={() => setDismissed(true)}
          className={`flex-shrink-0 p-1 rounded hover:opacity-70 transition-opacity ${style.text}`}
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
