"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Rocket, ExternalLink, RefreshCw, Loader2, CheckCircle2,
  XCircle, Clock, AlertCircle, Globe, ChevronDown, ChevronUp,
} from "lucide-react";
import type { Project, DeployStatus } from "@/types";
import { deployApi } from "@/lib/api";
import { formatDate, formatRelativeTime, cn } from "@/lib/utils";

function RailwayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M0 11.5428C0 5.17 5.17 0 11.5428 0c4.2654 0 8.0029 2.3178 10.0174 5.7554L10.6398 8.608a3.5855 3.5855 0 0 0-2.0972-.6754c-1.9799 0-3.5855 1.6056-3.5855 3.5855 0 .5978.146 1.163.4038 1.6604L.5452 16.166A11.4847 11.4847 0 0 1 0 11.5428zm11.4572 11.4572a11.4705 11.4705 0 0 1-7.4914-2.7727l5.1996-2.9816a3.5644 3.5644 0 0 0 2.2918.8336c1.9799 0 3.5855-1.6056 3.5855-3.5855a3.5809 3.5809 0 0 0-.8742-2.3474l5.234-3.0002A11.4452 11.4452 0 0 1 23 11.5428C23 17.83 17.83 23 11.4572 23z" />
    </svg>
  );
}

const deployStatusConfig: Record<DeployStatus, {
  label: string; color: string; bgColor: string; borderColor: string; dotColor: string;
  icon: React.ElementType; animate?: boolean;
}> = {
  not_deployed: { label: "Dağıtılmadı", color: "text-slate-400", bgColor: "bg-slate-700/40", borderColor: "border-slate-600/40", dotColor: "bg-slate-400", icon: Globe },
  deploying: { label: "Dağıtılıyor…", color: "text-yellow-300", bgColor: "bg-yellow-600/15", borderColor: "border-yellow-500/30", dotColor: "bg-yellow-400", icon: Loader2, animate: true },
  deployed: { label: "Dağıtıldı", color: "text-green-300", bgColor: "bg-green-600/15", borderColor: "border-green-500/30", dotColor: "bg-green-400", icon: CheckCircle2 },
  failed: { label: "Başarısız", color: "text-red-300", bgColor: "bg-red-600/15", borderColor: "border-red-500/30", dotColor: "bg-red-400", icon: XCircle },
};

function DeployStatusBadge({ status }: { status: DeployStatus }) {
  const cfg = deployStatusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium", cfg.bgColor, cfg.borderColor, cfg.color)}>
      <Icon className={cn("w-3.5 h-3.5", cfg.animate && "animate-spin")} />
      {cfg.label}
    </span>
  );
}

// ── Post-deploy advisor ──────────────────────────────────────────────────────

interface NextStep {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

function buildNextSteps(project: Project): NextStep[] {
  const features = project.schema?.features ?? [];
  const steps: NextStep[] = [];

  steps.push({
    title: "Ortam değişkenlerini ayarla",
    description: ".env.example dosyasını .env olarak kopyala ve başlamadan önce DATABASE_URL, JWT_SECRET ile diğer entegrasyon anahtarlarını doldur.",
    priority: "high",
  });

  if (features.includes("auth")) {
    steps.push({
      title: "İlk admin kullanıcını oluştur",
      description: "POST /api/v1/auth/register ile kayıt ol, ardından kullanıcıyı doğrudan veritabanında ADMIN rolüne yükselt.",
      priority: "high",
    });
  }

  steps.push({
    title: "Veritabanı migration'larını çalıştır",
    description: "Şemayı üretim veritabanına uygulamak için `npx prisma migrate deploy` komutunu çalıştır.",
    priority: "high",
  });

  if (features.includes("payments")) {
    steps.push({
      title: "Ödeme webhook'unu yapılandır",
      description: "Dağıtım URL'ini ödeme sağlayıcısı dashboard'unda webhook endpoint olarak kaydet.",
      priority: "medium",
    });
  }

  steps.push({
    title: "API endpoint'lerini test et",
    description: "Tüm endpoint'leri keşfetmek ve test etmek için dahil edilen Postman koleksiyonunu (postman_collection.json) içe aktar.",
    priority: "medium",
  });

  if (features.includes("notifications")) {
    steps.push({
      title: "E-posta sağlayıcısını kur",
      description: "SMTP kimlik bilgilerini veya e-posta servisi API anahtarını ortam değişkenlerine ekle.",
      priority: "medium",
    });
  }

  steps.push({
    title: "HTTPS ve özel domain'i etkinleştir",
    description: "Railway proje ayarlarında özel domain ekle; Railway TLS sertifikasını otomatik olarak sağlayacaktır.",
    priority: "low",
  });

  steps.push({
    title: "İzleme ve loglama kur",
    description: "Üretim ortamındaki hataları erken yakalamak için bir loglama servisi (ör. Sentry, Logtail) bağlayın.",
    priority: "low",
  });

  return steps;
}

function PostDeployAdvisor({ project, deployUrl }: { project: Project; deployUrl?: string }) {
  const [open, setOpen] = useState(true);
  const steps = buildNextSteps(project);
  const highPriority = steps.filter((s) => s.priority === "high");
  const rest = steps.filter((s) => s.priority !== "high");

  const priorityStyles = {
    high:   { dot: "bg-red-400",    label: "bg-red-500/10 text-red-300 border-red-500/30" },
    medium: { dot: "bg-yellow-400", label: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30" },
    low:    { dot: "bg-slate-500",  label: "bg-slate-700/40 text-slate-400 border-slate-600/30" },
  };

  return (
    <div className="border-t border-slate-700/50 mt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-5 py-3 text-left hover:bg-slate-700/20 transition-colors"
      >
        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
        <span className="text-sm font-semibold text-white flex-1">Sonraki adımlar</span>
        <span className="text-xs text-slate-500 mr-2">{steps.length} adım</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-2.5">
          {[...highPriority, ...rest].map((step, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
              <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${priorityStyles[step.priority].dot}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-white">{step.title}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full border ${priorityStyles[step.priority].label}`}>
                    {step.priority === "high" ? "yüksek" : step.priority === "medium" ? "orta" : "düşük"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}

          {deployUrl && (
            <a
              href={`${deployUrl}/api`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Swagger UI'ı aç: {deployUrl}/api
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

interface DeployPanelProps {
  project: Project;
  onProjectUpdate?: (updated: Partial<Project>) => void;
}

export default function DeployPanel({ project, onProjectUpdate }: DeployPanelProps) {
  const [deployStatus, setDeployStatus] = useState<DeployStatus>(project.deployStatus ?? "not_deployed");
  const [deployUrl, setDeployUrl] = useState<string | undefined>(project.deployUrl);
  const [railwayProjectId, setRailwayProjectId] = useState<string | undefined>(project.railwayProjectId);
  const [deployedAt, setDeployedAt] = useState<string | undefined>(project.deployedAt);
  const [lastDeployAt, setLastDeployAt] = useState<string | undefined>(project.lastDeployAt);
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvisor, setShowAdvisor] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current !== null) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  const pollStatus = useCallback(async () => {
    try {
      const res = await deployApi.getStatus(project.id);
      const { status, url } = res.data.data;
      setDeployStatus(status);
      if (url) setDeployUrl(url);
      if (status !== "deploying") {
        stopPolling();
        setIsDeploying(false);
        if (status === "deployed") setShowAdvisor(true);
        onProjectUpdate?.({ deployStatus: status, deployUrl: url });
      }
    } catch {
      // silent
    }
  }, [project.id, stopPolling, onProjectUpdate]);

  useEffect(() => {
    if (deployStatus === "deploying") {
      if (pollRef.current === null) pollRef.current = setInterval(pollStatus, 3000);
    } else {
      stopPolling();
    }
    return stopPolling;
  }, [deployStatus, pollStatus, stopPolling]);

  // Show advisor if already deployed or when status transitions to deployed
  useEffect(() => {
    if (deployStatus === "deployed") setShowAdvisor(true);
  }, [deployStatus]);

  async function handleDeploy() {
    if (isDeploying || deployStatus === "deploying") return;
    setIsDeploying(true);
    setError(null);
    try {
      const res = await deployApi.deploy(project.id);
      const { deployUrl: url, railwayProjectId: rpId, status } = res.data.data;
      setDeployStatus(status as DeployStatus);
      setDeployUrl(url);
      setRailwayProjectId(rpId);
      setLastDeployAt(new Date().toISOString());
      if (status === "deployed") {
        setDeployedAt(new Date().toISOString());
        setIsDeploying(false);
        setShowAdvisor(true);
        onProjectUpdate?.({ deployStatus: status as DeployStatus, deployUrl: url, railwayProjectId: rpId });
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setError(axiosErr?.response?.data?.message ?? axiosErr?.message ?? "Dağıtım başarısız. Lütfen tekrar deneyin.");
      setDeployStatus("failed");
      setIsDeploying(false);
    }
  }

  const isDeployingState = deployStatus === "deploying" || isDeploying;
  const hasBeenDeployed = deployStatus === "deployed" || !!deployUrl;

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B0D0E] border border-white/10 flex items-center justify-center flex-shrink-0">
            <RailwayLogo className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Railway'e Deploy Et</h3>
            <p className="text-xs text-slate-400 mt-0.5">Railway destekli tek tıkla bulut dağıtımı</p>
          </div>
        </div>
        <DeployStatusBadge status={deployStatus} />
      </div>

      {/* Status card */}
      <div className="glass-card p-4 space-y-1">
        {deployStatus === "not_deployed" && (
          <p className="text-sm text-slate-400">
            Projen dağıtıma hazır. PostgreSQL veritabanı ve public URL ile canlı ortam oluşturmak için <span className="text-indigo-300 font-medium">Railway&apos;e Deploy Et</span> butonuna tıkla.
          </p>
        )}
        {isDeployingState && (
          <div className="flex items-start gap-3">
            <Loader2 className="w-4 h-4 text-yellow-400 animate-spin mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-yellow-300 font-medium">Dağıtım devam ediyor</p>
              <p className="text-xs text-slate-400 mt-1">Railway servislerini hazırlıyor. Bu genellikle 30–90 saniye sürer. Durum her 3 saniyede güncellenir.</p>
            </div>
          </div>
        )}
        {deployStatus === "deployed" && deployUrl && (
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-green-300 font-medium">Başarıyla dağıtıldı</p>
              <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-mono break-all">
                {deployUrl}
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
          </div>
        )}
        {deployStatus === "failed" && (
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-red-300 font-medium">Dağıtım başarısız</p>
              {error && <p className="text-xs text-slate-400 mt-1 break-words">{error}</p>}
              <p className="text-xs text-slate-500 mt-1">Railway API tokenını ve proje yapılandırmanı kontrol edip tekrar dene.</p>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleDeploy}
          disabled={isDeployingState}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all",
            isDeployingState
              ? "bg-indigo-700/40 text-indigo-300/60 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
          )}
        >
          {isDeployingState ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Dağıtılıyor…</>
          ) : deployStatus === "failed" ? (
            <><RefreshCw className="w-4 h-4" />Tekrar Dene</>
          ) : hasBeenDeployed ? (
            <><Rocket className="w-4 h-4" />Yeniden Deploy</>
          ) : (
            <><Rocket className="w-4 h-4" />Railway&apos;e Deploy Et</>
          )}
        </button>

        {deployStatus === "deployed" && deployUrl && (
          <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border border-green-500/30 bg-green-600/10 text-green-300 hover:bg-green-600/20 transition-all">
            <ExternalLink className="w-4 h-4" />
            Uygulamayı Aç
          </a>
        )}
      </div>

      {/* Deploy history */}
      {(deployedAt || lastDeployAt || railwayProjectId) && (
        <div className="border-t border-slate-700/50 pt-5 space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dağıtım geçmişi</h4>
          <dl className="space-y-2">
            {railwayProjectId && (
              <div className="flex items-start gap-3 text-sm">
                <dt className="text-slate-500 w-36 flex-shrink-0 flex items-center gap-1.5"><RailwayLogo className="w-3 h-3" />Railway ID</dt>
                <dd className="text-slate-300 font-mono text-xs break-all">{railwayProjectId}</dd>
              </div>
            )}
            {deployedAt && (
              <div className="flex items-center gap-3 text-sm">
                <dt className="text-slate-500 w-36 flex-shrink-0 flex items-center gap-1.5"><Clock className="w-3 h-3" />İlk dağıtım</dt>
                <dd className="text-slate-300">{formatDate(deployedAt)} <span className="text-slate-500 text-xs">({formatRelativeTime(deployedAt)})</span></dd>
              </div>
            )}
            {lastDeployAt && (
              <div className="flex items-center gap-3 text-sm">
                <dt className="text-slate-500 w-36 flex-shrink-0 flex items-center gap-1.5"><RefreshCw className="w-3 h-3" />Son dağıtım</dt>
                <dd className="text-slate-300">{formatDate(lastDeployAt)} <span className="text-slate-500 text-xs">({formatRelativeTime(lastDeployAt)})</span></dd>
              </div>
            )}
            {deployUrl && (
              <div className="flex items-center gap-3 text-sm">
                <dt className="text-slate-500 w-36 flex-shrink-0 flex items-center gap-1.5"><Globe className="w-3 h-3" />Canlı URL</dt>
                <dd>
                  <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors font-mono text-xs break-all inline-flex items-center gap-1">
                    {deployUrl}<ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Post-deploy advisor */}
      {showAdvisor && (
        <PostDeployAdvisor project={project} deployUrl={deployUrl} />
      )}

      {/* Railway footer */}
      <div className="flex items-center gap-2 text-xs text-slate-600 border-t border-slate-700/40 pt-4">
        <RailwayLogo className="w-3 h-3" />
        <span>
          <a href="https://railway.app" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-400 transition-colors">Railway</a> üzerinden dağıtıldı.
          {" "}Yönetim:{" "}
          <a href={railwayProjectId ? `https://railway.app/project/${railwayProjectId}` : "https://railway.app/dashboard"} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-400 transition-colors">railway.app/dashboard</a>.
        </span>
      </div>
    </div>
  );
}
