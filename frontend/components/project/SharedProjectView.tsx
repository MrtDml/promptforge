"use client";

import { Database, FileCode2, Layers, Globe, Calendar } from "lucide-react";
import Link from "next/link";

interface SharedProject {
  id: string;
  name: string;
  description?: string;
  appName?: string;
  entityCount?: number;
  fileCount?: number;
  features?: string[];
  generatedFiles?: Record<string, string>;
  status: string;
  createdAt: string;
  user?: { name: string };
}

export default function SharedProjectView({ project }: { project: SharedProject }) {
  const files = project.generatedFiles
    ? Object.entries(project.generatedFiles as Record<string, string>)
    : [];

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white">
      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            PromptForge
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Globe className="w-3.5 h-3.5" />
            Public project
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Hero */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">{project.name}</h1>
          {project.description && (
            <p className="text-slate-400 text-base">{project.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            {project.user?.name && (
              <span>By <span className="text-slate-300">{project.user.name}</span></span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(project.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Database, label: "Entities", value: project.entityCount ?? 0 },
            { icon: FileCode2, label: "Files", value: project.fileCount ?? 0 },
            { icon: Layers, label: "Features", value: project.features?.length ?? 0 },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-center">
              <Icon className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
            <h2 className="text-sm font-semibold text-slate-300 mb-3">Features</h2>
            <div className="flex flex-wrap gap-2">
              {project.features.map((f) => (
                <span key={f} className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 text-xs">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Files */}
        {files.length > 0 && (
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
            <h2 className="text-sm font-semibold text-slate-300 mb-3">Generated Files ({files.length})</h2>
            <div className="divide-y divide-slate-800">
              {files.map(([path]) => (
                <div key={path} className="py-2 flex items-center gap-2">
                  <FileCode2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="font-mono text-xs text-slate-400">{path}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-xl bg-indigo-950/40 border border-indigo-800/30 p-6 text-center space-y-3">
          <h3 className="text-base font-semibold text-white">Build your own SaaS in minutes</h3>
          <p className="text-sm text-slate-400">PromptForge generates production-ready code from your idea.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
          >
            Start for free
          </Link>
        </div>
      </main>
    </div>
  );
}
