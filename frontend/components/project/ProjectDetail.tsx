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
} from "lucide-react";
import type { Project, GeneratedFile } from "@/types";
import { StatusBadge } from "@components/ui/Badge";
import SchemaPreview from "@components/prompt/SchemaPreview";
import DeployPanel from "@components/project/DeployPanel";
import { formatDate, formatRelativeTime, getLanguageFromPath, cn } from "@/lib/utils";
import { generatorApi } from "@/lib/api";

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

  // Re-highlight whenever file or language changes
  useEffect(() => {
    const el = codeRef.current;
    if (!el) return;
    el.removeAttribute("data-highlighted");
    el.textContent = file.content;
    hljs.highlightElement(el);
  }, [file.content, hlLang]);

  // Line count for display
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
      {/* File header */}
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
            <>
              <CheckCheck className="w-3.5 h-3.5 text-green-400" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content with syntax highlighting */}
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

export default function ProjectDetail({
  project,
  onRefresh,
  onProjectUpdate,
}: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<
    "files" | "schema" | "readme" | "info" | "deploy"
  >("files");
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(
    project.generatedOutput?.files[0] ?? null
  );
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(
    new Set([".", "src", "src/modules"])
  );
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const files = project.generatedOutput?.files ?? [];
  const fileGroups = groupFilesByDirectory(files);
  const totalSize = totalSizeBytes(files);

  function toggleDir(dir: string) {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(dir)) {
        next.delete(dir);
      } else {
        next.add(dir);
      }
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

  const tabs = [
    { id: "files" as const, label: "Files", icon: FileCode2, count: files.length },
    { id: "schema" as const, label: "Schema", icon: Database, show: !!project.schema },
    { id: "readme" as const, label: "Readme", icon: BookOpen, show: !!project.generatedOutput?.readme },
    { id: "info" as const, label: "Info", icon: Layers },
    { id: "deploy" as const, label: "Deploy", icon: Rocket, show: isCompleted },
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
            {files.length > 0 && (
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
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Preparing ZIP…</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download ZIP</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* File count + size pill */}
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

          {/* Download error */}
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
            {
              icon: Database,
              label: "Entities",
              value: project.schema.entities.length,
              color: "text-blue-400",
              bg: "bg-blue-400/10",
            },
            {
              icon: Globe,
              label: "Endpoints",
              value: project.schema.endpoints.length,
              color: "text-green-400",
              bg: "bg-green-400/10",
            },
            {
              icon: FileCode2,
              label: "Files",
              value: files.length,
              color: "text-indigo-400",
              bg: "bg-indigo-400/10",
            },
            {
              icon: Terminal,
              label: "Features",
              value: project.schema.features.length,
              color: "text-purple-400",
              bg: "bg-purple-400/10",
            },
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
        <div className="flex border-b border-slate-700/60 bg-slate-900/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2",
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
            {/* File tree sidebar */}
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

            {/* Code viewer */}
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
                <h4 className="text-sm font-semibold text-slate-300 mb-3">
                  Project details
                </h4>
                <dl className="space-y-2 text-sm">
                  {[
                    { label: "Project ID", value: project.id },
                    { label: "Status", value: project.status },
                    { label: "Created", value: formatDate(project.createdAt) },
                    { label: "Updated", value: formatDate(project.updatedAt) },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-3">
                      <dt className="text-slate-500 w-24 flex-shrink-0">
                        {item.label}
                      </dt>
                      <dd className="text-slate-200 font-mono break-all">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              {project.schema?.techStack && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">
                    Tech stack
                  </h4>
                  <dl className="space-y-2 text-sm">
                    {Object.entries(project.schema.techStack).map(
                      ([key, value]) => (
                        <div key={key} className="flex gap-3">
                          <dt className="text-slate-500 capitalize w-24 flex-shrink-0">
                            {key}
                          </dt>
                          <dd className="text-slate-200">{value as string}</dd>
                        </div>
                      )
                    )}
                  </dl>
                </div>
              )}
            </div>

            {/* Original prompt */}
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">
                Original prompt
              </h4>
              <div className="code-block text-sm whitespace-pre-wrap leading-relaxed">
                {project.prompt}
              </div>
            </div>
          </div>
        )}

        {/* Deploy tab — only rendered when project is COMPLETED */}
        {activeTab === "deploy" && isCompleted && (
          <DeployPanel project={project} onProjectUpdate={onProjectUpdate} />
        )}
      </div>
    </div>
  );
}
