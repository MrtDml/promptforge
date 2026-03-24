"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useSingleProject } from "@/hooks/useProjects";
import ProjectDetail from "@components/project/ProjectDetail";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { project, isLoading, error, refreshProject } = useSingleProject(id);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to dashboard
      </Link>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-6">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-4 w-96" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-xl" />
            ))}
          </div>
          <div className="skeleton h-96 rounded-xl" />
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-5">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Failed to load project
          </h3>
          <p className="text-slate-400 mb-6">{error}</p>
          <div className="flex items-center gap-3">
            <button onClick={refreshProject} className="btn-secondary">
              Try again
            </button>
            <Link href="/dashboard" className="btn-primary">
              Go to dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Project detail */}
      {!isLoading && !error && project && (
        <ProjectDetail project={project} onRefresh={refreshProject} />
      )}
    </div>
  );
}
