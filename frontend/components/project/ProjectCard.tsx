"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Database,
  Globe,
  Trash2,
  ExternalLink,
  MoreHorizontal,
  Clock,
  Pencil,
  RefreshCw,
  GitBranch,
} from "lucide-react";
import type { Project } from "@/types";
import { StatusBadge } from "@components/ui/Badge";
import { formatRelativeTime } from "@/lib/utils";
import { projectsApi } from "@/lib/api";

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => Promise<void>;
  onRegenerate?: (id: string) => void;
}

export default function ProjectCard({
  project,
  onDelete,
  onRegenerate,
}: ProjectCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!onDelete) return;
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;

    try {
      setIsDeleting(true);
      setMenuOpen(false);
      await onDelete(project.id);
    } catch {
      setIsDeleting(false);
    }
  }

  async function handleRegenerate(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);

    if (
      !confirm(
        `Regenerate "${project.name}"? This will overwrite the existing output.`
      )
    )
      return;

    try {
      setIsRegenerating(true);
      await projectsApi.regenerate(project.id);
      if (onRegenerate) onRegenerate(project.id);
      router.push(`/dashboard/projects/${project.id}`);
    } catch {
      // ignore – user can navigate manually
    } finally {
      setIsRegenerating(false);
    }
  }

  const entityCount = project.schema?.entities.length ?? 0;
  const endpointCount = project.schema?.endpoints.length ?? 0;
  const fileCount = project.generatedOutput?.files.length ?? 0;

  const isBusy = isDeleting || isRegenerating;

  return (
    <div
      className={`glass-card p-5 flex flex-col gap-4 group hover:border-slate-600/80 transition-all duration-300 ${
        isBusy ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/projects/${project.id}`}
              className="font-semibold text-white hover:text-indigo-300 transition-colors line-clamp-1 text-base"
            >
              {project.name}
            </Link>
          </div>
          <p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">
            {project.description || project.prompt}
          </p>
        </div>

        {/* Actions menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(!menuOpen);
            }}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 glass-card py-1 z-20 shadow-xl shadow-black/30">
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View details
                </Link>

                <Link
                  href={`/dashboard/projects/${project.id}/edit`}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit project
                </Link>

                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`}
                  />
                  Regenerate
                </button>

                {onDelete && (
                  <>
                    <div className="my-1 border-t border-slate-700/60" />
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete project
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={project.status} size="sm" />
        {project.schema?.techStack?.backend && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
            {project.schema.techStack.backend}
          </span>
        )}
        {project.schema?.techStack?.database && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
            {project.schema.techStack.database}
          </span>
        )}
      </div>

      {/* Stats */}
      {(entityCount > 0 || endpointCount > 0 || fileCount > 0) && (
        <div className="flex items-center gap-4 text-xs text-slate-500">
          {entityCount > 0 && (
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              {entityCount} {entityCount === 1 ? "entity" : "entities"}
            </span>
          )}
          {endpointCount > 0 && (
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              {endpointCount} endpoints
            </span>
          )}
          {fileCount > 0 && (
            <span className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              {fileCount} files
            </span>
          )}
        </div>
      )}

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-indigo-950/50 border border-indigo-800/40 text-indigo-400">
              #{tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="text-xs text-slate-600">+{project.tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
        <span className="flex items-center gap-1.5 text-xs text-slate-600">
          <Clock className="w-3 h-3" />
          {formatRelativeTime(project.createdAt)}
        </span>
        <Link
          href={`/dashboard/projects/${project.id}`}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
        >
          View project
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
