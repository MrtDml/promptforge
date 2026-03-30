"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  BookOpen,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
  X,
  Shield,
  Star,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAuthState } from "@/lib/auth";
import { authApi } from "@/lib/api";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "Settings", href: "/admin/settings", icon: Settings },
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
          ? "text-rose-400 bg-rose-950/50 border border-rose-800/40 font-medium"
          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
      )}
    >
      <item.icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">{item.label}</span>
      {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
    </Link>
  );
}

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps = {}) {
  const router = useRouter();

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
        <Link href="/admin" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm text-white tracking-tight block">
              PromptForge
            </span>
            <span className="text-xs text-rose-400 font-medium">Admin Panel</span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-2 mt-1">
          Management
        </p>
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} onClick={onClose} />
        ))}
      </nav>

      {/* Back to app + logout */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
        >
          <Zap className="w-4 h-4 flex-shrink-0" />
          <span>Back to App</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
