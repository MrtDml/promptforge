"use client";

import Link from "next/link";
import {
  Plus,
  Zap,
  RefreshCw,
  AlertCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useProjects } from "@/hooks/useProjects";
import { getStoredUser } from "@/lib/auth";
import type { User } from "@/types";
import ProjectCard from "@components/project/ProjectCard";
import { StatusBadge } from "@components/ui/Badge";
import { formatRelativeTime } from "@/lib/utils";

// ─── Plan config ─────────────────────────────────────────────────────────────

const PLAN_LIMITS: Record<string, number> = {
  free: 3,
  starter: 50,
  pro: Infinity,
  enterprise: Infinity,
};

const PLAN_COLORS: Record<string, string> = {
  free: "bg-slate-700/60 border-slate-600/50 text-slate-300",
  starter: "bg-blue-600/20 border-blue-500/40 text-blue-300",
  pro: "bg-indigo-600/20 border-indigo-500/40 text-indigo-300",
  enterprise: "bg-purple-600/20 border-purple-500/40 text-purple-300",
};

export default function DashboardPage() {
  const { projects, isLoading, error, total, refreshProjects, deleteProject } =
    useProjects();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const plan = user?.plan ?? "free";
  const generationsUsed = user?.generationsUsed ?? 0;
  const generationsLimit = user?.generationsLimit ?? PLAN_LIMITS[plan] ?? 3;
  const usagePct =
    generationsLimit === Infinity
      ? 0
      : Math.min(100, Math.round((generationsUsed / generationsLimit) * 100));

  const completedCount = projects.filter((p) => p.status === "completed").length;
  const failedCount = projects.filter((p) => p.status === "failed").length;
  const inProgressCount = projects.filter((p) =>
    ["pending", "parsing", "generating"].includes(p.status)
  ).length;

  // Last 5 projects sorted newest-first for the Recent Activity section
  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">
              {greeting()}, {user?.name?.split(" ")[0] ?? "there"}
            </h1>
            {user?.plan && (
              <span
                className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${PLAN_COLORS[plan]}`}
              >
                {plan === "enterprise" ? "Enterprise" : plan === "pro" ? "Pro" : plan === "starter" ? "Starter" : "Free"} plan
              </span>
            )}
          </div>
          <p className="text-slate-400 mt-1">
            {total > 0
              ? `You have ${total} project${total !== 1 ? "s" : ""} in your workspace.`
              : "Start by creating your first AI-generated project."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshProjects}
            disabled={isLoading}
            className="btn-ghost gap-2"
            title="Refresh projects"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline text-sm">Refresh</span>
          </button>
          <Link href="/dashboard/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            New project
          </Link>
        </div>
      </div>

      {/* ── Usage bar (non-enterprise) ────────────────────────────────────── */}
      {plan !== "enterprise" && (
        <div className="glass-card px-5 py-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-300 font-medium">
              Generation usage
            </p>
            <p className="text-xs text-slate-500">
              {generationsUsed} / {generationsLimit} projects
            </p>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                usagePct >= 90
                  ? "bg-red-500"
                  : usagePct >= 70
                  ? "bg-yellow-500"
                  : "bg-indigo-500"
              }`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
          {usagePct >= 80 && (
            <p className="text-xs text-yellow-400 mt-2">
              Running low on generations.{" "}
              <Link href="/pricing" className="underline hover:text-yellow-300">
                Upgrade your plan
              </Link>{" "}
              to get more.
            </p>
          )}
        </div>
      )}

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Projects",
            value: total,
            icon: Zap,
            color: "text-indigo-400",
          },
          {
            label: "Completed",
            value: completedCount,
            icon: CheckCircle2,
            color: "text-green-400",
          },
          {
            label: "In Progress",
            value: inProgressCount,
            icon: Loader2,
            color: "text-blue-400",
          },
          {
            label: "Failed",
            value: failedCount,
            icon: XCircle,
            color: "text-red-400",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card px-5 py-4 flex items-start gap-3">
            <stat.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${stat.color}`} />
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-slate-400 text-sm mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Error state ───────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 mb-6">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium text-sm">
              Failed to load projects
            </p>
            <p className="text-red-400/70 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* ── Loading state ─────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-3">
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-3/4" />
              <div className="flex gap-2 pt-2">
                <div className="skeleton h-6 w-16 rounded-full" />
                <div className="skeleton h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      {!isLoading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center mb-6">
            <Zap className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No projects yet
          </h3>
          <p className="text-slate-400 max-w-sm mb-8">
            Generate your first SaaS application by describing what you want to
            build in plain English.
          </p>
          <Link href="/dashboard/new" className="btn-primary px-8 py-3">
            <Plus className="w-4 h-4" />
            Create your first project
          </Link>
        </div>
      )}

      {/* ── Project grid ──────────────────────────────────────────────────── */}
      {!isLoading && projects.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">All Projects</h2>
            <Link
              href="/dashboard/history"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              Full history
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={deleteProject}
              />
            ))}
          </div>

          {/* ── Recent Activity ─────────────────────────────────────────── */}
          <div className="mb-2">
            <h2 className="text-lg font-semibold text-white mb-4">
              Recent Activity
            </h2>
            <div className="glass-card divide-y divide-slate-700/40">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-800/40 transition-colors"
                >
                  <StatusBadge status={project.status} size="sm" />
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="flex-1 min-w-0 text-sm text-slate-200 hover:text-indigo-300 transition-colors font-medium truncate"
                  >
                    {project.name}
                  </Link>
                  <span className="flex items-center gap-1.5 text-xs text-slate-600 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(project.updatedAt)}
                  </span>
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex-shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
