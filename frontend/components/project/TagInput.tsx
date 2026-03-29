"use client";

import { useState, KeyboardEvent } from "react";
import { X, Tag, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/api";

interface TagInputProps {
  projectId: string;
  initialTags?: string[];
}

export default function TagInput({ projectId, initialTags = [] }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  async function saveTags(newTags: string[]) {
    setSaving(true);
    try {
      await apiClient.patch(`/api/v1/projects/${projectId}`, { tags: newTags });
      setTags(newTags);
    } catch {
      // revert
    } finally {
      setSaving(false);
    }
  }

  function addTag(raw: string) {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, "-").slice(0, 30);
    if (!tag || tags.includes(tag) || tags.length >= 10) return;
    saveTags([...tags, tag]);
    setInput("");
  }

  function removeTag(tag: string) {
    saveTags(tags.filter((t) => t !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Tag className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-xs font-medium text-slate-400">Tags</span>
        {saving && <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />}
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-950/50 border border-indigo-800/40 text-indigo-300 text-xs"
          >
            #{tag}
            <button
              onClick={() => removeTag(tag)}
              className="hover:text-red-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length < 10 ? "Add tag… (Enter or comma)" : "Max 10 tags"}
        disabled={tags.length >= 10 || saving}
        className={cn(
          "w-full max-w-xs rounded-lg bg-slate-800/60 border border-slate-700 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors",
          (tags.length >= 10 || saving) && "opacity-50 cursor-not-allowed"
        )}
      />
    </div>
  );
}
