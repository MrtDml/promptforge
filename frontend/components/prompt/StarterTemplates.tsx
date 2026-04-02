"use client";

import { Zap } from "lucide-react";

interface Template {
  title: string;
  description: string;
  prompt: string;
  tags: string[];
  framework?: "nestjs" | "express";
  options?: {
    includeSwagger?: boolean;
    includeCI?: boolean;
    includeFrontend?: boolean;
    includeIyzico?: boolean;
    includeKVKK?: boolean;
  };
}

const TEMPLATES: Template[] = [
  {
    title: "SaaS Starter",
    description: "User accounts, teams, billing-ready foundation",
    tags: ["auth", "teams", "popular"],
    prompt:
      "Build a multi-tenant SaaS starter with User (email, password, role: admin/member), Organization (name, plan: free/pro/enterprise, seats), and Membership (userId, orgId, role). Include JWT auth, invite system, and usage tracking.",
  },
  {
    title: "E-commerce API",
    description: "Products, orders, cart, and inventory",
    tags: ["commerce", "payments"],
    prompt:
      "Build an e-commerce REST API with Product (name, description, price, stock, sku, category), Order (userId, status: pending/confirmed/shipped/delivered, total), OrderItem (orderId, productId, quantity, price), and Cart (userId, items). Include auth.",
    options: { includeSwagger: true },
  },
  {
    title: "Blog / CMS",
    description: "Posts, authors, tags, and comments",
    tags: ["content", "media"],
    prompt:
      "Build a headless CMS API with Post (title, slug, content, status: draft/published, publishedAt), Author (name, bio, avatarUrl), Tag (name, slug), and Comment (postId, authorName, body, approved). Include JWT auth for admin.",
    options: { includeSwagger: true, includeFrontend: true },
  },
  {
    title: "Project Management",
    description: "Projects, tasks, sprints, and team members",
    tags: ["productivity", "teams"],
    prompt:
      "Build a project management API with Project (name, description, ownerId, status: active/archived), Sprint (projectId, name, startDate, endDate, goal), Task (sprintId, title, description, status: todo/in-progress/done, assigneeId, priority: low/medium/high), and TeamMember (projectId, userId, role). Include auth.",
    options: { includeCI: true },
  },
  {
    title: "API Only — Minimal",
    description: "Bare-bones Express.js CRUD with one entity",
    tags: ["minimal", "express"],
    framework: "express",
    prompt:
      "Build a minimal REST API with a single Item entity (name, description, price, quantity). No auth required. Keep it simple.",
    options: { includeSwagger: true },
  },
  {
    title: "Appointment Booking",
    description: "Services, staff, time slots, and reservations",
    tags: ["bookings", "scheduling"],
    prompt:
      "Build an appointment booking API with Service (name, duration, price), Staff (name, email, bio), TimeSlot (staffId, startTime, endTime, available), and Appointment (userId, serviceId, staffId, slotId, status: pending/confirmed/cancelled, notes). Include JWT auth.",
  },
  {
    title: "E-commerce + Payments",
    description: "Products, orders, cart — with payment integration",
    tags: ["commerce", "payments", "billing"],
    prompt:
      "Build an e-commerce API with payment integration. Product (name, description, price, stock, sku, category), Order (userId, status: pending/confirmed/shipped/delivered, total, shippingAddress), OrderItem (orderId, productId, quantity, unitPrice), and Customer (name, email, phone). Include JWT auth and payment service.",
    options: { includeIyzico: true, includeSwagger: true },
  },
  {
    title: "Invoice SaaS",
    description: "Invoice management with PDF generation",
    tags: ["billing", "invoices", "finance"],
    prompt:
      "Build an invoice management SaaS API. Invoice (number, status: draft/sent/paid/cancelled, issuedAt, dueAt, subtotal, taxRate, total), InvoiceItem (invoiceId, description, quantity, unitPrice, taxRate), Client (name, email, address, taxId), and Company (name, email, address, taxId, bankAccount). Include PDF invoice generation and JWT auth.",
    options: { includeKVKK: true },
  },
];

interface StarterTemplatesProps {
  onSelect: (prompt: string, options?: Template["options"], framework?: "nestjs" | "express") => void;
}

export default function StarterTemplates({ onSelect }: StarterTemplatesProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-indigo-400" />
        <h2 className="text-sm font-semibold text-slate-300">Starter Templates</h2>
        <span className="text-xs text-slate-500 ml-1">— click to pre-fill</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.title}
            type="button"
            onClick={() => onSelect(tpl.prompt, tpl.options, tpl.framework)}
            className="group text-left p-4 rounded-xl border border-slate-700/60 bg-slate-800/30 hover:border-indigo-500/50 hover:bg-indigo-950/20 transition-all"
          >
            <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors leading-snug">
              {tpl.title}
            </p>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">{tpl.description}</p>
            <div className="flex flex-wrap gap-1 mt-3">
              {tpl.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-slate-700/60 text-slate-400 px-1.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
