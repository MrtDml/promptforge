"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Database,
  Layers,
  Settings2,
} from "lucide-react";
import { useSingleProject } from "@/hooks/useProjects";
import { projectsApi } from "@/lib/api";
import type { Entity, EntityField, FieldType, AppSchema } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const FIELD_TYPES: FieldType[] = [
  "string",
  "number",
  "boolean",
  "date",
  "datetime",
  "email",
  "url",
  "text",
  "uuid",
];

const FEATURE_OPTIONS = [
  { key: "auth", label: "Authentication", description: "JWT / session auth" },
  { key: "dashboard", label: "Dashboard UI", description: "Admin dashboard" },
  { key: "crud", label: "CRUD endpoints", description: "REST API CRUD" },
  { key: "api", label: "API documentation", description: "Swagger / OpenAPI" },
  { key: "deploy", label: "Deployment config", description: "Docker / CI" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldRow({
  field,
  onChange,
  onRemove,
}: {
  field: EntityField;
  onChange: (updated: EntityField) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2 group">
      <input
        type="text"
        value={field.name}
        onChange={(e) => onChange({ ...field, name: e.target.value })}
        placeholder="field name"
        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors min-w-0"
      />
      <select
        value={field.type}
        onChange={(e) =>
          onChange({ ...field, type: e.target.value as FieldType })
        }
        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-colors cursor-pointer"
      >
        {FIELD_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer select-none whitespace-nowrap">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => onChange({ ...field, required: e.target.checked })}
          className="w-3.5 h-3.5 rounded accent-indigo-500"
        />
        Required
      </label>
      <button
        onClick={onRemove}
        className="p-1.5 rounded-lg text-slate-700 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
        title="Remove field"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function EntityEditor({
  entity,
  onChange,
  onRemove,
}: {
  entity: Entity;
  onChange: (updated: Entity) => void;
  onRemove: () => void;
}) {
  function addField() {
    const newField: EntityField = {
      name: "",
      type: "string",
      required: false,
    };
    onChange({ ...entity, fields: [...entity.fields, newField] });
  }

  function updateField(idx: number, updated: EntityField) {
    const fields = [...entity.fields];
    fields[idx] = updated;
    onChange({ ...entity, fields });
  }

  function removeField(idx: number) {
    onChange({
      ...entity,
      fields: entity.fields.filter((_, i) => i !== idx),
    });
  }

  return (
    <div className="glass-card p-4 space-y-3">
      {/* Entity name + remove */}
      <div className="flex items-center gap-3">
        <Database className="w-4 h-4 text-indigo-400 flex-shrink-0" />
        <input
          type="text"
          value={entity.name}
          onChange={(e) => onChange({ ...entity, name: e.target.value })}
          placeholder="Entity name (e.g. User)"
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
        />
        <button
          onClick={onRemove}
          className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Remove entity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <input
        type="text"
        value={entity.description ?? ""}
        onChange={(e) =>
          onChange({ ...entity, description: e.target.value })
        }
        placeholder="Entity description (optional)"
        className="w-full bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-2 text-slate-300 text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
      />

      {/* Fields */}
      <div className="space-y-2 pl-1">
        {entity.fields.length === 0 && (
          <p className="text-xs text-slate-600 pl-1">No fields yet. Add one below.</p>
        )}
        {entity.fields.map((field, idx) => (
          <FieldRow
            key={idx}
            field={field}
            onChange={(updated) => updateField(idx, updated)}
            onRemove={() => removeField(idx)}
          />
        ))}
      </div>

      {/* Add field */}
      <button
        onClick={addField}
        className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors pl-1"
      >
        <Plus className="w-3.5 h-3.5" />
        Add field
      </button>

      {/* Timestamps / soft-delete toggles */}
      <div className="flex items-center gap-4 pt-1 border-t border-slate-700/40">
        <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={entity.timestamps ?? true}
            onChange={(e) =>
              onChange({ ...entity, timestamps: e.target.checked })
            }
            className="w-3.5 h-3.5 rounded accent-indigo-500"
          />
          Timestamps
        </label>
        <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={entity.softDelete ?? false}
            onChange={(e) =>
              onChange({ ...entity, softDelete: e.target.checked })
            }
            className="w-3.5 h-3.5 rounded accent-indigo-500"
          />
          Soft delete
        </label>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { project, isLoading, error, refreshProject } = useSingleProject(id);

  // Editable schema state
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [features, setFeatures] = useState<string[]>([]);

  // Operation state
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Populate form when project loads
  useEffect(() => {
    if (project?.schema) {
      setAppName(project.schema.appName ?? project.name);
      setAppDescription(project.schema.description ?? project.description ?? "");
      setEntities(
        project.schema.entities.map((e) => ({
          ...e,
          timestamps: e.timestamps ?? true,
          softDelete: e.softDelete ?? false,
        }))
      );
      setFeatures(project.schema.features ?? []);
    } else if (project) {
      setAppName(project.name);
      setAppDescription(project.description ?? "");
    }
  }, [project]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function addEntity() {
    setEntities((prev) => [
      ...prev,
      {
        name: "",
        fields: [{ name: "id", type: "uuid", required: true }],
        timestamps: true,
        softDelete: false,
      },
    ]);
  }

  function updateEntity(idx: number, updated: Entity) {
    setEntities((prev) => {
      const next = [...prev];
      next[idx] = updated;
      return next;
    });
  }

  function removeEntity(idx: number) {
    setEntities((prev) => prev.filter((_, i) => i !== idx));
  }

  function toggleFeature(key: string) {
    setFeatures((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  }

  function buildSchema(): Partial<AppSchema> {
    return {
      appName: appName.trim(),
      description: appDescription.trim(),
      entities,
      features,
      endpoints: project?.schema?.endpoints ?? [],
      techStack: project?.schema?.techStack ?? {
        backend: "NestJS",
        database: "PostgreSQL",
        auth: "JWT",
      },
    };
  }

  async function handleSave() {
    try {
      setIsSaving(true);
      setToast(null);
      await projectsApi.update(id, {
        name: appName.trim() || project?.name,
        description: appDescription.trim() || project?.description,
        schema: buildSchema() as AppSchema,
      });
      setToast({ type: "success", message: "Project saved successfully." });
    } catch {
      setToast({ type: "error", message: "Failed to save project. Please try again." });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveAndRegenerate() {
    try {
      setIsRegenerating(true);
      setToast(null);

      // 1. PATCH schema
      await projectsApi.update(id, {
        name: appName.trim() || project?.name,
        description: appDescription.trim() || project?.description,
        schema: buildSchema() as AppSchema,
      });

      // 2. Trigger regeneration
      await projectsApi.regenerate(id);

      // 3. Navigate to project detail to watch progress
      router.push(`/dashboard/projects/${id}`);
    } catch {
      setToast({
        type: "error",
        message: "Failed to save and regenerate. Please try again.",
      });
      setIsRegenerating(false);
    }
  }

  const isBusy = isSaving || isRegenerating;

  // ── Render loading ──────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
        <div className="skeleton h-6 w-48 mb-8" />
        <div className="space-y-6">
          <div className="skeleton h-40 rounded-xl" />
          <div className="skeleton h-60 rounded-xl" />
          <div className="skeleton h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  // ── Render error ────────────────────────────────────────────────────────────

  if (error || !project) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-5">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Failed to load project
        </h3>
        <p className="text-slate-400 mb-6">{error ?? "Project not found."}</p>
        <div className="flex items-center gap-3">
          <button onClick={refreshProject} className="btn-secondary">
            Try again
          </button>
          <Link href="/dashboard" className="btn-primary">
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ── Render form ─────────────────────────────────────────────────────────────

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
      {/* Back link */}
      <Link
        href={`/dashboard/projects/${id}`}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to project
      </Link>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit project</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Modify the schema and regenerate the application.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href={`/dashboard/projects/${id}`}
            className="btn-ghost text-sm"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={isBusy}
            className="btn-secondary text-sm"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </button>
          <button
            onClick={handleSaveAndRegenerate}
            disabled={isBusy}
            className="btn-primary text-sm"
          >
            {isRegenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Save & Regenerate
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm mb-6 border ${
            toast.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          )}
          <p className="flex-1">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* ── App info ─────────────────────────────────────────────────── */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center">
              <Settings2 className="w-4 h-4 text-indigo-400" />
            </div>
            <h2 className="text-base font-semibold text-white">App information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                App name
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="My SaaS App"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                Description
              </label>
              <textarea
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                rows={3}
                placeholder="Describe what this app does..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* ── Entities ─────────────────────────────────────────────────── */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center">
                <Database className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Entities</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {entities.length} {entities.length === 1 ? "entity" : "entities"} defined
                </p>
              </div>
            </div>
            <button
              onClick={addEntity}
              className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add entity
            </button>
          </div>

          {entities.length === 0 ? (
            <div className="text-center py-8">
              <Database className="w-8 h-8 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm mb-3">No entities defined.</p>
              <button
                onClick={addEntity}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                + Add your first entity
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {entities.map((entity, idx) => (
                <EntityEditor
                  key={idx}
                  entity={entity}
                  onChange={(updated) => updateEntity(idx, updated)}
                  onRemove={() => removeEntity(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Features ─────────────────────────────────────────────────── */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Features</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select what to include in the generated project
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURE_OPTIONS.map((feat) => {
              const active = features.includes(feat.key);
              return (
                <label
                  key={feat.key}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    active
                      ? "bg-indigo-600/10 border-indigo-500/40"
                      : "bg-slate-800/40 border-slate-700/60 hover:border-slate-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleFeature(feat.key)}
                    className="mt-0.5 w-4 h-4 rounded accent-indigo-500"
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        active ? "text-indigo-300" : "text-slate-300"
                      }`}
                    >
                      {feat.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {feat.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* ── Bottom action bar ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 pb-4">
          <Link
            href={`/dashboard/projects/${id}`}
            className="btn-ghost text-sm w-full sm:w-auto justify-center"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={isBusy}
            className="btn-secondary text-sm w-full sm:w-auto justify-center"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save only
          </button>
          <button
            onClick={handleSaveAndRegenerate}
            disabled={isBusy}
            className="btn-primary text-sm w-full sm:w-auto justify-center"
          >
            {isRegenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Save & Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}
