"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

interface AIChatPanelProps {
  projectId: string;
  features?: string[];
  onFilesUpdated?: (files: Record<string, string>) => void;
}

function getContextualSuggestions(features: string[]): string[] {
  const list: string[] = [];
  const has = (f: string) =>
    features.some((x) => x.toLowerCase().includes(f));

  if (!has("auth") && !has("jwt"))
    list.push("Add JWT authentication & role-based access guards");
  if (!has("payment") && !has("stripe") && !has("billing"))
    list.push("Add Stripe subscription billing & webhook handler");
  if (!has("notif") && !has("email"))
    list.push("Add email notifications on key events");
  if (!has("docker"))
    list.push("Add Docker & Docker Compose setup with health checks");
  if (!has("swagger") && !has("openapi"))
    list.push("Generate Swagger / OpenAPI documentation at /api");
  if (!has("test") && !has("spec"))
    list.push("Write Jest unit tests for all service methods");

  // Always-useful fallbacks
  list.push("Add pagination to all list endpoints");
  list.push("Add input validation to all request bodies");

  return list.slice(0, 4);
}

export default function AIChatPanel({ projectId, features = [], onFilesUpdated }: AIChatPanelProps) {
  const suggestions = getContextualSuggestions(features);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const historySnapshot = messages.slice(-10);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    // Placeholder for the streaming assistant reply
    const assistantIndex = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", streaming: true },
    ]);

    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE}/api/v1/projects/${projectId}/chat/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            message: trimmed,
            history: historySnapshot,
          }),
        }
      );

      if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        throw new Error(json?.message ?? `Request failed: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep the incomplete last line in the buffer
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const rawData = line.slice(6).trim();
          if (!rawData) continue;

          let chunk: any;
          try {
            chunk = JSON.parse(rawData);
          } catch {
            continue;
          }

          if (chunk.type === "text") {
            assistantContent += chunk.delta;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: assistantContent,
                streaming: true,
              };
              return updated;
            });
          } else if (chunk.type === "done") {
            // Mark streaming complete
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: assistantContent,
                streaming: false,
              };
              return updated;
            });
            if (chunk.updatedFiles && Object.keys(chunk.updatedFiles).length > 0) {
              onFilesUpdated?.(chunk.updatedFiles);
            }
          } else if (chunk.type === "error") {
            throw new Error(chunk.message ?? "Streaming error");
          }
        }
      }
    } catch (err: any) {
      setError(err?.message ?? "AI isteği başarısız. Lütfen tekrar deneyin.");
      // Remove the empty placeholder on error
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[updated.length - 1]?.streaming) updated.pop();
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">AI Modification Chat</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Ask AI to modify your project. It can add features, fix bugs, or refactor code.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                msg.role === "user"
                  ? "bg-indigo-600"
                  : "bg-slate-800 border border-slate-700"
              )}
            >
              {msg.role === "user" ? (
                <User className="w-3.5 h-3.5 text-white" />
              ) : (
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-sm"
                  : "bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-sm"
              )}
            >
              {msg.content || (msg.streaming && (
                <span className="inline-flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:300ms]" />
                </span>
              ))}
              {msg.streaming && msg.content && (
                <span className="inline-block w-0.5 h-3.5 bg-indigo-400 ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          </div>
        ))}

        {error && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-700/60 p-3">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI to modify your project… (Enter to send)"
            rows={2}
            disabled={loading}
            className="flex-1 resize-none rounded-xl bg-slate-800/60 border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className={cn(
              "p-2.5 rounded-xl transition-all self-end",
              loading || !input.trim()
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            )}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-1.5 px-1">
          Changes will be saved automatically when AI modifies files.
        </p>
      </div>
    </div>
  );
}
