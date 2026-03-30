"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { AdminUser } from "@/types";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  UserX,
  UserCheck,
  Shield,
  User,
} from "lucide-react";

const PLAN_COLORS: Record<string, string> = {
  free: "bg-slate-800 text-slate-300",
  starter: "bg-blue-950 text-blue-300 border border-blue-800/50",
  pro: "bg-indigo-950 text-indigo-300 border border-indigo-800/50",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers(page, 20, search || undefined);
      const response = res.data;
      setUsers(response.data ?? []);
      setTotal(response.total ?? 0);
      setTotalPages(response.totalPages ?? 1);
    } catch {
      // error handled via empty state
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  async function toggleActive(user: AdminUser) {
    try {
      await adminApi.updateUser(user.id, { isActive: !user.isActive });
      fetchUsers();
    } catch {
      // ignore
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-slate-400 text-sm mt-0.5">{total} total members</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-5">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
      </form>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">User</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Plan</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Role</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Generations</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Joined</th>
                  <th className="text-right px-4 py-3 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          PLAN_COLORS[user.planType ?? "free"] ?? "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {user.planType ?? "free"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs">
                        {user.role === "ADMIN" ? (
                          <><Shield className="w-3 h-3 text-rose-400" /><span className="text-rose-400">Admin</span></>
                        ) : (
                          <><User className="w-3 h-3 text-slate-500" /><span className="text-slate-500">User</span></>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs">
                      {user.generationsUsed} / {user.generationsLimit}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          user.isActive
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                            : "bg-red-950 text-red-400 border border-red-800/50"
                        }`}
                      >
                        {user.isActive ? "Active" : "Banned"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleActive(user)}
                          title={user.isActive ? "Ban user" : "Activate user"}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.isActive
                              ? "text-slate-500 hover:text-red-400 hover:bg-red-950/40"
                              : "text-slate-500 hover:text-emerald-400 hover:bg-emerald-950/40"
                          }`}
                        >
                          {user.isActive ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
                          title="View & edit"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
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
