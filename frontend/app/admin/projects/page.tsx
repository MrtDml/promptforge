"use client";

import { useEffect, useState, useCallback } from "react";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { AdminProject } from "@/types";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ExternalLink,
} from "lucide-react";

const STATUS_OPTIONS = ["", "PENDING", "GENERATING", "COMPLETED", "FAILED"];

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "bg-emerald-950 text-emerald-400 border-emerald-800/50",
  FAILED: "bg-red-950 text-red-400 border-red-800/50",
  GENERATING: "bg-blue-950 text-blue-400 border-blue-800/50",
  PENDING: "bg-slate-800 text-slate-400 border-slate-700/50",
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getProjects(
        page,
        20,
        status || undefined,
        search || undefined,
      );
      const response = res.data;
      setProjects(response.data ?? []);
      setTotal(response.total ?? 0);
      setTotalPages(response.totalPages ?? 1);
    } catch {
      // empty state
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  async function handleDelete(id: string) {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    setDeletingId(id);
    try {
      await adminApi.deleteProject(id);
      fetchProjects();
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 text-sm mt-0.5">{total} total projects</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or user…"
              className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>
        </form>

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-slate-800">
              {s === "" ? "All Statuses" : s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No projects found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Project</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Owner</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Deploy</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Created</th>
                  <th className="text-right px-4 py-3 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white truncate max-w-[180px]">
                        {project.name}
                      </p>
                      {project.tags.length > 0 && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {project.tags.slice(0, 3).join(", ")}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-300 text-xs">{project.user.name}</p>
                      <p className="text-slate-500 text-xs">{project.user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                          STATUS_COLORS[project.status] ?? "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {project.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-500">
                        {project.deployStatus ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {formatDate(project.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(project.id)}
                          disabled={deletingId === project.id}
                          title={confirmId === project.id ? "Click again to confirm" : "Delete project"}
                          className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                            confirmId === project.id
                              ? "text-white bg-red-600 hover:bg-red-500"
                              : "text-slate-500 hover:text-red-400 hover:bg-red-950/40"
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <a
                          href={`/dashboard/projects/${project.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
                          title="View project"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
