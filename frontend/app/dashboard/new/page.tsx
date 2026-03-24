"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parserApi, generatorApi } from "@/lib/api";
import type { AppSchema, GenerateResponse } from "@/types";
import PromptForm from "@components/prompt/PromptForm";
import SchemaPreview from "@components/prompt/SchemaPreview";
import { CheckCircle2, AlertCircle, Loader2, ChevronRight } from "lucide-react";
import { AxiosError } from "axios";

type Step = "input" | "preview" | "generating" | "done";

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("input");
  const [prompt, setPrompt] = useState("");
  const [schema, setSchema] = useState<AppSchema | null>(null);
  const [generateResult, setGenerateResult] = useState<GenerateResponse | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [includeTests, setIncludeTests] = useState(false);
  const [includeDocker, setIncludeDocker] = useState(true);

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
          "Failed to parse your prompt. Please try again."
      );
    } finally {
      setIsParsing(false);
    }
  }

  // Step 2 → 3 → 4: generate
  async function handleGenerate() {
    if (!schema) return;
    setGenerateError(null);
    setStep("generating");

    try {
      const response = await generatorApi.generate({
        schema,
        options: { includeTests, includeDocker, includeCI: false },
      });
      setGenerateResult(response.data);
      setStep("done");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setGenerateError(
        axiosError.response?.data?.message ||
          "Generation failed. Please try again."
      );
      setStep("preview");
    }
  }

  function handleViewProject() {
    if (generateResult?.projectId) {
      router.push(`/dashboard/projects/${generateResult.projectId}`);
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">New Project</h1>
        <p className="text-slate-400 mt-1">
          Describe the SaaS app you want to build and let AI generate it for
          you.
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { id: "input", label: "Describe" },
          { id: "preview", label: "Review Schema" },
          { id: "generating", label: "Generate" },
          { id: "done", label: "Done" },
        ].map((s, i, arr) => {
          const stepOrder = ["input", "preview", "generating", "done"];
          const currentIdx = stepOrder.indexOf(step);
          const sIdx = stepOrder.indexOf(s.id);
          const isActive = step === s.id;
          const isDone = currentIdx > sIdx;

          return (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : isDone
                    ? "bg-indigo-950 text-indigo-300 border border-indigo-700"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <span className="w-4 h-4 flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                )}
                {s.label}
              </div>
              {i < arr.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Prompt input */}
      {(step === "input" || (step === "preview" && !schema)) && (
        <PromptForm
          onSubmit={handleParse}
          isLoading={isParsing}
          error={parseError}
          initialValue={prompt}
        />
      )}

      {/* Step 2: Schema preview + generate button */}
      {step === "preview" && schema && (
        <div className="space-y-6 animate-slide-up">
          <SchemaPreview schema={schema} />

          {generateError && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{generateError}</p>
            </div>
          )}

          {/* Generation options */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4">Generation options</h3>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeDocker}
                  onChange={(e) => setIncludeDocker(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-slate-200 text-sm font-medium group-hover:text-white transition-colors">
                    Docker & Docker Compose
                  </span>
                  <p className="text-slate-500 text-xs">
                    Include containerization config
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeTests}
                  onChange={(e) => setIncludeTests(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-slate-200 text-sm font-medium group-hover:text-white transition-colors">
                    Unit Tests
                  </span>
                  <p className="text-slate-500 text-xs">
                    Generate test files for all modules
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep("input")}
              className="btn-secondary"
            >
              Back to prompt
            </button>
            <button
              onClick={handleGenerate}
              className="btn-primary px-8 py-3 text-base glow-indigo"
            >
              Generate application
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
          <h3 className="text-2xl font-bold text-white mb-3">
            Generating your application...
          </h3>
          <p className="text-slate-400 max-w-md">
            AI is crafting your complete SaaS application. This usually takes
            15–30 seconds.
          </p>

          <div className="mt-10 glass-card p-5 w-full max-w-sm">
            <div className="space-y-3">
              {[
                "Analyzing schema",
                "Generating entities",
                "Creating API endpoints",
                "Building service layer",
                includeDocker ? "Setting up Docker" : null,
                includeTests ? "Writing unit tests" : null,
                "Finalizing output",
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
          <h3 className="text-2xl font-bold text-white mb-3">
            Application generated!
          </h3>
          <p className="text-slate-400 max-w-md mb-8">
            Your SaaS application has been successfully generated with{" "}
            <span className="text-indigo-400 font-semibold">
              {generateResult.output.files.length} files
            </span>
            . Review the code, download it, or deploy directly.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 w-full max-w-lg">
            <div className="glass-card px-4 py-3 text-center">
              <p className="text-xl font-bold text-white">
                {generateResult.output.files.length}
              </p>
              <p className="text-slate-400 text-xs">Files</p>
            </div>
            <div className="glass-card px-4 py-3 text-center">
              <p className="text-xl font-bold text-white">
                {schema?.entities.length ?? 0}
              </p>
              <p className="text-slate-400 text-xs">Entities</p>
            </div>
            <div className="glass-card px-4 py-3 text-center">
              <p className="text-xl font-bold text-white">
                {schema?.endpoints.length ?? 0}
              </p>
              <p className="text-slate-400 text-xs">Endpoints</p>
            </div>
            <div className="glass-card px-4 py-3 text-center">
              <p className="text-xl font-bold text-white">
                {schema?.features.length ?? 0}
              </p>
              <p className="text-slate-400 text-xs">Features</p>
            </div>
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
              Start new project
            </button>
            <button
              onClick={handleViewProject}
              className="btn-primary px-8 py-3"
            >
              View project details
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
