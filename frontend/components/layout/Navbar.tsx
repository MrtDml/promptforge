"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Bell,
  LogOut,
  ChevronDown,
  User,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import { getStoredUser, clearAuthState } from "@/lib/auth";
import { authApi } from "@/lib/api";

interface NavbarProps {
  onMenuToggle?: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const router = useRouter();
  const user = getStoredUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    clearAuthState();
    router.push("/login");
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-30">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white tracking-tight hidden sm:block">
          PromptForge
        </span>
      </Link>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-1 ml-4">
        <Link href="/dashboard" className="nav-link text-sm">
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Link href="/dashboard/new" className="nav-link text-sm">
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </nav>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="btn-ghost p-2 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white leading-tight">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-slate-500 leading-tight">
                {user?.plan === "pro" ? "Pro" : user?.plan === "starter" ? "Starter" : "Free"} plan
              </p>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-52 glass-card py-1 z-20 shadow-xl shadow-black/30">
                <div className="px-4 py-3 border-b border-slate-700/60">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile & Settings
                  </Link>
                </div>
                <div className="py-1 border-t border-slate-700/60">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="btn-ghost p-2 md:hidden"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
