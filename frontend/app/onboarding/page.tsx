"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Code2, Rocket, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    id: 1,
    icon: Zap,
    title: "Welcome to Prompt Forge!",
    subtitle: "You're one prompt away from your first SaaS app.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    id: 2,
    icon: Code2,
    title: "How it works",
    subtitle: "Three steps from idea to code.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    id: 3,
    icon: Rocket,
    title: "You're all set!",
    subtitle: "Start generating your first project now.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

const HOW_IT_WORKS = [
  {
    num: "1",
    title: "Describe your app",
    body: "Write a plain-English description — entities, features, and requirements. No coding knowledge needed.",
  },
  {
    num: "2",
    title: "AI generates your code",
    body: "Prompt Forge creates a production-ready NestJS backend + Prisma schema with all your entities and relations.",
  },
  {
    num: "3",
    title: "Download, deploy, ship",
    body: "Get a ZIP, push to GitHub with one click, or deploy to Railway directly from the dashboard.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  function next() {
    if (isLast) {
      // Mark onboarding as done
      localStorage.setItem("promptforge_onboarded", "true");
      router.replace("/dashboard/new");
    } else {
      setStep((s) => s + 1);
    }
  }

  function skip() {
    localStorage.setItem("promptforge_onboarded", "true");
    router.replace("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-indigo-500" : i < step ? "w-4 bg-indigo-500/40" : "w-4 bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className={`border rounded-2xl p-8 ${current.bg} mb-6 transition-all duration-300`}>
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${current.bg}`}>
              <Icon className={`w-7 h-7 ${current.color}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{current.title}</h1>
              <p className="text-slate-400">{current.subtitle}</p>
            </div>
          </div>

          {/* Step 1 — welcome features */}
          {step === 0 && (
            <ul className="space-y-3 text-left">
              {[
                "Generate a full NestJS + Prisma backend from a prompt",
                "Download production-ready code as a ZIP",
                "Push to GitHub or deploy to Railway in one click",
                "Use AI chat to modify your project anytime",
                "3 free generations — no credit card required",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Step 2 — how it works */}
          {step === 1 && (
            <div className="space-y-4">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.num} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 text-violet-400 font-bold text-sm">
                    {item.num}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">{item.title}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3 — ready */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-[#0a0b14]/60 border border-slate-800 rounded-xl p-4">
                <p className="text-slate-300 text-sm font-medium mb-1">Example prompt:</p>
                <p className="text-indigo-300 text-sm italic leading-relaxed">
                  &ldquo;Build a task management app with users, projects, and tasks. Users can assign tasks to other team members, set deadlines, and track progress.&rdquo;
                </p>
              </div>
              <p className="text-slate-400 text-sm text-center">
                Paste your own description and hit Generate — it takes about 10 seconds.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={skip}
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            Skip intro
          </button>

          <button
            onClick={next}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            {isLast ? (
              <>
                Create my first project
                <ExternalLink className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Docs link */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Need help?{" "}
          <Link href="/docs" className="text-indigo-400/70 hover:text-indigo-400">
            Read the docs
          </Link>
        </p>
      </div>
    </div>
  );
}
