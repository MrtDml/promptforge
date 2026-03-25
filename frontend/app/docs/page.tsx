"use client";

import Link from "next/link";
import {
  BookOpen,
  Terminal,
  Zap,
  Database,
  Download,
  Rocket,
  ChevronRight,
  Code2,
  Shield,
  Lightbulb,
} from "lucide-react";

const sections = [
  {
    icon: Zap,
    title: "Quick Start",
    description: "Build your first app in under 5 minutes.",
    steps: [
      'Go to your Dashboard and click "New Project".',
      "Describe the application you want to build in plain English.",
      "Wait for the AI to parse your prompt and review the generated schema.",
      'Click "Generate" — code generation begins immediately.',
      "When complete, download the ZIP or deploy directly to Railway.",
    ],
  },
  {
    icon: Lightbulb,
    title: "Writing Great Prompts",
    description: "Tips for getting the best results from PromptForge.",
    steps: [
      "State the app's purpose clearly: \"I want an e-commerce platform\".",
      "List your entities: \"Users, Products, Orders, and Categories\".",
      "Specify features: \"JWT authentication, CRUD APIs, and an admin panel\".",
      "Define relationships: \"A user can have many orders; each order has many items\".",
      "Add tech preferences: \"Use PostgreSQL, NestJS, and Prisma\".",
    ],
  },
  {
    icon: Code2,
    title: "Prompt Examples",
    description: "Copy these as starting points for your own projects.",
    steps: [
      '"Build a task management app with Users, Teams, and Tasks. JWT auth, team invites, and task assignments."',
      '"Create a blog platform with Authors, Posts, Categories, and Comments. Markdown support and role-based access."',
      '"I need a booking system with Customers, Services, Appointments, and Payments. Stripe integration and email notifications."',
      '"Build an inventory tracker with Products, Warehouses, and StockMovements. Low-stock alerts and CSV export."',
      '"Create a learning platform with Courses, Lessons, Enrollments, and Quizzes. Progress tracking and certificates."',
    ],
  },
  {
    icon: Database,
    title: "Generated Project Structure",
    description: "What PromptForge produces for every project.",
    steps: [
      "src/ — Full NestJS application (modules, controllers, services, guards).",
      "prisma/schema.prisma — Database schema with all entities and relations.",
      "Dockerfile + docker-compose.yml — Ready-to-use container configuration.",
      ".env.example — Template for all required environment variables.",
      "README.md — Step-by-step setup and run instructions.",
    ],
  },
  {
    icon: Download,
    title: "Downloading Your Code",
    description: "Get the generated code onto your machine.",
    steps: [
      "Open the project detail page from your Dashboard.",
      'Click the "Download ZIP" button.',
      "Extract the ZIP and open a terminal in the project folder.",
      "Run npm install to install dependencies.",
      "Copy .env.example to .env and fill in your values (database URL, JWT secret, etc.).",
    ],
  },
  {
    icon: Rocket,
    title: "Deploy to Railway",
    description: "One-click cloud deployment — no DevOps required.",
    steps: [
      "Open the project detail page and click \"Deploy to Railway\".",
      "Sign up at railway.app if you don't have an account.",
      "Generate a Railway API token (Account → Tokens) and paste it into your PromptForge settings.",
      "Deployment starts automatically — Railway provisions PostgreSQL and the app service.",
      "Once done, your live URL appears on the project page.",
    ],
  },
  {
    icon: Shield,
    title: "Plans & Limits",
    description: "What's included in each plan.",
    steps: [
      "Free: 3 project generations per month — great for trying things out.",
      "Starter ($29/mo): 50 generations per month + Railway deploy support.",
      "Pro ($99/mo): Unlimited generations + priority support.",
      "When you hit your limit you'll be prompted to upgrade.",
      "Cancelling keeps your current plan active until the end of the billing period.",
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold">Documentation</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Everything you need to get started with PromptForge.
          </p>
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {sections.map((s) => (
            <a
              key={s.title}
              href={`#${s.title}`}
              className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/40 hover:bg-slate-800 transition-all text-sm text-slate-300 hover:text-white"
            >
              <s.icon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              {s.title}
            </a>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <div
              key={section.title}
              id={section.title}
              className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <section.icon className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-semibold">{section.title}</h2>
              </div>
              <p className="text-slate-400 text-sm mb-5">{section.description}</p>
              <ol className="space-y-3">
                {section.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-slate-300 text-sm font-mono leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 text-center">
          <Terminal className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Still stuck?</h3>
          <p className="text-slate-400 text-sm mb-4">
            Our support team is here to help you build faster.
          </p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            Get Support
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
