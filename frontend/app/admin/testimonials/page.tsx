"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Star, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { adminApi } from "@/lib/api";

interface Testimonial {
  id: string;
  author: string;
  role: string;
  quote: string;
  stars: number;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: "1", author: "James L.", role: "Freelance Full-Stack Developer", quote: "I described a multi-tenant invoicing app and got a fully working NestJS backend with Prisma in under 4 minutes. Would have taken me 2 days manually.", stars: 5 },
  { id: "2", author: "Priya M.", role: "CTO, Fintech Startup", quote: "The relation detection blew my mind. I typed 'users have many projects, projects have many tasks' and it generated the exact schema I had in my head.", stars: 5 },
  { id: "3", author: "Thomas B.", role: "Lead Backend Engineer", quote: "We use PromptForge to prototype new features before committing to a full build. Our sprint velocity has improved noticeably since we started.", stars: 5 },
  { id: "4", author: "David O.", role: "Senior Software Engineer", quote: "Skeptical at first, but the generated code is actually clean. Proper DTOs, validation, auth guards — not just a toy scaffold.", stars: 4 },
  { id: "5", author: "Mia C.", role: "Tech Lead, Digital Agency", quote: "We evaluated 3 different tools for our agency. PromptForge was the only one that actually understood our prompts and produced production-ready structure.", stars: 5 },
  { id: "6", author: "Alex R.", role: "Indie Hacker", quote: "As a solo founder I can't afford to spend 3 days on boilerplate. PromptForge gets me to a working API in minutes.", stars: 5 },
];

function newTestimonial(): Testimonial {
  return { id: Date.now().toString(), author: "", role: "", quote: "", stars: 5 };
}

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    adminApi.getSettings().then((res) => {
      const settings: Array<{ key: string; value: string }> = res.data?.data ?? res.data ?? [];
      const row = settings.find((s) => s.key === "testimonials_json");
      if (row?.value) {
        try {
          setItems(JSON.parse(row.value));
          return;
        } catch {}
      }
      setItems(DEFAULT_TESTIMONIALS);
    }).catch(() => setItems(DEFAULT_TESTIMONIALS));
  }, []);

  function update(id: string, field: keyof Testimonial, value: string | number) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }

  async function save() {
    setSaving(true);
    setStatus("idle");
    try {
      await adminApi.updateSettings([
        { key: "testimonials_json", value: JSON.stringify(items), label: "Testimonials JSON" },
      ]);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Testimonials</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage the reviews shown on the landing page.</p>
        </div>
        <div className="flex items-center gap-3">
          {status === "success" && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Saved
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-1.5 text-sm text-red-400">
              <AlertCircle className="w-4 h-4" /> Error saving
            </span>
          )}
          <button
            onClick={() => setItems((prev) => [...prev, newTestimonial()])}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save all
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((t, idx) => (
          <div key={t.id} className="rounded-xl bg-slate-900 border border-slate-800 p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <span className="text-xs text-slate-600 font-mono">#{idx + 1}</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => update(t.id, "stars", s)}>
                    <Star
                      className={`w-4 h-4 transition-colors ${s <= t.stars ? "text-yellow-400 fill-yellow-400" : "text-slate-700"}`}
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={t.quote}
              onChange={(e) => update(t.id, "quote", e.target.value)}
              placeholder="Quote..."
              rows={3}
              className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 resize-none mb-3"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                value={t.author}
                onChange={(e) => update(t.id, "author", e.target.value)}
                placeholder="Name (e.g. James L.)"
                className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60"
              />
              <input
                value={t.role}
                onChange={(e) => update(t.id, "role", e.target.value)}
                placeholder="Role (e.g. Senior Engineer)"
                className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-slate-600">
          No testimonials yet.{" "}
          <button onClick={() => setItems([newTestimonial()])} className="text-indigo-400 hover:text-indigo-300">
            Add one
          </button>
        </div>
      )}
    </div>
  );
}
