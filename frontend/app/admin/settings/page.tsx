"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { SiteSetting } from "@/types";
import { Save, RefreshCw, Calendar, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

// Keys that get special UI treatment
const DATE_KEYS = new Set(["announcement_start", "announcement_end"]);
const IMAGE_URL_KEYS = new Set(["announcement_image_url"]);
const LINK_KEYS = new Set(["announcement_link", "contact_email"]);

// Group order for display
const GROUP_ORDER = ["announcement", "site", "plan", "other"];
const GROUP_LABELS: Record<string, string> = {
  announcement: "Duyuru Bandı",
  site: "Site Ayarları",
  plan: "Plan Limitleri",
  other: "Diğer",
};

function getGroup(key: string): string {
  if (key.startsWith("announcement_")) return "announcement";
  if (key.startsWith("site_") || key === "contact_email") return "site";
  if (key.includes("plan_limit")) return "plan";
  return "other";
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await adminApi.getSettings();
      const data: SiteSetting[] = res.data;
      setSettings(data);
      const initial: Record<string, string> = {};
      data.forEach((s) => { initial[s.key] = s.value; });
      setValues(initial);
    } catch {
      setError("Ayarlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSettings(); }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = settings.map((s) => ({
        key: s.key,
        value: values[s.key] ?? s.value,
        label: s.label,
      }));
      const res = await adminApi.updateSettings(payload);
      const updated: SiteSetting[] = res.data;
      setSettings(updated);
      setSuccess("Ayarlar başarıyla kaydedildi.");
    } catch {
      setError("Ayarlar kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  function setValue(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Group settings
  const grouped: Record<string, SiteSetting[]> = {};
  settings.forEach((s) => {
    const g = getGroup(s.key);
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(s);
  });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Ayarları</h1>
          <p className="text-slate-400 text-sm mt-0.5">Platform geneli yapılandırma</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchSettings}
            className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
            title="Yenile"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Kaydediliyor…" : "Tümünü Kaydet"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-950/50 border border-red-800/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-5 p-3 bg-emerald-950/50 border border-emerald-800/50 rounded-lg text-emerald-300 text-sm">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {GROUP_ORDER.filter((g) => grouped[g]?.length).map((group) => (
          <div key={group} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-800/40">
              <h2 className="text-sm font-semibold text-slate-300">
                {GROUP_LABELS[group] ?? group}
              </h2>
            </div>
            <div className="divide-y divide-slate-800">
              {grouped[group].map((setting) => {
                const val = values[setting.key] ?? "";
                const isBool =
                  setting.value === "true" ||
                  setting.value === "false" ||
                  val === "true" ||
                  val === "false";
                const isDate = DATE_KEYS.has(setting.key);
                const isImage = IMAGE_URL_KEYS.has(setting.key);
                const isLink = LINK_KEYS.has(setting.key);

                return (
                  <div key={setting.key} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <label className="block text-sm font-medium text-slate-300 mb-0.5">
                          {setting.label}
                        </label>
                        <p className="text-xs text-slate-600 font-mono">{setting.key}</p>
                      </div>

                      <div className="flex-shrink-0 min-w-[220px]">
                        {isBool ? (
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={val === "true"}
                              onClick={() => setValue(setting.key, val === "true" ? "false" : "true")}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                val === "true" ? "bg-emerald-600" : "bg-slate-700"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  val === "true" ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                            <span className="text-sm text-slate-400 w-10">
                              {val === "true" ? "Açık" : "Kapalı"}
                            </span>
                          </div>
                        ) : isDate ? (
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                            <input
                              type="datetime-local"
                              value={val ? val.slice(0, 16) : ""}
                              onChange={(e) =>
                                setValue(
                                  setting.key,
                                  e.target.value ? new Date(e.target.value).toISOString() : "",
                                )
                              }
                              className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                            />
                          </div>
                        ) : isImage ? (
                          <div className="space-y-2">
                            <div className="relative">
                              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                              <input
                                type="url"
                                value={val}
                                onChange={(e) => setValue(setting.key, e.target.value)}
                                placeholder="https://…"
                                className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                              />
                            </div>
                            {val && (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={val}
                                alt="preview"
                                className="h-7 object-contain rounded opacity-70"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                            )}
                          </div>
                        ) : isLink ? (
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => setValue(setting.key, e.target.value)}
                              className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500 transition-colors text-right"
                            />
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => setValue(setting.key, e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500 transition-colors text-right"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
