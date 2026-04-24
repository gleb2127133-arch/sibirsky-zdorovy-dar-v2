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
  product: string;
  contact: string;
  comment?: string;
}) {
  const now = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
  return [
    "🛒 <b>Новый заказ — Сибирский здоровый дар</b>",
    "",
    `👤 <b>Имя:</b> ${d.name}`,
    `📞 <b>Телефон:</b> ${d.phone}`,
    `📦 <b>Товар:</b> ${PRODUCT_LABELS[d.product] ?? d.product}`,
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
