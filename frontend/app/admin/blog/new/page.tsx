"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { ArrowLeft, Save } from "lucide-react";

const CATEGORIES = ["Tutorial", "Engineering", "Comparison", "News", "Guide"];

export default function AdminBlogNewPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tutorial");
  const [readTime, setReadTime] = useState(5);
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugEdited) {
      setSlug(slugify(val));
    }
  }

  async function handleSave() {
    if (!title || !slug || !description || !content) {
      setError("Title, slug, description, and content are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await adminApi.createBlogPost({
        title,
        slug,
        description,
        category,
        readTime,
        content,
        published,
      });
      router.push("/admin/blog");
    } catch (e: any) {
      setError(
        e?.response?.data?.message ?? "Failed to create post. Slug may already exist.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">New Blog Post</h1>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <button
              type="button"
              role="switch"
              aria-checked={published}
              onClick={() => setPublished((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                published ? "bg-emerald-600" : "bg-slate-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  published ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm text-slate-300">
              {published ? "Published" : "Draft"}
            </span>
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving…" : "Save Post"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-950/50 border border-red-800/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Title *</label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="How to Build a SaaS in 5 Minutes"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">
              Slug * <span className="text-slate-600">(URL: /blog/your-slug)</span>
            </label>
            <input
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
              placeholder="how-to-build-a-saas"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">
              Description * <span className="text-slate-600">(shown in listings)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of the post…"
              rows={2}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-slate-800">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Read Time (minutes)</label>
              <input
                type="number"
                min={1}
                value={readTime}
                onChange={(e) => setReadTime(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <label className="block text-sm text-slate-400 mb-1.5">
            Content * <span className="text-slate-600">(HTML supported)</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="<p>Your blog post content here…</p>"
            rows={20}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-rose-500 transition-colors resize-y"
          />
          <p className="text-xs text-slate-600 mt-2">
            Use HTML tags for formatting: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;code&gt;, etc.
          </p>
        </div>
      </div>
    </div>
  );
}
