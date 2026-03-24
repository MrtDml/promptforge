"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Clock,
  Zap,
  Database,
  AlertCircle,
  Filter,
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { projectsApi, generatorApi } from "@/lib/api";
import { StatusBadge } from "@components/ui/Badge";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import type { ProjectStatus, Project } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortField = "name" | "status" | "createdAt" | "entities";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: ProjectStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "completed", label: "Completed" },
  { value: "generating", label: "Generating" },
  { value: "parsing", label: "Parsing" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

// ─── Sort indicator ───────────────────────────────────────────────────────────

function SortIcon({
  field,
  active,
  dir,
}: {
  field: string;
  active: string;
  dir: SortDir;
}) {
  if (field !== active)
    return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-600 ml-1" />;
  return dir === "asc" ? (
    <ChevronUp className="w-3.5 h-3.5 text-indigo-400 ml-1" />
  ) : (
    <ChevronDown className="w-3.5 h-3.5 text-indigo-400 ml-1" />
  );
}

// ─── Row actions ─────────────────────────────────────────────────────────────

function RowActions({
  project,
  onDelete,
  onRegenerate,
}: {
  project: Project;
  onDelete: (id: string) => Promise<void>;
  onRegenerate: (id: string) => void;
}) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [downloadError, setDownloadError] = useState(false);

  async function handleDownload() {
    setDownloadError(false);
    try {
      setDownloading(true);
      await generatorApi.downloadProject(project.id, `${project.name}.zip`);
    } catch {
      setDownloadError(true);
      setTimeout(() => setDownloadError(false), 3000);
    } finally {
      setDownloading(false);
    }
  }

  async function handleRegenerate() {
    if (
      !confirm(
        `Regenerate "${project.name}"? This will overwrite the existing output.`
      )
    )
      return;
    try {
      setRegenerating(true);
      await projectsApi.regenerate(project.id);
      onRegenerate(project.id);
      router.push(`/dashboard/projects/${project.id}`);
    } catch {
      setRegenerating(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    try {
      setDeleting(true);
      await onDelete(project.id);
    } catch {
      setDeleting(false);
    }
  }

  const busy = downloading || regenerating || deleting;

  return (
    <div className="flex items-center gap-1 justify-end">
      <Link
        href={`/dashboard/projects/${project.id}`}
        title="View project"
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-700/60 transition-colors"
      >
        <Eye className="w-4 h-4" />
      </Link>

      {project.status === "completed" && (
        <button
          onClick={handleDownload}
          disabled={busy}
          title={downloadError ? "Download failed — try again" : "Download ZIP"}
          className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
            downloadError
              ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
              : "text-slate-500 hover:text-slate-200 hover:bg-slate-700/60"
          }`}
        >
          {downloading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
        </button>
      )}

      <button
        onClick={handleRegenerate}
        disabled={busy}
        title="Regenerate"
        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-300 hover:bg-indigo-600/10 transition-colors disabled:opacity-40"
      >
        {regenerating ? (
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
      </button>

      <button
        onClick={handleDelete}
        disabled={busy}
        title="Delete project"
        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
      >
        {deleting ? (
          <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const { projects, isLoading, error, deleteProject, refreshProjects } =
    useProjects();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  // ── Sort toggle ────────────────────────────────────────────────────────────
  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(1);
  }

  // ── Filtered + sorted list ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...projects];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((p) => p.status === statusFilter);
    }

    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
        case "entities":
          cmp =
            (a.schema?.entities.length ?? 0) -
            (b.schema?.entities.length ?? 0);
          break;
        case "createdAt":
        default:
          cmp =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [projects, search, statusFilter, sortField, sortDir]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1);
    },
    []
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(e.target.value as ProjectStatus | "all");
      setPage(1);
    },
    []
  );

  // ─── Th helper ─────────────────────────────────────────────────────────────
  function Th({
    field,
    children,
    className = "",
  }: {
    field: SortField;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <th className={`px-4 py-3 text-left ${className}`}>
        <button
          onClick={() => toggleSort(field)}
          className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
        >
          {children}
          <SortIcon field={field} active={sortField} dir={sortDir} />
        </button>
      </th>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Project History</h1>
          <p className="text-slate-400 mt-1">
            {filtered.length > 0
              ? `${filtered.length} project${filtered.length !== 1 ? "s" : ""} found`
              : "No projects match your filters"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshProjects}
            disabled={isLoading}
            className="btn-ghost gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline text-sm">Refresh</span>
          </button>
          <Link href="/dashboard/new" className="btn-primary text-sm">
            <Zap className="w-4 h-4" />
            New project
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by project name..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              ×
            </button>
          )}
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="appearance-none bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-8 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-colors cursor-pointer"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 mb-6">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="glass-card divide-y divide-slate-700/40">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <div className="skeleton h-4 w-48" />
              <div className="skeleton h-5 w-20 rounded-full ml-auto" />
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-4 w-32" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center mb-6">
            <Clock className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No project history yet
          </h3>
          <p className="text-slate-400 max-w-sm mb-8">
            Your generated projects will appear here. Start by creating your
            first project.
          </p>
          <Link href="/dashboard/new" className="btn-primary px-8 py-3">
            <Zap className="w-4 h-4" />
            Create first project
          </Link>
        </div>
      )}

      {/* No filter results */}
      {!isLoading && !error && projects.length > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="w-10 h-10 text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No results found
          </h3>
          <p className="text-slate-400 text-sm">
            Try adjusting your search or filter.
          </p>
          <button
            onClick={() => { setSearch(""); setStatusFilter("all"); setPage(1); }}
            className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && paginated.length > 0 && (
        <>
          <div className="glass-card overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700/60 bg-slate-800/40">
                  <tr>
                    <Th field="name" className="min-w-[200px]">
                      Project name
                    </Th>
                    <Th field="status">Status</Th>
                    <Th field="entities">Entities</Th>
                    <Th field="createdAt">Created</Th>
                    <th className="px-4 py-3 text-right">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40">
                  {paginated.map((project) => {
                    const entityCount = project.schema?.entities.length ?? 0;
                    return (
                      <tr
                        key={project.id}
                        className="group hover:bg-slate-800/30 transition-colors"
                      >
                        {/* Name */}
                        <td className="px-4 py-3.5">
                          <div>
                            <Link
                              href={`/dashboard/projects/${project.id}`}
                              className="font-medium text-white hover:text-indigo-300 transition-colors line-clamp-1"
                            >
                              {project.name}
                            </Link>
                            {project.description && (
                              <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                                {project.description}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <StatusBadge status={project.status} size="sm" />
                        </td>

                        {/* Entities */}
                        <td className="px-4 py-3.5">
                          {entityCount > 0 ? (
                            <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                              <Database className="w-3.5 h-3.5" />
                              {entityCount}
                            </span>
                          ) : (
                            <span className="text-slate-700 text-xs">—</span>
                          )}
                        </td>

                        {/* Created */}
                        <td className="px-4 py-3.5">
                          <div>
                            <p className="text-slate-300 text-xs">
                              {formatDate(project.createdAt)}
                            </p>
                            <p className="text-slate-600 text-xs mt-0.5">
                              {formatRelativeTime(project.createdAt)}
                            </p>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <RowActions
                            project={project}
                            onDelete={deleteProject}
                            onRegenerate={() => refreshProjects()}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-slate-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length} projects
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - page) <= 1
                  )
                  .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                      acc.push("...");
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="text-slate-600 px-1">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          page === p
                            ? "bg-indigo-600 text-white"
                            : "text-slate-400 hover:text-white hover:bg-slate-700"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
