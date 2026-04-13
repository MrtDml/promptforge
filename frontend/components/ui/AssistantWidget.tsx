"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, ChevronDown } from "lucide-react";
import apiClient from "@/lib/api";
import { AxiosError } from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "SaaS nedir, örneklerle açıklar mısın?",
  "Bana proje fikri önerir misin?",
  "Prompt nasıl yazmalıyım?",
  "Üretilen kodu nasıl deploy ederim?",
];

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Merhaba! Ben Forge, PromptForge yapay zeka asistanıyım. 👋\n\nSaaS geliştirme, platform kullanımı veya backend teknolojileri hakkında sorularını yanıtlayabilirim. Nasıl yardımcı olabilirim?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const history = messages.filter((m) => m.role !== "assistant" || messages.indexOf(m) > 0);

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.post<{ reply: string }>("/api/v1/assistant/chat", {
        message: trimmed,
        history: history.slice(-10), // son 10 mesaj
      });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const msg = axiosErr.response?.data?.message ?? "Bir hata oluştu. Lütfen tekrar deneyin.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/40 flex items-center justify-center transition-all duration-200 hover:scale-105"
        aria-label="Asistan"
      >
        {open ? <ChevronDown className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[560px] flex flex-col rounded-2xl border border-slate-700/60 bg-[#0d0e1a] shadow-2xl shadow-black/60 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-indigo-600/10 border-b border-slate-700/60 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Forge Asistan</p>
              <p className="text-slate-500 text-xs">PromptForge & SaaS uzmanı</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-indigo-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-slate-800/80 text-slate-200 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-indigo-400" />
                </div>
                <div className="bg-slate-800/80 rounded-2xl rounded-bl-sm px-3 py-2">
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-400 text-xs text-center px-2">{error}</p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick questions — only if conversation just started */}
          {messages.length === 1 && !loading && (
            <div className="px-4 pb-2 flex flex-col gap-1.5 flex-shrink-0">
              <p className="text-slate-500 text-xs mb-0.5">Hızlı sorular:</p>
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left text-xs text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 rounded-lg px-3 py-1.5 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-slate-700/60 flex-shrink-0">
            <div className="flex items-end gap-2 bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Bir şey sor... (Enter ile gönder)"
                rows={1}
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 resize-none outline-none max-h-24 leading-relaxed"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-600 text-[10px] text-center mt-1.5">
              Yalnızca PromptForge & SaaS konularında yardım verir
            </p>
          </div>
        </div>
      )}
    </>
  );
}
