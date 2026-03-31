"use client";

import "highlight.js/styles/atom-one-dark.css";
import { useState, useEffect, useRef, useMemo } from "react";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import yaml from "highlight.js/lib/languages/yaml";
import markdown from "highlight.js/lib/languages/markdown";
import sql from "highlight.js/lib/languages/sql";
import bash from "highlight.js/lib/languages/bash";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import plaintext from "highlight.js/lib/languages/plaintext";

hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("plaintext", plaintext);

const HLJS_LANG: Record<string, string> = {
  typescript: "typescript",
  javascript: "javascript",
  json: "json",
  yaml: "yaml",
  markdown: "markdown",
  sql: "sql",
  bash: "bash",
  dockerfile: "bash",
  css: "css",
  html: "xml",
  prisma: "plaintext",
  graphql: "plaintext",
  text: "plaintext",
};
import {
  FileCode2,
  Database,
  Globe,
  Download,
  Copy,
  CheckCheck,
  Clock,
  ChevronDown,
  ChevronRight,
  Terminal,
  BookOpen,
  Layers,
  RefreshCw,
  Loader2,
  HardDrive,
  AlertCircle,
  Rocket,
  Github,
  Share2,
  Link as LinkIcon,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Star,
} from "lucide-react";
import type { Project, GeneratedFile } from "@/types";
import { StatusBadge } from "@components/ui/Badge";
import SchemaPreview from "@components/prompt/SchemaPreview";
import DeployPanel from "@components/project/DeployPanel";
import GitHubExportModal from "@components/project/GitHubExportModal";
import AIChatPanel from "@components/project/AIChatPanel";
import TagInput from "@components/project/TagInput";
import { formatDate, formatRelativeTime, getLanguageFromPath, cn } from "@/lib/utils";
import { generatorApi } from "@/lib/api";
import apiClient from "@/lib/api";

interface ProjectDetailProps {
  project: Project;
  onRefresh?: () => void;
  onProjectUpdate?: (updated: Partial<Project>) => void;
}

function FileTreeItem({
  file,
  isSelected,
  onClick,
}: {
  file: GeneratedFile;
  isSelected: boolean;
  onClick: () => void;
}) {
  const parts = file.path.split("/");
  const fileName = parts[parts.length - 1];
  const indent = (parts.length - 1) * 12;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs transition-colors",
        "hover:bg-slate-700/40",
        isSelected ? "bg-indigo-600/15 text-indigo-300" : "text-slate-400"
      )}
      style={{ paddingLeft: `${indent + 12}px` }}
    >
      <FileCode2 className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="font-mono truncate">{fileName}</span>
      <span className="ml-auto text-slate-600 text-xs">{file.language ?? getLanguageFromPath(file.path)}</span>
    </button>
  );
}

function CodeViewer({ file }: { file: GeneratedFile }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const language = file.language ?? getLanguageFromPath(file.path);
  const hlLang = HLJS_LANG[language] ?? "plaintext";

  useEffect(() => {
    const el = codeRef.current;
    if (!el) return;
    el.removeAttribute("data-highlighted");
    el.textContent = file.content;
    hljs.highlightElement(el);
  }, [file.content, hlLang]);

  const lineCount = useMemo(
    () => file.content.split("\n").length,
    [file.content]
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/60 bg-slate-800/60">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span className="text-sm text-slate-300 font-mono truncate">{file.path}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-400 flex-shrink-0">
            {language}
          </span>
          <span className="text-xs text-slate-600 flex-shrink-0">
            {lineCount} lines
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all text-xs flex-shrink-0 ml-2"
        >
          {copied ? (
            <><CheckCheck className="w-3.5 h-3.5 text-green-400" />Copied</>
          ) : (
            <><Copy className="w-3.5 h-3.5" />Copy</>
          )}
        </button>
      </div>
      <div className="flex-1 overflow-auto bg-slate-900/80">
        <pre className="p-4 m-0 font-mono leading-relaxed">
          <code ref={codeRef} className={`language-${hlLang} hljs`}>
            {file.content}
          </code>
        </pre>
      </div>
    </div>
  );
}

function groupFilesByDirectory(files: GeneratedFile[]) {
  const groups: Record<string, GeneratedFile[]> = {};
  files.forEach((file) => {
    const parts = file.path.split("/");
    const dir = parts.length > 1 ? parts.slice(0, -1).join("/") : ".";
    if (!groups[dir]) groups[dir] = [];
    groups[dir].push(file);
  });
  return groups;
}

/** Format bytes into a human-readable string, e.g. "42.1 KB". */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/** Sum the UTF-8 byte length of all file contents. */
function totalSizeBytes(files: GeneratedFile[]): number {
  return files.reduce((acc, f) => {
    try {
      return acc + new TextEncoder().encode(f.content).length;
    } catch {
      return acc + f.content.length;
    }
  }, 0);
}

// ── Quality Score ────────────────────────────────────────────────────────────

interface QualityDimension {
  label: string;
  score: number; // 0-100
  icon: React.ElementType;
  color: string;
  tip: string;
}

function computeQualityScore(project: Project, files: GeneratedFile[]): {
  overall: number;
  dimensions: QualityDimension[];
} {
  const features = project.schema?.features ?? [];
  const entities = project.schema?.entities ?? [];
  const endpoints = project.schema?.endpoints ?? [];

  // Architecture completeness (auth, docker, swagger, tests, CI)
  const archScore = Math.min(
    100,
    (features.includes("auth") ? 25 : 0) +
    (files.some((f) => f.path.includes("docker")) ? 20 : 0) +
    (files.some((f) => f.path.includes("swagger") || f.path.includes("openapi")) ? 15 : 0) +
    (files.some((f) => f.path.includes(".spec.") || f.path.includes(".test.")) ? 20 : 0) +
    (files.some((f) => f.path.includes(".github") || f.path.includes("ci.yml")) ? 20 : 0)
  );

  // Data model complexity (more entities + relations = richer model)
  const relationCount = (project as any).schema?._parsed?.relations?.length ?? 0;
  const modelScore = Math.min(
    100,
    Math.min(entities.length * 12, 60) + Math.min(relationCount * 10, 40)
  );

  // API coverage (endpoint count per entity)
  const apiScore =
    entities.length > 0
      ? Math.min(100, Math.round((endpoints.length / (entities.length * 5)) * 100))
      : 50;

  // Code volume (more files = more complete)
  const volumeScore = Math.min(100, Math.round((files.length / 20) * 100));

  const overall = Math.round(
    archScore * 0.35 + modelScore * 0.25 + apiScore * 0.2 + volumeScore * 0.2
  );

  return {
    overall,
    dimensions: [
      {
        label: "Architecture",
        score: archScore,
        icon: ShieldCheck,
        color: "text-indigo-400",
        tip: "Auth, Docker, Swagger, Tests, CI/CD",
      },
      {
        label: "Data Model",
        score: modelScore,
        icon: Database,
        color: "text-blue-400",
        tip: "Entities, relations, and complexity",
      },
      {
        label: "API Coverage",
        score: apiScore,
        icon: Globe,
        color: "text-green-400",
        tip: "Endpoints per entity",
      },
      {
        label: "Code Volume",
        score: volumeScore,
        icon: FileCode2,
        color: "text-purple-400",
        tip: "Number of generated files",
      },
    ],
  };
}

function QualityScorePanel({ project, files }: { project: Project; files: GeneratedFile[] }) {
  const { overall, dimensions } = computeQualityScore(project, files);
  const color =
    overall >= 80 ? "text-green-400" : overall >= 55 ? "text-yellow-400" : "text-red-400";
  const ringColor =
    overall >= 80 ? "border-green-500/60" : overall >= 55 ? "border-yellow-500/60" : "border-red-500/60";

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <Star className="w-4 h-4 text-yellow-400" />
        <h3 className="font-semibold text-white text-sm">Project Quality Score</h3>
        <span className="text-xs text-slate-500 ml-1">— based on generated output</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Ring */}
        <div className={`w-20 h-20 rounded-full border-4 ${ringColor} flex items-center justify-center flex-shrink-0`}>
          <span className={`text-2xl font-black ${color}`}>{overall}</span>
        </div>
        {/* Bar chart */}
        <div className="flex-1 space-y-2.5">
          {dimensions.map((d) => (
            <div key={d.label} className="flex items-center gap-2">
              <d.icon className={`w-3.5 h-3.5 flex-shrink-0 ${d.color}`} />
              <span className="text-xs text-slate-400 w-24 flex-shrink-0">{d.label}</span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    d.score >= 80 ? "bg-green-500" : d.score >= 55 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${d.score}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 w-8 text-right">{d.score}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Score is computed from architecture patterns, data model richness, API coverage, and file count.
        {overall < 70 && " Add tests, Docker, Swagger, or more entities to improve your score."}
      </p>
    </div>
  );
}

// ── AI Summary Panel ─────────────────────────────────────────────────────────

function AISummaryPanel({ projectId }: { projectId: string }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/api/v1/ai/projects/${projectId}/summary`);
      setSummary(res.data.summary);
    } catch {
      setError("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!summary && !loading && !error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <p className="font-semibold text-white mb-1">AI Project Summary</p>
          <p className="text-slate-400 text-sm max-w-sm">
            Generate a plain-English technical summary of this project — architecture, data model, API patterns, and getting started.
          </p>
        </div>
        <button
          onClick={generate}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Generate Summary
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
        <p className="text-sm">AI is analyzing your project…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
        <button onClick={generate} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-semibold text-white">AI Summary</span>
        </div>
        <button
          onClick={generate}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Regenerate
        </button>
      </div>
      <article
        className="prose prose-invert prose-slate max-w-none text-sm
          prose-h2:text-base prose-h2:font-bold prose-h2:text-white prose-h2:mt-6 prose-h2:mb-2
          prose-p:text-slate-300 prose-p:leading-relaxed prose-p:my-2
          prose-ul:text-slate-300 prose-ul:my-2 prose-ul:pl-5
          prose-li:my-1 prose-li:leading-relaxed
          prose-strong:text-white
          prose-code:text-indigo-300 prose-code:bg-slate-800/60 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs"
        dangerouslySetInnerHTML={{ __html: summary!.replace(/\n/g, "<br/>").replace(/#{1,6} (.+)/g, '<h2>$1</h2>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code>$1</code>') }}
      />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProjectDetail({
  project,
  onRefresh,
  onProjectUpdate,
}: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<
    "files" | "schema" | "readme" | "info" | "quality" | "summary" | "deploy" | "chat"
  >("files");
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(
    project.generatedOutput?.files[0] ?? null
  );
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(
    new Set([".", "src", "src/modules"])
  );
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [isPublic, setIsPublic] = useState(project.isPublic ?? false);
  const [shareToken, setShareToken] = useState(project.shareToken ?? null);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const files = project.generatedOutput?.files ?? [];
  const fileGroups = groupFilesByDirectory(files);
  const totalSize = totalSizeBytes(files);

  function toggleDir(dir: string) {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(dir)) next.delete(dir);
      else next.add(dir);
      return next;
    });
  }

  async function handleDownloadZip() {
    if (downloading) return;
    setDownloadError(null);
    setDownloading(true);
    try {
      const safeName = project.name.replace(/\s+/g, "-").toLowerCase();
      await generatorApi.downloadProject(project.id, `${safeName}.zip`);
    } catch (err: any) {
      setDownloadError(err?.message ?? "Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  const isCompleted = project.status === "completed";

  async function handleToggleShare() {
    setShareLoading(true);
    try {
      const res = await apiClient.post(`/api/v1/projects/${project.id}/share`);
      const { isPublic: newIsPublic, shareToken: newToken } = res.data.data ?? res.data;
      setIsPublic(newIsPublic);
      setShareToken(newToken);
    } catch {
      // ignore
    } finally {
      setShareLoading(false);
    }
  }

  async function handleCopyShareLink() {
    if (!shareToken) return;
    const link = `${window.location.origin}/share/${shareToken}`;
    await navigator.clipboard.writeText(link);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }

  const tabs = [
    { id: "files" as const, label: "Files", icon: FileCode2, count: files.length },
    { id: "schema" as const, label: "Schema", icon: Database, show: !!project.schema },
    { id: "readme" as const, label: "Readme", icon: BookOpen, show: !!project.generatedOutput?.readme },
    { id: "info" as const, label: "Info", icon: Layers },
    { id: "quality" as const, label: "Quality", icon: Star, show: isCompleted && files.length > 0 },
    { id: "summary" as const, label: "AI Summary", icon: Sparkles, show: isCompleted },
    { id: "deploy" as const, label: "Deploy", icon: Rocket, show: isCompleted },
    { id: "chat" as const, label: "AI Chat", icon: MessageSquare, show: isCompleted },
  ].filter((t) => t.show !== false);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Project header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            {project.description || project.prompt}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Created {formatDate(project.createdAt)}
            </span>
            <span>·</span>
            <span>Updated {formatRelativeTime(project.updatedAt)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            {onRefresh && (
              <button onClick={onRefresh} className="btn-ghost">
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}
            {isCompleted && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleShare}
                  disabled={shareLoading}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm border transition-all",
                    isPublic
                      ? "bg-green-900/40 border-green-700/60 text-green-300 hover:bg-green-900/60"
                      : "border-slate-600 hover:border-slate-400 bg-slate-800 hover:bg-slate-700 text-slate-300"
                  )}
                  title={isPublic ? "Make private" : "Make public & get share link"}
                >
                  {shareLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">{isPublic ? "Public" : "Share"}</span>
                </button>
                {isPublic && shareToken && (
                  <button
                    onClick={handleCopyShareLink}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border border-slate-600 hover:border-slate-400 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                    title="Copy share link"
                  >
                    {shareCopied ? <CheckCheck className="w-4 h-4 text-green-400" /> : <LinkIcon className="w-4 h-4" />}
                  </button>
                )}
              </div>
            )}
            {files.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGithubModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm border border-slate-600 hover:border-slate-400 bg-slate-800 hover:bg-slate-700 text-white transition-all"
                >
                  <Github className="w-4 h-4" />
                  <span>Push to GitHub</span>
                </button>
                <button
                  onClick={handleDownloadZip}
                  disabled={downloading}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all",
                    downloading
                      ? "bg-indigo-700/50 text-indigo-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
                  )}
                >
                  {downloading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Preparing ZIP…</span></>
                  ) : (
                    <><Download className="w-4 h-4" /><span>Download ZIP</span></>
                  )}
                </button>
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <FileCode2 className="w-3 h-3" />
                {files.length} file{files.length !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="w-3 h-3" />
                {formatBytes(totalSize)}
              </span>
            </div>
          )}

          {downloadError && (
            <div className="flex items-center gap-1.5 text-xs text-red-400 max-w-xs text-right">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{downloadError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {project.schema && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Database, label: "Entities", value: project.schema.entities?.length ?? 0, color: "text-blue-400", bg: "bg-blue-400/10" },
            { icon: Globe, label: "Endpoints", value: project.schema.endpoints?.length ?? 0, color: "text-green-400", bg: "bg-green-400/10" },
            { icon: FileCode2, label: "Files", value: files.length, color: "text-indigo-400", bg: "bg-indigo-400/10" },
            { icon: Terminal, label: "Features", value: project.schema.features?.length ?? 0, color: "text-purple-400", bg: "bg-purple-400/10" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card px-4 py-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-slate-500 text-xs">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="glass-card overflow-hidden">
        <div className="flex border-b border-slate-700/60 bg-slate-900/30 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 flex-shrink-0",
                activeTab === tab.id
                  ? "text-indigo-400 border-indigo-500"
                  : "text-slate-500 hover:text-slate-300 border-transparent"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Files tab */}
        {activeTab === "files" && (
          <div className="flex h-[600px]">
            <div className="w-64 flex-shrink-0 border-r border-slate-700/60 overflow-y-auto bg-slate-900/40">
              <div className="p-2">
                {Object.entries(fileGroups).map(([dir, dirFiles]) => (
                  <div key={dir}>
                    {dir !== "." && (
                      <button
                        onClick={() => toggleDir(dir)}
                        className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {expandedDirs.has(dir) ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                        <span className="font-mono">{dir}/</span>
                      </button>
                    )}
                    {(dir === "." || expandedDirs.has(dir)) &&
                      dirFiles.map((file) => (
                        <FileTreeItem
                          key={file.path}
                          file={file}
                          isSelected={selectedFile?.path === file.path}
                          onClick={() => setSelectedFile(file)}
                        />
                      ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {selectedFile ? (
                <CodeViewer file={selectedFile} />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-600">
                  <div className="text-center">
                    <FileCode2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Select a file to view its contents</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schema tab */}
        {activeTab === "schema" && project.schema && (
          <div className="p-5">
            <SchemaPreview schema={project.schema} />
          </div>
        )}

        {/* Readme tab */}
        {activeTab === "readme" && project.generatedOutput?.readme && (
          <div className="p-5">
            <pre className="code-block text-sm whitespace-pre-wrap leading-relaxed">
              {project.generatedOutput.readme}
            </pre>
          </div>
        )}

        {/* Info tab */}
        {activeTab === "info" && (
          <div className="p-5 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Project details</h4>
                <dl className="space-y-2 text-sm">
                  {[
                    { label: "Project ID", value: project.id },
                    { label: "Status", value: project.status },
                    { label: "Created", value: formatDate(project.createdAt) },
                    { label: "Updated", value: formatDate(project.updatedAt) },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-3">
                      <dt className="text-slate-500 w-24 flex-shrink-0">{item.label}</dt>
                      <dd className="text-slate-200 font-mono break-all">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              {project.schema?.techStack && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">Tech stack</h4>
                  <dl className="space-y-2 text-sm">
                    {Object.entries(project.schema.techStack).map(([key, value]) => (
                      <div key={key} className="flex gap-3">
                        <dt className="text-slate-500 capitalize w-24 flex-shrink-0">{key}</dt>
                        <dd className="text-slate-200">{value as string}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>

            {project.schema?.features && project.schema.features.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {project.schema.features.map((f: string) => (
                    <span
                      key={f}
                      className="text-xs px-2.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-indigo-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <TagInput projectId={project.id} initialTags={project.tags ?? []} />

            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Original prompt</h4>
              <div className="code-block text-sm whitespace-pre-wrap leading-relaxed">
                {project.prompt}
              </div>
            </div>
          </div>
        )}

        {/* Quality tab */}
        {activeTab === "quality" && isCompleted && files.length > 0 && (
          <QualityScorePanel project={project} files={files} />
        )}

        {/* AI Summary tab */}
        {activeTab === "summary" && isCompleted && (
          <AISummaryPanel projectId={project.id} />
        )}

        {/* Deploy tab */}
        {activeTab === "deploy" && isCompleted && (
          <DeployPanel project={project} onProjectUpdate={onProjectUpdate} />
        )}

        {/* AI Chat tab */}
        {activeTab === "chat" && isCompleted && (
          <AIChatPanel
            projectId={project.id}
            onFilesUpdated={() => onRefresh?.()}
          />
        )}
      </div>

      {showGithubModal && (
        <GitHubExportModal
          projectId={project.id}
          projectName={project.name}
          onClose={() => setShowGithubModal(false)}
        />
      )}
    </div>
  );
}
