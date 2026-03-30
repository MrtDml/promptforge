"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { slugify } from "@/lib/utils";
import type { BlogPost } from "@/types";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

const CATEGORIES = ["Tutorial", "Engineering", "Comparison", "News", "Guide"];

export default function AdminBlogEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tutorial");
  const [readTime, setReadTime] = useState(5);
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    adminApi
      .getBlogPostById(id)
      .then((res) => {
        const post: BlogPost = res.data;
        setTitle(post.title);
        setSlug(post.slug);
        setDescription(post.description);
        setCategory(post.category);
        setReadTime(post.readTime);
        setContent(post.content);
        setPublished(post.published);
      })
      .catch(() => setError("Post not found"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    if (!title || !slug || !description || !content) {
      setError("All fields are required.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await adminApi.updateBlogPost(id, {
        title,
        slug,
        description,
        category,
        readTime,
        content,
        published,
      });
      setSuccess("Post updated successfully.");
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to update post.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await adminApi.deleteBlogPost(id);
      router.push("/admin/blog");
    } catch {
      setError("Failed to delete post.");
      setDeleting(false);
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
    <div className="p-6 max-w-4xl mx-auto">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Edit Post</h1>
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
            {saving ? "Saving…" : "Save Changes"}
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

      <div className="space-y-5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Title *</label>
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setSlug(slugify(e.target.value)); }}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">
              Slug * <span className="text-slate-600">(URL: /blog/your-slug)</span>
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            rows={20}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-rose-500 transition-colors resize-y"
          />
        </div>

        {/* Delete */}
        <div className="bg-slate-900 border border-red-900/40 rounded-xl p-5">
          <p className="text-sm text-slate-400 mb-3">
            Permanently delete this blog post. This cannot be undone.
          </p>
          {confirmDelete && (
            <p className="text-sm text-red-300 mb-3 font-medium">
              Are you sure? Click again to confirm.
            </p>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
              confirmDelete
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-red-950/50 border border-red-800/50 text-red-400 hover:bg-red-900/50"
            }`}
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "Deleting…" : confirmDelete ? "Confirm Delete" : "Delete Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
