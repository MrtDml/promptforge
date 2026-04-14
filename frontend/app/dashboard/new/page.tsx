"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parserApi, generatorApi, projectsApi } from "@/lib/api";
import type { AppSchema, GenerateResponse, Project } from "@/types";
import PromptForm from "@components/prompt/PromptForm";
import SchemaPreview from "@components/prompt/SchemaPreview";
import StarterTemplates from "@components/prompt/StarterTemplates";
import {
  CheckCircle2, AlertCircle, Loader2, ChevronRight,
  Globe, CreditCard, FileText, Shield, Braces, GitBranch,
  Zap, Tag, History, ArrowRight, Wand2,
} from "lucide-react";
import { AxiosError } from "axios";
import apiClient from "@/lib/api";

type Step = "input" | "preview" | "generating" | "done";

// ── Sector detection ─────────────────────────────────────────────────────────

interface Sector {
  label: string;
  color: string;
  bg: string;
  border: string;
}

const SECTOR_MAP: Record<string, Sector> = {
  fintech:    { label: "Fintech / Finans",        color: "text-green-300",  bg: "bg-green-500/10",  border: "border-green-500/30" },
  ecommerce:  { label: "E-ticaret / Perakende",   color: "text-yellow-300", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  hr:         { label: "İK / Takım Yönetimi",     color: "text-blue-300",   bg: "bg-blue-500/10",   border: "border-blue-500/30"   },
  saas:       { label: "SaaS / B2B Platform",     color: "text-indigo-300", bg: "bg-indigo-500/10", border: "border-indigo-500/30" },
  logistics:  { label: "Lojistik / Teslimat",     color: "text-orange-300", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  health:     { label: "Sağlık / Tıp",            color: "text-rose-300",   bg: "bg-rose-500/10",   border: "border-rose-500/30"   },
  education:  { label: "Eğitim / E-öğrenme",      color: "text-teal-300",   bg: "bg-teal-500/10",   border: "border-teal-500/30"   },
  restaurant: { label: "Yemek & Restoran",        color: "text-amber-300",  bg: "bg-amber-500/10",  border: "border-amber-500/30"  },
  realestate: { label: "Gayrimenkul",             color: "text-cyan-300",   bg: "bg-cyan-500/10",   border: "border-cyan-500/30"   },
  general:    { label: "Genel SaaS",              color: "text-slate-300",  bg: "bg-slate-500/10",  border: "border-slate-600/40"  },
};

function detectSector(schema: AppSchema | null, prompt: string): Sector {
  const text = `${schema?.appName ?? ""} ${schema?.description ?? ""} ${prompt}`.toLowerCase();
  const features = schema?.features ?? [];

  if (/invoice|accounting|billing|expense|tax|payroll|financial/.test(text)) return SECTOR_MAP.fintech;
  if (/restaurant|menu|kitchen|table|waiter|food|delivery|order/.test(text)) return SECTOR_MAP.restaurant;
  if (/product|cart|shop|store|inventory|sku|ecommerce|e-commerce/.test(text)) return SECTOR_MAP.ecommerce;
  if (/employee|hr|staff|leave|attendance|payroll|recruitment/.test(text)) return SECTOR_MAP.hr;
  if (/patient|doctor|hospital|clinic|medical|health|appointment/.test(text)) return SECTOR_MAP.health;
  if (/course|lesson|quiz|student|instructor|lms|learning/.test(text)) return SECTOR_MAP.education;
  if (/property|real estate|listing|tenant|landlord|lease/.test(text)) return SECTOR_MAP.realestate;
  if (/shipment|tracking|courier|logistics|warehouse|fleet/.test(text)) return SECTOR_MAP.logistics;
  if (features.includes("payments") || /subscription|billing|plan/.test(text)) return SECTOR_MAP.saas;
  return SECTOR_MAP.general;
}

// ── Similar project suggestions ───────────────────────────────────────────────

function findSimilarProjects(projects: Project[], prompt: string): Project[] {
  const keywords = prompt.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  return projects
    .filter((p) => {
      const hay = `${p.name} ${p.prompt ?? ""}`.toLowerCase();
      return keywords.some((k) => hay.includes(k));
    })
    .slice(0, 3);
}

// ─────────────────────────────────────────────────────────────────────────────

function NewProjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("input");
  const [prompt, setPrompt] = useState(searchParams.get("prompt") ?? "");
  const [schema, setSchema] = useState<AppSchema | null>(null);
  const [generateResult, setGenerateResult] = useState<GenerateResponse | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [generatingTooLong, setGeneratingTooLong] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [includeTests, setIncludeTests] = useState(false);
  const [includeDocker, setIncludeDocker] = useState(true);
  const [includeSwagger, setIncludeSwagger] = useState(false);
  const [includeCI, setIncludeCI] = useState(false);
  const [includeFrontend, setIncludeFrontend] = useState(false);
  const [includeIyzico, setIncludeIyzico] = useState(false);
  const [includeKVKK, setIncludeKVKK] = useState(false);
  const [framework, setFramework] = useState<"nestjs" | "express">("nestjs");

  const [isFixingWithAI, setIsFixingWithAI] = useState(false);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [similarProjects, setSimilarProjects] = useState<Project[]>([]);

  // Fetch recent projects for "similar project" suggestions
  useEffect(() => {
    projectsApi.list(1, 20).then((res: { data: { data?: Project[] } }) => {
      const projects: Project[] = res.data?.data ?? [];
      setRecentProjects(projects.filter((p) => p.status === "completed"));
    }).catch(() => {});
  }, []);

  // Compute similar projects whenever prompt changes
  useEffect(() => {
    if (prompt.trim().length < 15 || recentProjects.length === 0) {
      setSimilarProjects([]);
      return;
    }
    setSimilarProjects(findSimilarProjects(recentProjects, prompt));
  }, [prompt, recentProjects]);

  // Fix with AI: enhance the failed prompt and retry parse
  async function handleFixWithAI() {
    if (!prompt.trim() || isFixingWithAI) return;
    setIsFixingWithAI(true);
    try {
      const res = await apiClient.post("/api/v1/ai/enhance-prompt", { prompt: prompt.trim() });
      const fixed: string = res.data.enhanced;
      setPrompt(fixed);
      setParseError(null);
      await handleParse(fixed);
    } catch {
      // silent — user can still edit and retry manually
    } finally {
      setIsFixingWithAI(false);
    }
  }

  // Step 1 → 2: parse prompt
  async function handleParse(userPrompt: string) {
    setParseError(null);
    setIsParsing(true);
    setPrompt(userPrompt);
    try {
      const response = await parserApi.parse({ prompt: userPrompt });
      setSchema(response.data.schema);
      setStep("preview");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setParseError(
        axiosError.response?.data?.message ||
          "Prompt analiz edilemedi. Lütfen tekrar deneyin."
      );
    } finally {
      setIsParsing(false);
    }
  }

  // Timeout warning after 45s during generation
  useEffect(() => {
    if (step !== "generating") { setGeneratingTooLong(false); setElapsedSeconds(0); return; }
    const t = setTimeout(() => setGeneratingTooLong(true), 45000);
    return () => clearTimeout(t);
  }, [step]);

  // Elapsed timer during generation
  useEffect(() => {
    if (step !== "generating") return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [step]);

  // Step 2 → 3 → 4: generate
  async function handleGenerate() {
    if (!schema) return;
    setGenerateError(null);
    setGeneratingTooLong(false);
    setStep("generating");
    try {
      const response = await generatorApi.generate({
        schema,
        options: {
          includeTests, includeDocker, includeSwagger, includeCI,
          includeFrontend, includeIyzico, includeKVKK, framework,
        },
      });
      setGenerateResult(response.data);
      setStep("done");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setGenerateError(
        axiosError.response?.data?.message || "Üretim başarısız oldu. Lütfen tekrar deneyin."
      );
      setStep("preview");
    }
  }

  function handleTemplateSelect(
    templatePrompt: string,
    options?: {
      includeSwagger?: boolean; includeCI?: boolean; includeFrontend?: boolean;
      includeIyzico?: boolean; includeKVKK?: boolean;
    },
    fw?: "nestjs" | "express",
  ) {
    setPrompt(templatePrompt);
    if (options?.includeSwagger !== undefined) setIncludeSwagger(options.includeSwagger);
    if (options?.includeCI !== undefined) setIncludeCI(options.includeCI);
    if (options?.includeFrontend !== undefined) setIncludeFrontend(options.includeFrontend);
    if (options?.includeIyzico !== undefined) setIncludeIyzico(options.includeIyzico);
    if (options?.includeKVKK !== undefined) setIncludeKVKK(options.includeKVKK);
    if (fw) setFramework(fw);
  }

  function handleViewProject() {
    if (generateResult?.projectId) {
      router.push(`/dashboard/projects/${generateResult.projectId}`);
    }
  }

  const detectedSector = schema ? detectSector(schema, prompt) : null;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Yeni Proje</h1>
        <p className="text-slate-400 mt-1">
          Oluşturmak istediğin SaaS uygulamasını tarif et, yapay zeka senin için üretsin.
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-1.5 mb-8 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "input", label: "Tarif Et" },
          { id: "preview", label: "İncele" },
          { id: "generating", label: "Üret" },
          { id: "done", label: "Tamamlandı" },
        ].map((s, i, arr) => {
          const stepOrder = ["input", "preview", "generating", "done"];
          const currentIdx = stepOrder.indexOf(step);
          const sIdx = stepOrder.indexOf(s.id);
          const isActive = step === s.id;
          const isDone = currentIdx > sIdx;
          return (
            <div key={s.id} className="flex items-center gap-1.5 flex-shrink-0">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : isDone
                    ? "bg-indigo-950 text-indigo-300 border border-indigo-700"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                ) : (
                  <span className="w-3.5 h-3.5 flex items-center justify-center text-xs">{i + 1}</span>
                )}
                {s.label}
              </div>
              {i < arr.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Prompt input */}
      {(step === "input" || (step === "preview" && !schema)) && (
        <>
          <StarterTemplates onSelect={handleTemplateSelect} />

          {/* Similar projects from history */}
          {similarProjects.length > 0 && (
            <div className="mb-5 glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-medium text-slate-400">Daha önce oluşturduğun benzer projeler</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {similarProjects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => router.push(`/dashboard/projects/${p.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-950/20 text-slate-300 text-xs transition-all group"
                  >
                    <span className="truncate max-w-[160px]">{p.name}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {parseError && (
            <div className="mb-4 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-red-400 text-sm">{parseError}</p>
                <p className="text-red-400/60 text-xs mt-0.5">Promptu sadeleştirmeyi dene veya yapay zekanın düzeltmesine izin ver.</p>
              </div>
              <button
                type="button"
                onClick={handleFixWithAI}
                disabled={isFixingWithAI || isParsing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-violet-500/50 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 text-xs font-medium transition-all disabled:opacity-50 flex-shrink-0"
              >
                {isFixingWithAI ? (
                  <><Loader2 className="w-3 h-3 animate-spin" />Düzeltiliyor…</>
                ) : (
                  <><Wand2 className="w-3 h-3" />AI ile düzelt ve tekrar dene</>
                )}
              </button>
            </div>
          )}
          <PromptForm
            onSubmit={handleParse}
            isLoading={isParsing || isFixingWithAI}
            initialValue={prompt}
          />
        </>
      )}

      {/* Step 2: Schema preview + generate button */}
      {step === "preview" && schema && (
        <div className="space-y-6 animate-slide-up">
          {/* Sector prediction badge */}
          {detectedSector && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${detectedSector.border} ${detectedSector.bg} w-fit`}>
              <Tag className={`w-3.5 h-3.5 ${detectedSector.color}`} />
              <span className={`text-xs font-medium ${detectedSector.color}`}>
                Tespit edilen sektör: <strong>{detectedSector.label}</strong>
              </span>
            </div>
          )}

          <SchemaPreview schema={schema} />

          {generateError && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <p className="text-red-400 text-sm">{generateError}</p>
                {(generateError.toLowerCase().includes("limit") || generateError.toLowerCase().includes("upgrade")) && (
                  <a href="/pricing" className="text-indigo-400 text-sm underline hover:text-indigo-300 transition-colors">
                    Planını yükselt →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Framework selector */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-1">Framework</h3>
            <p className="text-slate-500 text-xs mb-4">Üretilecek proje için backend framework&apos;ü seç.</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFramework("nestjs")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  framework === "nestjs" ? "border-indigo-500 bg-indigo-950/40" : "border-slate-700 hover:border-slate-600"
                }`}
              >
                <Zap className={`w-5 h-5 flex-shrink-0 ${framework === "nestjs" ? "text-indigo-400" : "text-slate-500"}`} />
                <div>
                  <p className={`text-sm font-semibold ${framework === "nestjs" ? "text-white" : "text-slate-300"}`}>NestJS</p>
                  <p className="text-slate-500 text-xs">Önerilen — dekoratörler, modüller, DI</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFramework("express")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  framework === "express" ? "border-indigo-500 bg-indigo-950/40" : "border-slate-700 hover:border-slate-600"
                }`}
              >
                <Braces className={`w-5 h-5 flex-shrink-0 ${framework === "express" ? "text-indigo-400" : "text-slate-500"}`} />
                <div>
                  <p className={`text-sm font-semibold ${framework === "express" ? "text-white" : "text-slate-300"}`}>Express.js</p>
                  <p className="text-slate-500 text-xs">Hafif yapı — Zod, Helmet, rate-limit</p>
                </div>
              </button>
            </div>
          </div>

          {/* Generation options */}
          <div className="glass-card p-5 space-y-6">
            <div>
              <h3 className="font-semibold text-white mb-1">Üretim seçenekleri</h3>
              <p className="text-slate-500 text-xs mb-4">Üretilecek projeye dahil edilecekleri özelleştir.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "includeDocker", label: "Docker & Docker Compose", desc: "Container yapılandırması + health check'ler", checked: includeDocker, onChange: setIncludeDocker },
                  { key: "includeTests", label: "Unit Testler", desc: "Tüm modüller için Jest test dosyaları", checked: includeTests, onChange: setIncludeTests },
                  { key: "includeSwagger", label: "Swagger / OpenAPI", desc: "/api adresinde otomatik API dokümantasyonu", checked: includeSwagger, onChange: setIncludeSwagger, icon: <Braces className="w-3.5 h-3.5 text-yellow-400" /> },
                  { key: "includeCI", label: "GitHub Actions CI/CD", desc: "Lint, test, build ve Docker push", checked: includeCI, onChange: setIncludeCI, icon: <GitBranch className="w-3.5 h-3.5 text-orange-400" /> },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={opt.checked}
                      onChange={(e) => opt.onChange(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        {opt.icon}
                        <span className="text-slate-200 text-sm font-medium group-hover:text-white transition-colors">{opt.label}</span>
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}

                <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-slate-800/50 transition-colors border border-dashed border-indigo-600/30 bg-indigo-950/20">
                  <input
                    type="checkbox"
                    checked={includeFrontend}
                    onChange={(e) => setIncludeFrontend(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-slate-200 text-sm font-medium group-hover:text-white transition-colors">Frontend (Next.js)</span>
                      <span className="text-xs bg-indigo-600/30 text-indigo-300 px-1.5 py-0.5 rounded-full">Yeni</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">Tam Next.js 14 dashboard + kimlik doğrulama sayfaları</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Extended integrations */}
            <div className="border-t border-slate-700/60 pt-5">
              <h4 className="font-semibold text-white text-sm mb-1">Genişletilmiş Entegrasyonlar</h4>
              <p className="text-slate-500 text-xs mb-4">Üretilen projeye eklenebilecek isteğe bağlı servis modülleri.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: "includeIyzico", label: "Ödeme Entegrasyonu", desc: "Checkout formu, abonelik yönetimi ve webhook callback'leri", checked: includeIyzico, onChange: setIncludeIyzico, icon: <CreditCard className="w-3.5 h-3.5 text-green-400" /> },
                  { key: "includeKVKK", label: "Gizlilik & KVKK Uyumu", desc: "Onay middleware, çerez politikası ve gizlilik şablonları", checked: includeKVKK, onChange: setIncludeKVKK, icon: <Shield className="w-3.5 h-3.5 text-purple-400" /> },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-slate-800/50 transition-colors border border-slate-700/50">
                    <input
                      type="checkbox"
                      checked={opt.checked}
                      onChange={(e) => opt.onChange(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        {opt.icon}
                        <span className="text-slate-200 text-sm font-medium group-hover:text-white transition-colors">{opt.label}</span>
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setStep("input")} className="btn-secondary">
              Prompta dön
            </button>
            <button onClick={handleGenerate} className="btn-primary px-8 py-3 text-base glow-indigo">
              Uygulamayı üret
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Generating */}
      {step === "generating" && (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-full border-2 border-indigo-600/30 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Uygulamanız üretiliyor...</h3>
          <p className="text-slate-500 text-sm mb-3 tabular-nums">{elapsedSeconds}s geçti</p>
          {generatingTooLong ? (
            <div className="bg-amber-950/50 border border-amber-700/50 rounded-xl px-5 py-3 max-w-md">
              <p className="text-amber-300 text-sm font-medium">Hâlâ çalışıyor…</p>
              <p className="text-amber-400/70 text-xs mt-1">
                Karmaşık şemalar daha uzun sürebilir. Bu sekmeyi açık tutun — projeniz birazdan hazır olacak.
              </p>
            </div>
          ) : (
            <p className="text-slate-400 max-w-md">
              Yapay zeka SaaS uygulamanı oluşturuyor. Bu işlem genellikle 15–30 saniye sürer.
            </p>
          )}
          <div className="mt-10 glass-card p-5 w-full max-w-sm">
            <div className="space-y-3">
              {[
                "Şema analiz ediliyor",
                framework === "express" ? "Express.js route'ları oluşturuluyor" : "NestJS modülleri oluşturuluyor",
                "API endpoint'leri oluşturuluyor",
                "Servis katmanı inşa ediliyor",
                includeSwagger ? "Swagger/OpenAPI dokümantasyonu ekleniyor" : null,
                includeDocker ? "Docker kurulumu yapılıyor" : null,
                includeCI ? "GitHub Actions CI/CD ekleniyor" : null,
                includeTests ? "Unit testler yazılıyor" : null,
                includeFrontend ? "Next.js frontend oluşturuluyor" : null,
                includeIyzico ? "Ödeme entegrasyonu ekleniyor" : null,
                includeKVKK ? "Gizlilik & KVKK uyumu ekleniyor" : null,
                "Postman koleksiyonu oluşturuluyor",
                "Çıktı tamamlanıyor",
              ]
                .filter(Boolean)
                .map((task, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-slow" />
                    <span className="text-slate-400 text-sm">{task}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Done */}
      {step === "done" && generateResult && (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-slide-up">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Uygulama üretildi!</h3>
          <p className="text-slate-400 max-w-md mb-8">
            SaaS uygulamanız başarıyla{" "}
            <span className="text-indigo-400 font-semibold">{generateResult.output.files.length} dosyayla</span>{" "}
            oluşturuldu. Kodu incele, indir veya doğrudan deploy et.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 w-full max-w-lg">
            {[
              { label: "Dosya", value: generateResult.output.files.length },
              { label: "Varlık", value: schema?.entities.length ?? 0 },
              { label: "Endpoint", value: schema?.endpoints.length ?? 0 },
              { label: "Özellik", value: schema?.features.length ?? 0 },
            ].map((stat) => (
              <div key={stat.label} className="glass-card px-4 py-3 text-center">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-slate-400 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setStep("input");
                setSchema(null);
                setGenerateResult(null);
                setPrompt("");
              }}
              className="btn-secondary"
            >
              Yeni proje başlat
            </button>
            <button onClick={handleViewProject} className="btn-primary px-8 py-3">
              Proje detaylarını gör
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <Suspense fallback={<div className="p-6 lg:p-8 max-w-5xl mx-auto" />}>
      <NewProjectContent />
    </Suspense>
  );
}
