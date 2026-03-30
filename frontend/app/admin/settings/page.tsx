"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { SiteSetting } from "@/types";
import { Save, RefreshCw } from "lucide-react";

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
      setError("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

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
      setSuccess("Settings saved successfully.");
    } catch {
      setError("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Settings</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Platform-wide configuration
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchSettings}
            className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
            title="Reload"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving…" : "Save All"}
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

      <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
        {settings.map((setting) => {
          const isBool =
            setting.value === "true" ||
            setting.value === "false" ||
            values[setting.key] === "true" ||
            values[setting.key] === "false";

          return (
            <div key={setting.key} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-300 mb-0.5">
                    {setting.label}
                  </label>
                  <p className="text-xs text-slate-600 font-mono">{setting.key}</p>
                </div>
                <div className="flex-shrink-0 min-w-[180px]">
                  {isBool ? (
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={values[setting.key] === "true"}
                        onClick={() =>
                          setValues((prev) => ({
                            ...prev,
                            [setting.key]:
                              prev[setting.key] === "true" ? "false" : "true",
                          }))
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          values[setting.key] === "true"
                            ? "bg-emerald-600"
                            : "bg-slate-700"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            values[setting.key] === "true"
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className="text-sm text-slate-400 w-10">
                        {values[setting.key] === "true" ? "On" : "Off"}
                      </span>
                    </div>
                  ) : (
                    <input
                      value={values[setting.key] ?? ""}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [setting.key]: e.target.value,
                        }))
                      }
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
  );
}
