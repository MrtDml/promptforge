"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  AlertCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Wand2,
  Loader2,
} from "lucide-react";
import apiClient from "@/lib/api";

const examplePrompts = [
  {
    title: "Appointment & Booking System",
    prompt:
      "Build an appointment management system with Customer (name, email, phone), Service (name, description, duration, price), Staff (name, email, specialization, workingHours), and Appointment (customerId, serviceId, staffId, startTime, status: pending/confirmed/cancelled/completed). Include SMS/email reminders, calendar view, and subscription billing with basic and premium tiers.",
  },
  {
    title: "E-commerce Platform",
    prompt:
      "Build an e-commerce platform with Product (name, description, price, stock, sku, images, category), Category (name, slug, parent), Order (userId, status: pending/confirmed/shipped/delivered, total, shippingAddress), OrderItem (orderId, productId, quantity, unitPrice), Cart (userId, items), and Coupon (code, discountType, value, expiresAt). Include payment integration, invoice generation, and GDPR-compliant data storage.",
  },
  {
    title: "Accounting SaaS",
    prompt:
      "Build an accounting SaaS with Client (name, email, taxId, address), Supplier (name, email, taxId), Invoice (number, clientId, status: draft/sent/paid/cancelled, issuedAt, dueAt, subtotal, taxRate, total), InvoiceItem (invoiceId, description, quantity, unitPrice), and Expense (supplierId, amount, category, date, receiptUrl). Include income/expense tracking, tax reports, PDF generation, and multi-role access (accountant, manager, admin).",
  },
  {
    title: "Restaurant Management",
    prompt:
      "Build a restaurant management system with Table (number, capacity, status: available/occupied/reserved), MenuItem (name, description, price, category, available), Order (tableId, status: open/preparing/ready/closed, total), OrderItem (orderId, menuItemId, quantity, notes), Reservation (name, email, phone, date, partySize, status), and Staff (name, role: waiter/chef/manager). Include QR menu, kitchen display, daily sales reports, and loyalty program.",
  },
  {
    title: "Project Management SaaS",
    prompt:
      "Build a multi-tenant project management app with workspaces, projects, tasks, subtasks, due dates, priorities, assignees, comments, file attachments, and activity logs. Include role-based access (admin, manager, member) and subscription billing with free and pro tiers.",
  },
  {
    title: "CRM System",
    prompt:
      "Build a CRM system with contacts, companies, deals pipeline, activities, notes, email integration, custom fields, tags, lead scoring, reports, and team collaboration features.",
  },
  {
    title: "SaaS Invoicing App",
    prompt:
      "Create an invoicing application with clients, products/services, invoices, recurring billing, payment tracking, expense management, multi-currency support, PDF generation, and a client portal.",
  },
  {
    title: "Learning Management System",
    prompt:
      "Build an LMS with courses, modules, lessons, quizzes, student enrollment, progress tracking, certificates, instructor dashboard, video uploads, and discussion forums.",
  },
];

interface PromptFormProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  error?: string | null;
  initialValue?: string;
}

export default function PromptForm({
  onSubmit,
  isLoading = false,
  error = null,
  initialValue = "",
}: PromptFormProps) {
  const [prompt, setPrompt] = useState(initialValue);
  const [showExamples, setShowExamples] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialValue) setPrompt(initialValue);
  }, [initialValue]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  }, [prompt]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt.trim());
  }

  function handleExampleClick(examplePrompt: string) {
    setPrompt(examplePrompt);
    setShowExamples(false);
    textareaRef.current?.focus();
  }

  async function handleEnhance() {
    if (!prompt.trim() || isEnhancing || isLoading) return;
    setIsEnhancing(true);
    setEnhanceError(null);
    try {
      const res = await apiClient.post("/api/v1/ai/enhance-prompt", {
        prompt: prompt.trim(),
      });
      setPrompt(res.data.enhanced);
      setTimeout(() => textareaRef.current?.focus(), 50);
    } catch {
      setEnhanceError("Could not enhance prompt. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  }

  const charCount = prompt.length;
  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
  const isValid = prompt.trim().length >= 20;
  const canEnhance = prompt.trim().length >= 10 && !isEnhancing && !isLoading;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Main prompt card */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white text-lg">
              Describe your SaaS application
            </h2>
            <p className="text-slate-400 text-sm">
              Be specific about features, user roles, data models, and
              integrations for the best results.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Textarea */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Build a multi-tenant SaaS invoicing app with customers, invoices, recurring billing, payments, and a client portal. Include role-based access for admin and accountant roles, Stripe integration, PDF generation, and email notifications..."
              className="w-full min-h-[160px] bg-slate-900/60 border border-slate-600 rounded-xl px-5 py-4 text-slate-100 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm leading-relaxed"
              rows={6}
              disabled={isLoading || isEnhancing}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-3">
              <span
                className={`text-xs transition-colors ${
                  charCount > 2000
                    ? "text-red-400"
                    : charCount > 1000
                    ? "text-yellow-400"
                    : "text-slate-600"
                }`}
              >
                {wordCount} words
              </span>
            </div>
          </div>

          {/* Tips */}
          {!prompt && (
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Include user roles",
                "Mention integrations",
                "List key features",
                "Describe data models",
              ].map((tip) => (
                <span
                  key={tip}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-500"
                >
                  {tip}
                </span>
              ))}
            </div>
          )}

          {/* Enhance error */}
          {enhanceError && (
            <div className="mt-3 flex items-start gap-2 text-yellow-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              {enhanceError}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Actions row */}
          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {/* Enhance with AI button */}
              <button
                type="button"
                onClick={handleEnhance}
                disabled={!canEnhance}
                title="Let AI expand and improve your prompt"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  canEnhance
                    ? "border-violet-500/50 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 hover:border-violet-400"
                    : "border-slate-700 text-slate-600 cursor-not-allowed"
                }`}
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Enhancing…
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    Enhance with AI
                  </>
                )}
              </button>
              <p className="text-slate-500 text-xs hidden sm:block">
                {!isValid && prompt.length > 0
                  ? `Add ${20 - prompt.trim().length} more characters`
                  : isValid
                  ? "Looking good! Click Parse to continue."
                  : "Describe your app for best results."}
              </p>
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading || isEnhancing}
              className="btn-primary px-6 py-2.5"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Parse prompt
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Example prompts */}
      <div className="glass-card overflow-hidden">
        <button
          type="button"
          onClick={() => setShowExamples(!showExamples)}
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-700/30 transition-colors"
        >
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <span className="font-medium text-slate-300 text-sm">
            Example prompts
          </span>
          <span className="text-xs text-slate-500 ml-auto mr-2">
            Click to use as starting point
          </span>
          {showExamples ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {showExamples && (
          <div className="border-t border-slate-700/60">
            {examplePrompts.map((example, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleExampleClick(example.prompt)}
                className="w-full text-left px-5 py-4 hover:bg-slate-700/30 transition-colors border-b border-slate-700/40 last:border-0 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-200 text-sm group-hover:text-white transition-colors">
                      {example.title}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">
                      {example.prompt}
                    </p>
                  </div>
                  <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
                    Use this →
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
