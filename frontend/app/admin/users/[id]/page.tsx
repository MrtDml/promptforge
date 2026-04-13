"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { AdminUser } from "@/types";
import {
  ArrowLeft,
  Save,
  Trash2,
  Shield,
  User,
  FolderOpen,
  AlertTriangle,
} from "lucide-react";

const PLAN_OPTIONS = ["free", "starter", "pro"];
const ROLE_OPTIONS = ["USER", "ADMIN"];

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [planType, setPlanType] = useState("free");
  const [role, setRole] = useState("USER");
  const [isActive, setIsActive] = useState(true);
  const [generationsLimit, setGenerationsLimit] = useState(3);
  const [generationsUsed, setGenerationsUsed] = useState(0);

  useEffect(() => {
    adminApi
      .getUserById(id)
      .then((res) => {
        const u: AdminUser = res.data;
        setUser(u);
        setName(u.name);
        setPlanType(u.planType ?? "free");
        setRole(u.role ?? "USER");
        setIsActive(u.isActive);
        setGenerationsLimit(u.generationsLimit);
        setGenerationsUsed(u.generationsUsed);
      })
      .catch(() => setError("Kullanıcı bulunamadı"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await adminApi.updateUser(id, {
        name,
        planType,
        role,
        isActive,
        generationsLimit,
        generationsUsed,
      });
      setSuccess("Değişiklikler kaydedildi.");
    } catch {
      setError("Değişiklikler kaydedilemedi.");
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
      await adminApi.deleteUser(id);
      router.push("/admin/users");
    } catch {
      setError("Kullanıcı silinemedi.");
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

  if (error && !user) {
    return <div className="p-8 text-center text-slate-400">{error}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-5">Edit User</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-950/50 border border-red-800/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-800/50 rounded-lg text-emerald-300 text-sm">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Email</label>
                <input
                  value={user?.email ?? ""}
                  disabled
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-500 text-sm cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Plan</label>
                  <select
                    value={planType}
                    onChange={(e) => setPlanType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                  >
                    {PLAN_OPTIONS.map((p) => (
                      <option key={p} value={p} className="bg-slate-800">
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r} className="bg-slate-800">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">
                    Generation Limit
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={generationsLimit}
                    onChange={(e) => setGenerationsLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">
                    Generations Used
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={generationsUsed}
                    onChange={(e) => setGenerationsUsed(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  onClick={() => setIsActive((v) => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    isActive ? "bg-emerald-600" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-slate-300">
                  {isActive ? "Account Active" : "Account Banned"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
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

          {/* Danger zone */}
          <div className="bg-slate-900 border border-red-900/40 rounded-xl p-6">
            <h2 className="text-base font-semibold text-red-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Danger Zone
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Permanently delete this user and all their projects. This cannot be undone.
            </p>
            {confirmDelete && (
              <p className="text-sm text-red-300 mb-3 font-medium">
                Are you sure? Click again to confirm permanent deletion.
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
              {deleting ? "Deleting…" : confirmDelete ? "Confirm Delete" : "Delete User"}
            </button>
          </div>
        </div>

        {/* Info panel */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Account Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                {user?.role === "ADMIN" ? (
                  <Shield className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
                <span>{user?.role === "ADMIN" ? "Administrator" : "Regular User"}</span>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Email verified</p>
                <p className={user?.emailVerified ? "text-emerald-400" : "text-amber-400"}>
                  {user?.emailVerified ? "Verified" : "Not Verified"}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Joined</p>
                <p className="text-slate-300">{user ? formatDate(user.createdAt) : "—"}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Last updated</p>
                <p className="text-slate-300">{user ? formatDate(user.updatedAt) : "—"}</p>
              </div>
            </div>
          </div>

          {/* Projects mini list */}
          {user?.projects && user.projects.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FolderOpen className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-300">
                  Projects ({user._count?.projects ?? user.projects.length})
                </h3>
              </div>
              <div className="space-y-2">
                {user.projects.slice(0, 8).map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <p className="text-xs text-slate-300 truncate max-w-[120px]">{p.name}</p>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        p.status === "COMPLETED"
                          ? "bg-emerald-950 text-emerald-400"
                          : p.status === "FAILED"
                          ? "bg-red-950 text-red-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {p.status.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
