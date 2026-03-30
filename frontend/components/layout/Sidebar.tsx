"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  FolderOpen,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
  HelpCircle,
  BookOpen,
  Clock,
  X,
  ArrowUpCircle,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getStoredUser, clearAuthState } from "@/lib/auth";
import { authApi } from "@/lib/api";
import type { User } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: string;
}

const mainNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "New Project",
    href: "/dashboard/new",
    icon: Plus,
  },
  {
    label: "All Projects",
    href: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: Clock,
  },
];

const bottomNav: NavItem[] = [
  {
    label: "Documentation",
    href: "/docs",
    icon: BookOpen,
  },
  {
    label: "Help & Support",
    href: "/support",
    icon: HelpCircle,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
        isActive
          ? "text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 font-medium"
          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
      )}
    >
      <item.icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="text-xs bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
      {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
    </Link>
  );
}

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps = {}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    clearAuthState();
    router.push("/login");
  }

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col h-full bg-slate-900 border-r border-slate-800">
      {/* Logo */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            PromptForge
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-2">
            Workspace
          </p>
          {mainNav.map((item) => (
            <NavLink key={item.href} item={item} onClick={onClose} />
          ))}
        </div>

        {/* Quick new project CTA */}
        <Link
          href="/dashboard/new"
          onClick={onClose}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-indigo-600/20 border border-indigo-600/30 hover:bg-indigo-600/30 transition-all text-indigo-300 text-sm font-medium group"
        >
          <Plus className="w-4 h-4" />
          Generate new app
          <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </nav>

      {/* Bottom section */}
      <div className="p-3 space-y-1 border-t border-slate-800">
        {bottomNav.map((item) => (
          <NavLink key={item.href} item={item} onClick={onClose} />
        ))}
        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
          >
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">Admin Panel</span>
          </Link>
        )}
      </div>

      {/* Upgrade card — only for non-admin free/starter users */}
      {user?.role !== "ADMIN" && user?.plan !== "pro" && user?.plan !== "enterprise" && (
        <div className="px-3 pb-2">
          <div className="rounded-xl bg-indigo-950/60 border border-indigo-800/40 p-3">
            {/* Usage bar */}
            {user?.generationsLimit != null && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400">Generations</span>
                  <span className="text-xs text-slate-500">
                    {user.generationsUsed ?? 0} / {user.generationsLimit}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500",
                      ((user.generationsUsed ?? 0) / user.generationsLimit) >= 0.8
                        ? "bg-red-500"
                        : "bg-indigo-500"
                    )}
                    style={{
                      width: `${Math.min(100, Math.round(((user.generationsUsed ?? 0) / user.generationsLimit) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}
            <Link
              href="/pricing"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-xs font-semibold"
            >
              <ArrowUpCircle className="w-3.5 h-3.5" />
              Upgrade to Pro
            </Link>
          </div>
        </div>
      )}

      {/* User profile strip */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name ?? "User"}
            </p>
            <Link
              href="/pricing"
              onClick={onClose}
              className={cn(
                "text-xs truncate hover:underline",
                user?.plan === "pro" || user?.plan === "enterprise"
                  ? "text-indigo-400"
                  : "text-slate-500 hover:text-indigo-400"
              )}
            >
              {user?.role === "ADMIN" ? "Administrator" : user?.plan === "pro" ? "Pro plan" : user?.plan === "starter" ? "Starter plan" : "Free plan — Upgrade"}
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-400 text-slate-500"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
