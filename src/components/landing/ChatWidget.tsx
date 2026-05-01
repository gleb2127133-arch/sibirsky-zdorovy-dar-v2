import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, UserCircle2 } from "lucide-react";

type Message = { from: "user" | "bot" | "owner"; text: string };

const SESSION_ID = Math.random().toString(36).slice(2, 10);

const GREETING = "Здравствуйте! Задайте любой вопрос о дигидрокверцетине — расскажу о составе, дозировке, ценах или доставке.";

const QUICK = ["Как принимать?", "Какой объём выбрать?", "Сколько стоит доставка?", "Когда будет эффект?"];

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitingOwner, setWaitingOwner] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const handler = () => { setOpen(true); setHasUnread(false); };
    window.addEventListener("open-chat", handler);
    return () => window.removeEventListener("open-chat", handler);
  }, []);

  useEffect(() => {
    if (open) { setHasUnread(false); setTimeout(() => inputRef.current?.focus(), 300); }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, waitingOwner]);

  const addMsg = (msg: Message) => setMessages(prev => [...prev, msg]);

  const startPolling = useCallback(() => {
    if (pollRef.current) return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat-poll?session=${SESSION_ID}`);
        const data = await res.json();
        if (data.replies?.length) {
          for (const reply of data.replies) {
            addMsg({ from: "owner", text: reply });
          }
          setWaitingOwner(false);
        }
      } catch {}
    }, 3000);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  useEffect(() => {
    if (waitingOwner) startPolling(); else stopPolling();
    return stopPolling;
  }, [waitingOwner, startPolling, stopPolling]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    addMsg({ from: "user", text: trimmed });
    setLoading(true);

    try {
      const [res] = await Promise.all([
        fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, sessionId: SESSION_ID }),
        }),
        new Promise(r => setTimeout(r, 1500 + Math.random() * 1500)),
      ]);
      const data = await res.json();
      if (data.reply) addMsg({ from: "bot", text: data.reply });
      if (data.waitOwner) setWaitingOwner(true);
      if (data.orderPlaced) addMsg({ from: "bot", text: "Заявка оформлена! Менеджер свяжется с вами в рабочее время с 08:00 до 17:00 МСК." });
    } catch {
      addMsg({ from: "bot", text: "Ошибка соединения. Позвоните нам: 8 (950) 114-41-75" });
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="fixed bottom-44 right-5 z-50 flex flex-col items-end gap-3 md:bottom-8 md:right-24">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-[500px] w-[340px] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl sm:w-[380px]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-primary px-4 py-3.5">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-5 w-5 text-white" strokeWidth={2.2} />
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-primary bg-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">ИИ-консультант АктивПлюс</p>
                <p className="text-xs text-white/70">Отвечает мгновенно</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-lg text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {/* Greeting */}
              <BotBubble text={GREETING} />

              {/* Quick replies */}
              {isEmpty && (
                <div className="flex flex-wrap gap-2 pl-9">
                  {QUICK.map(q => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-full border border-primary/30 bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* History */}
              {messages.map((m, i) => {
                if (m.from === "user") return <UserBubble key={i} text={m.text} />;
                if (m.from === "owner") return <OwnerBubble key={i} text={m.text} />;
                return <BotBubble key={i} text={m.text} />;
              })}

              {/* Typing indicators */}
              {loading && <TypingDot label="Бот отвечает" />}
              {waitingOwner && !loading && <TypingDot label="Менеджер печатает" isOwner />}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border px-3 py-3">
              <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Написать сообщение..."
                  className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-white shadow-sm transition-all hover:scale-105 hover:bg-primary/90 disabled:opacity-40 disabled:hover:scale-100"
                >
                  <Send className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(v => !v)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-[0_4px_16px_hsl(158_64%_32%_/_0.45)] transition-colors hover:bg-primary/90"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="h-6 w-6 text-white" strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle className="h-6 w-6 text-white" strokeWidth={2.2} />
            </motion.span>
          )}
        </AnimatePresence>
        {hasUnread && !open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">1</span>
        )}
      </motion.button>
    </div>
  );
};

function BotBubble({ text }: { text: string }) {
  return (
    <div className="flex gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft">
        <Bot className="h-4 w-4 text-primary" strokeWidth={2.2} />
      </div>
      <div className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-tl-sm bg-secondary/60 px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
        {text}
      </div>
    </div>
  );
}

function OwnerBubble({ text }: { text: string }) {
  return (
    <div className="flex gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100">
        <UserCircle2 className="h-4 w-4 text-amber-600" strokeWidth={2.2} />
      </div>
      <div className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-tl-sm bg-amber-50 border border-amber-100 px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-amber-500">Менеджер</span>
        {text}
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex flex-row-reverse gap-2.5">
      <div className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-sm leading-relaxed text-white">
        {text}
      </div>
    </div>
  );
}

function TypingDot({ label, isOwner }: { label: string; isOwner?: boolean }) {
  return (
    <div className="flex gap-2.5">
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isOwner ? "bg-amber-100" : "bg-primary-soft"}`}>
        {isOwner
          ? <UserCircle2 className="h-4 w-4 text-amber-600" strokeWidth={2.2} />
          : <Bot className="h-4 w-4 text-primary" strokeWidth={2.2} />}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
        <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-secondary/60 px-4 py-3">
          {[0, 1, 2].map(i => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
