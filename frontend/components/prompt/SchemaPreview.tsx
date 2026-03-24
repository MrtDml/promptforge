"use client";

import { useState } from "react";
import {
  Database,
  Globe,
  Cpu,
  ChevronDown,
  ChevronRight,
  Tag,
  CheckCircle2,
  Code2,
} from "lucide-react";
import type { AppSchema, Entity, ApiEndpoint } from "@/types";
import { cn } from "@/lib/utils";

interface SchemaPreviewProps {
  schema: AppSchema;
  compact?: boolean;
}

const methodColors: Record<string, string> = {
  GET: "text-green-400 bg-green-400/10 border-green-500/30",
  POST: "text-blue-400 bg-blue-400/10 border-blue-500/30",
  PUT: "text-yellow-400 bg-yellow-400/10 border-yellow-500/30",
  PATCH: "text-orange-400 bg-orange-400/10 border-orange-500/30",
  DELETE: "text-red-400 bg-red-400/10 border-red-500/30",
};

const fieldTypeColors: Record<string, string> = {
  string: "text-green-400",
  number: "text-orange-400",
  boolean: "text-pink-400",
  date: "text-blue-400",
  datetime: "text-blue-400",
  email: "text-yellow-400",
  url: "text-purple-400",
  text: "text-green-400",
  uuid: "text-slate-400",
  enum: "text-indigo-400",
  relation: "text-cyan-400",
};

function EntityCard({ entity }: { entity: Entity }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-slate-700/60 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800/60 hover:bg-slate-800 transition-colors text-left"
      >
        <Database className="w-4 h-4 text-indigo-400 flex-shrink-0" />
        <span className="font-semibold text-white text-sm">{entity.name}</span>
        <span className="text-xs text-slate-500 ml-1">
          {entity.fields.length} fields
        </span>
        {entity.description && (
          <span className="text-xs text-slate-500 ml-1 truncate hidden sm:block">
            — {entity.description}
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {entity.timestamps && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">
              timestamps
            </span>
          )}
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-700/60">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700/40">
                <th className="text-left px-4 py-2 text-slate-500 font-medium">
                  Field
                </th>
                <th className="text-left px-4 py-2 text-slate-500 font-medium">
                  Type
                </th>
                <th className="text-left px-4 py-2 text-slate-500 font-medium">
                  Constraints
                </th>
                <th className="text-left px-4 py-2 text-slate-500 font-medium hidden sm:table-cell">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {entity.fields.map((field, i) => (
                <tr
                  key={field.name}
                  className={cn(
                    "border-b border-slate-700/30 last:border-0",
                    i % 2 === 0 ? "bg-slate-900/30" : ""
                  )}
                >
                  <td className="px-4 py-2 font-mono text-slate-200 font-medium">
                    {field.name}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={cn(
                        "font-mono",
                        fieldTypeColors[field.type] ?? "text-slate-300"
                      )}
                    >
                      {field.type}
                      {field.enumValues && (
                        <span className="text-slate-500">
                          ({field.enumValues.join("|")})
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {field.required && (
                        <span className="px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-400">
                          required
                        </span>
                      )}
                      {field.unique && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-400">
                          unique
                        </span>
                      )}
                      {field.relation && (
                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                          {field.relation.type}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-slate-500 hidden sm:table-cell">
                    {field.description ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EndpointRow({ endpoint }: { endpoint: ApiEndpoint }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-700/30 last:border-0 hover:bg-slate-800/30 transition-colors">
      <span
        className={cn(
          "text-xs font-mono font-bold px-2 py-0.5 rounded border min-w-[52px] text-center",
          methodColors[endpoint.method] ?? "text-slate-300"
        )}
      >
        {endpoint.method}
      </span>
      <code className="text-sm text-slate-200 font-mono flex-1">
        {endpoint.path}
      </code>
      <span className="text-xs text-slate-500 hidden md:block flex-1">
        {endpoint.description}
      </span>
      {endpoint.auth && (
        <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 flex-shrink-0">
          auth
        </span>
      )}
    </div>
  );
}

export default function SchemaPreview({
  schema,
  compact = false,
}: SchemaPreviewProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "entities" | "endpoints" | "raw"
  >("overview");

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    {
      id: "entities" as const,
      label: `Entities (${schema.entities.length})`,
    },
    {
      id: "endpoints" as const,
      label: `Endpoints (${schema.endpoints.length})`,
    },
    { id: "raw" as const, label: "Raw JSON" },
  ];

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-700/60 bg-slate-800/40">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-white text-lg">{schema.appName}</h3>
            <p className="text-slate-400 text-sm mt-0.5">{schema.description}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Parsed</span>
          </div>
        </div>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 flex items-center gap-1.5">
            <Cpu className="w-3 h-3" />
            {schema.techStack.backend}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
            <Database className="w-3 h-3" />
            {schema.techStack.database}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 flex items-center gap-1.5">
            <Globe className="w-3 h-3" />
            {schema.techStack.auth}
          </span>
          {schema.techStack.frontend && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center gap-1.5">
              <Code2 className="w-3 h-3" />
              {schema.techStack.frontend}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700/60 bg-slate-900/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2",
              activeTab === tab.id
                ? "text-indigo-400 border-indigo-500"
                : "text-slate-500 hover:text-slate-300 border-transparent"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={cn("p-5", compact ? "max-h-72 overflow-y-auto" : "")}>
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-5 animate-fade-in">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Entities", value: schema.entities.length },
                { label: "Endpoints", value: schema.endpoints.length },
                { label: "Features", value: schema.features.length },
                {
                  label: "Auth Endpoints",
                  value: schema.endpoints.filter((e) => e.auth).length,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-slate-800/60 rounded-lg p-3 text-center"
                >
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            {schema.features.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-400" />
                  Features
                </h4>
                <div className="flex flex-wrap gap-2">
                  {schema.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs px-2.5 py-1 rounded-full bg-indigo-600/15 border border-indigo-600/30 text-indigo-300 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Entity list preview */}
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                Data Model
              </h4>
              <div className="flex flex-wrap gap-2">
                {schema.entities.map((entity) => (
                  <span
                    key={entity.name}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono"
                  >
                    {entity.name}
                    <span className="text-slate-600 ml-1.5">
                      ({entity.fields.length})
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Entities */}
        {activeTab === "entities" && (
          <div className="space-y-2 animate-fade-in">
            {schema.entities.map((entity) => (
              <EntityCard key={entity.name} entity={entity} />
            ))}
          </div>
        )}

        {/* Endpoints */}
        {activeTab === "endpoints" && (
          <div className="border border-slate-700/60 rounded-lg overflow-hidden animate-fade-in">
            {schema.endpoints.map((endpoint, i) => (
              <EndpointRow key={i} endpoint={endpoint} />
            ))}
          </div>
        )}

        {/* Raw JSON */}
        {activeTab === "raw" && (
          <div className="animate-fade-in">
            <pre className="code-block text-xs overflow-auto max-h-96 whitespace-pre-wrap break-words">
              {JSON.stringify(schema, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
