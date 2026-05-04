import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import type { IncomingMessage, ServerResponse } from "http";

const PRODUCT_LABELS: Record<string, string> = {
  "10": "D-Quercetin 10 г — 2 590 ₽",
  "20": "D-Quercetin 20 г — 3 990 ₽",
  "30": "D-Quercetin 30 г — 4 990 ₽",
};
const CONTACT_LABELS: Record<string, string> = {
  phone: "Звонок",
  max: "Макс",
  telegram: "Telegram",
};

function buildTgMessage(d: {
  name: string;
  phone: string;
  cart: { id: string; qty: number }[];
  contact: string;
  comment?: string;
}) {
  const now = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
  const PRICES: Record<string, number> = { "10": 2590, "20": 3990, "30": 4990 };
  const cartLines = d.cart.map((item) => {
    const label = PRODUCT_LABELS[item.id] ?? item.id;
    const total = (PRICES[item.id] ?? 0) * item.qty;
    return `  • ${label} × ${item.qty} шт. — ${total.toLocaleString("ru-RU")} ₽`;
  });
  const grandTotal = d.cart.reduce((s, item) => s + (PRICES[item.id] ?? 0) * item.qty, 0);
  return [
    "🛒 <b>Новый заказ — Сибирский здоровый дар</b>",
    "",
    `👤 <b>Имя:</b> ${d.name}`,
    `📞 <b>Телефон:</b> ${d.phone}`,
    "",
    "🧺 <b>Состав заказа:</b>",
    ...cartLines,
    `💰 <b>Итого: ${grandTotal.toLocaleString("ru-RU")} ₽</b>`,
    "",
    `💬 <b>Связь через:</b> ${CONTACT_LABELS[d.contact] ?? d.contact}`,
    d.comment ? `📝 <b>Комментарий:</b> ${d.comment}` : "",
    "",
    `⏰ ${now} МСК`,
  ]
    .filter(Boolean)
    .join("\n");
}

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    allowedHosts: "all",
    hmr: { overlay: false },
  },
  preview: {
    host: "::",
    port: 3000,
    allowedHosts: "all",
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    ViteImageOptimizer({
      jpg: { quality: 82 },
      jpeg: { quality: 82 },
      png: { quality: 85 },
      webp: { lossless: false, quality: 82 },
    }),
    {
      name: "chat-api",
      configureServer(server) {
        const chatSessions = new Map<string, { role: string; content: string }[]>();

        const CLAUDE_SYSTEM = `Ты — Алекс, консультант АктивПлюс. Помогаешь клиентам узнать всё о дигидрокверцетине и сделать заказ.

ПРОДУКТ: Дигидрокверцетин (ДГК) — чистый порошок из сибирской лиственницы, Иркутская область. Антиоксидант в 25 раз сильнее витамина C. Поддерживает сосуды, иммунитет, давление, восстановление.

КАК ПРИНИМАТЬ: ⅓ чайной ложки в день, растворить в воде/соке/чае. Лучше утром. Курс 2–3 месяца. Первый эффект с 7–10 дня.

ЦЕНЫ: 10 г — 2 590 ₽ (~30 дней), 20 г — 3 990 ₽ (~60 дней), 30 г — 4 990 ₽ (~90 дней).
ДОСТАВКА: по Иркутску бесплатно, по РФ от 2 дней (СДЭК, Почта России).
ГАРАНТИЯ: возврат 30 дней. ТЕЛЕФОН: 8 (950) 114-41-75, 07:00–17:00 МСК.
СОСТАВ: 100% чистый ДГК, без добавок. Чистота 96%+.

ПРАВИЛА:
- Отвечай коротко — 2–4 предложения, живым языком
- Сначала отвечай на вопрос, потом (если уместно) предложи заказ
- Не называй продукт лекарством, не обещай лечение
- На посторонние темы: "Я специалист только по ДГК АктивПлюс"
- Не придумывай данных которых нет выше`;

        server.middlewares.use("/api/chat", (req: IncomingMessage, res: ServerResponse) => {
          if (req.method !== "POST") { res.writeHead(405); res.end(); return; }
          let raw = "";
          req.on("data", (c: Buffer) => { raw += c.toString(); });
          req.on("end", async () => {
            try {
              const { message, sessionId } = JSON.parse(raw);
              const apiKey = process.env.CLAUDE_API_KEY;
              if (!apiKey) {
                console.log("\n[DEV] 💬 Чат (Claude не настроен):", message, "\n");
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: true, reply: "Чат в тестовом режиме. Для ответов добавьте CLAUDE_API_KEY в .env" }));
                return;
              }
              const history = chatSessions.get(sessionId) ?? [];
              const messages = [...history, { role: "user", content: message }];
              const r = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": apiKey,
                  "anthropic-version": "2023-06-01",
                },
                body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 300, system: CLAUDE_SYSTEM, messages }),
              });
              const data = await r.json() as { content?: { text: string }[] };
              const reply = data.content?.[0]?.text ?? "Не удалось получить ответ. Позвоните: 8 (950) 114-41-75";
              chatSessions.set(sessionId, [...messages, { role: "assistant", content: reply }]);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ ok: true, reply }));
            } catch (e) {
              console.error("[DEV] /api/chat error:", e);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ ok: false, reply: "Ошибка. Позвоните: 8 (950) 114-41-75" }));
            }
          });
        });

        server.middlewares.use("/api/chat-poll", (_req: IncomingMessage, res: ServerResponse) => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ replies: [] }));
        });
      },
    },
    {
      name: "telegram-api",
      configureServer(server) {
        server.middlewares.use(
          "/api/order",
          (req: IncomingMessage, res: ServerResponse) => {
            if (req.method !== "POST") {
              res.writeHead(405);
              res.end();
              return;
            }
            let raw = "";
            req.on("data", (c: Buffer) => { raw += c.toString(); });
            req.on("end", async () => {
              try {
                const data = JSON.parse(raw);
                const token = process.env.TG_BOT_TOKEN;
                const chatId = process.env.TG_CHAT_ID;
                if (token && chatId && !token.includes("your_")) {
                  await fetch(
                    `https://api.telegram.org/bot${token}/sendMessage`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        chat_id: chatId,
                        text: buildTgMessage(data),
                        parse_mode: "HTML",
                      }),
                    }
                  );
                } else {
                  console.log("\n[DEV] 📦 Заявка (Telegram не настроен):", data, "\n");
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: true }));
              } catch (e) {
                console.error("[DEV] /api/order error:", e);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: false }));
              }
            });
          }
        );
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
}));
