"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { AdminStats } from "@/types";
import {
  Users,
  FolderOpen,
  BookOpen,
  TrendingUp,
  CheckCircle,
  UserCheck,
  Activity,
} from "lucide-react";

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-400">{title}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4.5 h-4.5 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getStats()
      .then((res) => setStats(res.data))
      .catch(() => setError("Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center text-slate-400">{error || "No data"}</div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Platform overview — {formatDate(new Date().toISOString())}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={stats.users.total}
          sub={`+${stats.users.newThisWeek} this week`}
          icon={Users}
          color="bg-indigo-600"
        />
        <StatCard
          title="Active Users"
          value={stats.users.active}
          sub={`${Math.round((stats.users.active / (stats.users.total || 1)) * 100)}% of total`}
          icon={UserCheck}
          color="bg-emerald-600"
        />
        <StatCard
          title="Total Projects"
          value={stats.projects.total}
          sub={`+${stats.projects.newThisWeek} this week`}
          icon={FolderOpen}
          color="bg-blue-600"
        />
        <StatCard
          title="Completed Projects"
          value={stats.projects.completed}
          sub={`${Math.round((stats.projects.completed / (stats.projects.total || 1)) * 100)}% success rate`}
          icon={CheckCircle}
          color="bg-violet-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Blog Posts"
          value={stats.blog.total}
          sub={`${stats.blog.published} published`}
          icon={BookOpen}
          color="bg-amber-600"
        />
        <StatCard
          title="New Users (7d)"
          value={stats.users.newThisWeek}
          icon={TrendingUp}
          color="bg-rose-600"
        />
        <StatCard
          title="New Projects (7d)"
          value={stats.projects.newThisWeek}
          icon={Activity}
          color="bg-cyan-600"
        />
        <StatCard
          title="Draft Posts"
          value={stats.blog.total - stats.blog.published}
          sub="unpublished"
          icon={BookOpen}
          color="bg-slate-600"
        />
      </div>

      {/* Plan breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Plan Distribution</h2>
        <div className="space-y-3">
          {stats.planBreakdown
            .sort((a, b) => b.count - a.count)
            .map((item) => {
              const pct = Math.round((item.count / (stats.users.total || 1)) * 100);
              const colors: Record<string, string> = {
                free: "bg-slate-500",
                starter: "bg-blue-500",
                pro: "bg-indigo-500",
              };
              const barColor = colors[item.plan] ?? "bg-slate-500";
              return (
                <div key={item.plan}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300 capitalize">{item.plan}</span>
                    <span className="text-sm text-slate-400">
                      {item.count} users ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${barColor} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
