"use client";

import { useState, useRef, useEffect } from "react";

// ---------------------------------------------------------------------------
// SocraticCoach — slide-in chat drawer for Socratic hint coaching.
//
// Sits below the challenge. Streams coach responses via SSE from /api/coach.
// Never shows the answer — the API enforces Socratic rules.
// ---------------------------------------------------------------------------

export interface SocraticCoachProps {
  courseSlug: string;
  lessonSlug: string;
  lessonType: "code" | "quiz";
  // Code lessons
  learnerCode?: string;
  // Quiz lessons
  learnerChoiceId?: string;
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function SocraticCoach({
  courseSlug,
  lessonSlug,
  lessonType,
  learnerCode,
  learnerChoiceId,
  onClose,
}: SocraticCoachProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fire initial coach question on mount.
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      void sendToCoach([], "I'm stuck and need a hint.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendToCoach(history: Message[], userMessage: string) {
    const updatedHistory: Message[] = [
      ...history,
      { role: "user", content: userMessage },
    ];
    setMessages(updatedHistory);
    setStreaming(true);

    // Optimistically add an empty assistant message to stream into.
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          lessonSlug,
          learnerCode: lessonType === "code" ? learnerCode : undefined,
          learnerChoiceId: lessonType === "quiz" ? learnerChoiceId : undefined,
          conversationHistory: updatedHistory,
        }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: "Sorry, I ran into a problem. Please try again.",
          };
          return next;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") break;
          try {
            const { text } = JSON.parse(payload) as { text: string };
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              next[next.length - 1] = {
                ...last,
                content: last.content + text,
              };
              return next;
            });
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: "Network error. Please check your connection.",
        };
        return next;
      });
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    // Current messages minus the initial user message that was already added.
    await sendToCoach(messages, text);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <div
      className="mt-4 rounded-xl border border-indigo-500/20 bg-slate-900/80 backdrop-blur-sm"
      role="complementary"
      aria-label="Socratic coach"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-base" aria-hidden="true">🤔</span>
          <p className="text-sm font-semibold text-slate-200">Coach</p>
          <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300 border border-indigo-500/30">
            Socratic
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close coach"
          className="text-slate-500 hover:text-slate-300 transition text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Message list */}
      <div className="max-h-72 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm italic text-slate-500">
            Thinking of a question for you…
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-600/30 text-slate-200 border border-indigo-500/20"
                  : "bg-slate-800/60 text-slate-300 border border-white/5"
              }`}
            >
              {msg.content || (
                <span className="animate-pulse text-slate-500">▍</span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/5 px-4 py-3 flex gap-2 items-end">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={streaming}
          placeholder="Reply to the coach… (Enter to send)"
          rows={2}
          className="flex-1 resize-none rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
        />
        <button
          onClick={() => void handleSend()}
          disabled={streaming || !input.trim()}
          className="shrink-0 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
