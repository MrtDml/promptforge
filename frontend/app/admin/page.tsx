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
      .catch(() => setError("İstatistikler yüklenemedi"))
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
      <div className="p-8 text-center text-slate-400">{error || "Veri bulunamadı"}</div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Platform özeti — {formatDate(new Date().toISOString())}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Toplam Kullanıcı"
          value={stats.users.total}
          sub={`+${stats.users.newThisWeek} bu hafta`}
          icon={Users}
          color="bg-indigo-600"
        />
        <StatCard
          title="Aktif Kullanıcı"
          value={stats.users.active}
          sub={`Toplamın %${Math.round((stats.users.active / (stats.users.total || 1)) * 100)}'i`}
          icon={UserCheck}
          color="bg-emerald-600"
        />
        <StatCard
          title="Toplam Proje"
          value={stats.projects.total}
          sub={`+${stats.projects.newThisWeek} bu hafta`}
          icon={FolderOpen}
          color="bg-blue-600"
        />
        <StatCard
          title="Tamamlanan Proje"
          value={stats.projects.completed}
          sub={`%${Math.round((stats.projects.completed / (stats.projects.total || 1)) * 100)} başarı oranı`}
          icon={CheckCircle}
          color="bg-violet-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Blog Yazısı"
          value={stats.blog.total}
          sub={`${stats.blog.published} yayında`}
          icon={BookOpen}
          color="bg-amber-600"
        />
        <StatCard
          title="Yeni Kullanıcı (7g)"
          value={stats.users.newThisWeek}
          icon={TrendingUp}
          color="bg-rose-600"
        />
        <StatCard
          title="Yeni Proje (7g)"
          value={stats.projects.newThisWeek}
          icon={Activity}
          color="bg-cyan-600"
        />
        <StatCard
          title="Taslak Yazı"
          value={stats.blog.total - stats.blog.published}
          sub="yayınlanmamış"
          icon={BookOpen}
          color="bg-slate-600"
        />
      </div>

      {/* Plan breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Plan Dağılımı</h2>
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
                      {item.count} kullanıcı (%{pct})
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
