"use client";

import { useState } from "react";
import { Github, X, ExternalLink, Loader2, Lock, Globe, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/api";

interface GitHubExportModalProps {
  projectId: string;
  projectName: string;
  onClose: () => void;
}

export default function GitHubExportModal({ projectId, projectName, onClose }: GitHubExportModalProps) {
  const defaultRepoName = projectName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const [token, setToken] = useState("");
  const [repoName, setRepoName] = useState(defaultRepoName);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState<string | null>(null);

  async function handleExport() {
    if (!token.trim()) { setError("GitHub token gereklidir."); return; }
    if (!repoName.trim()) { setError("Depo adı gereklidir."); return; }

    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.post(`/api/v1/projects/${projectId}/export/github`, {
        token: token.trim(),
        repoName: repoName.trim(),
        isPrivate,
      });
      setRepoUrl(res.data.data.repoUrl);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Dışa aktarma başarısız. Token ve depo adını kontrol et.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md glass-card rounded-2xl p-6 shadow-2xl border border-slate-700/60">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">GitHub&apos;a Aktar</h2>
              <p className="text-xs text-slate-500">Oluşturulan kodu yeni bir depoya aktar</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {repoUrl ? (
          /* Success state */
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-300">Depo oluşturuldu!</p>
                <a href={repoUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1 mt-1 font-mono break-all">
                  {repoUrl}
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <a href={repoUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">
                <Github className="w-4 h-4" />
                Depoyu Aç
              </a>
              <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm transition-colors">
                Kapat
              </button>
            </div>
          </div>
        ) : (
          /* Form state */
          <div className="space-y-4">
            {/* Token field */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                GitHub Personal Access Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="input-base font-mono text-sm"
              />
              <p className="text-xs text-slate-600 mt-1">
                <span className="text-slate-400 font-medium">repo</span> kapsamı gerekli.{" "}
                <a href="https://github.com/settings/tokens/new?scopes=repo&description=PromptForge"
                  target="_blank" rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  Oluştur →
                </a>
              </p>
            </div>

            {/* Repo name */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Depo adı
              </label>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9-_.]/g, "-"))}
                placeholder="my-saas-app"
                className="input-base font-mono text-sm"
              />
            </div>

            {/* Visibility toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPrivate(false)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors",
                  !isPrivate
                    ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
                    : "border-slate-700 text-slate-500 hover:border-slate-600"
                )}
              >
                <Globe className="w-4 h-4" />
                Public
              </button>
              <button
                onClick={() => setIsPrivate(true)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors",
                  isPrivate
                    ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
                    : "border-slate-700 text-slate-500 hover:border-slate-600"
                )}
              >
                <Lock className="w-4 h-4" />
                Private
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleExport}
                disabled={isLoading}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  isLoading
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-slate-900 border border-slate-600 hover:border-slate-400 text-white hover:bg-slate-800"
                )}
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />GitHub&apos;a aktarılıyor…</>
                ) : (
                  <><Github className="w-4 h-4" />GitHub&apos;a Aktar</>
                )}
              </button>
              <button onClick={onClose} className="px-4 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm transition-colors">
                İptal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
