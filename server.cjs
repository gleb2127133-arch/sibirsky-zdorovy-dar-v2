const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'dist');
const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
};

// ─── Chat sessions (in-memory) ───────────────────────────────────────────────
const sessions = new Map(); // sessionId → { ownerReplies: string[], lastActivity: number }

function getSession(id) {
  if (!sessions.has(id)) sessions.set(id, { ownerReplies: [], managerEngaged: false, lastActivity: Date.now() });
  const s = sessions.get(id);
  s.lastActivity = Date.now();
  return s;
}

// Cleanup old sessions every 30 min
setInterval(() => {
  const expire = Date.now() - 2 * 60 * 60 * 1000;
  for (const [id, s] of sessions) if (s.lastActivity < expire) sessions.delete(id);
}, 30 * 60 * 1000);

// ─── FAQ ────────────────────────────────────────────────────────────────────
const FAQ = [
  {
    keys: ['цена', 'стоим', 'сколько стоит', 'почём', 'стоит'],
    answer: 'У нас три объёма:\n• 10 г — 2 590 ₽ (~30 дней)\n• 20 г — 3 990 ₽ (~60 дней) — выгоднее\n• 30 г — 4 990 ₽ (~90 дней) — лучшая цена\n\nЧем больше объём, тем дешевле за грамм.',
  },
  {
    keys: ['доставк', 'привез', 'привести', 'отправ', 'сколько идёт', 'как долго'],
    answer: 'Доставляем по всей России:\n• По Иркутску — бесплатно\n• В другие города — от 2 дней, стоимость уточним при заказе\n\nОплата картой, переводом или при получении.',
  },
  {
    keys: ['как принима', 'доза', 'дозировк', 'сколько пить', 'как пить', 'как употребл'],
    answer: 'Принимайте 1 г в день (≈ 1/5 чайной ложки).\nРастворите в стакане воды, сока или тёплого чая.\nЛучше утром до еды.\n\nМинимальный курс — 30 дней, рекомендуем 2–3 месяца для полного эффекта.',
  },
  {
    keys: ['когда эффект', 'через сколько', 'когда почувств', 'как быстро', 'долго ждать'],
    answer: 'ДГК действует накопительно:\n• 1–2 неделя — организм адаптируется\n• 2–3 неделя — первые изменения: энергия, сон\n• 4–6 неделя — сосуды, давление\n• 2–3 месяц — полный антиоксидантный эффект',
  },
  {
    keys: ['состав', 'из чего', 'добавки', 'натурал', 'чистый', 'без добавок'],
    answer: 'Состав: 100% чистый дигидрокверцетин (taxifolin).\nНикаких добавок, капсул, оболочек и наполнителей.\nДобывается из древесины сибирской лиственницы в Иркутской области.',
  },
  {
    keys: ['что такое', 'дгк', 'дигидрокверцетин', 'taxifolin', 'лиственниц'],
    answer: 'Дигидрокверцетин (ДГК) — природный антиоксидант из сибирской лиственницы.\nЕго антиоксидантная сила в 25 раз выше витамина C.\nЗащищает клетки от окисления, поддерживает сосуды, иммунитет и обмен веществ.\n\nЭто БАД, не лекарство.',
  },
  {
    keys: ['противопоказан', 'нельзя', 'кому нельзя', 'ограничени', 'беременн', 'аллерг'],
    answer: 'ДГК — натуральный продукт с хорошей переносимостью.\nОднако перед приёмом рекомендуем проконсультироваться с врачом, особенно если:\n• Вы беременны или кормите грудью\n• Принимаете лекарства\n• Есть хронические заболевания',
  },
  {
    keys: ['возврат', 'гарантия', 'не понравится', 'не подойдёт', 'вернуть деньги'],
    answer: 'Гарантия возврата 30 дней.\nЕсли продукт не подойдёт — вернём деньги без лишних вопросов.\nСвяжитесь с нами по телефону 8 (950) 114-41-75.',
  },
  {
    keys: ['опт', 'оптов', 'скидк', 'много', 'закупить'],
    answer: 'Оптовые поставки — обсуждаем индивидуально.\nПозвоните нам: 8 (950) 114-41-75\nРаботаем с 07:00 до 17:00 МСК.',
  },
  {
    keys: ['сертификат', 'качество', 'проверен', 'легально', 'документ'],
    answer: 'Продукт производится в Иркутской области и соответствует российским стандартам качества.\nЕсть все необходимые документы на БАД.\nПо запросу можем предоставить информацию — звоните: 8 (950) 114-41-75.',
  },
  {
    keys: ['телефон', 'номер', 'позвонить', 'связаться', 'контакт'],
    answer: 'Телефон: 8 (950) 114-41-75\nРаботаем ежедневно с 07:00 до 17:00 МСК.',
  },
];

function matchFaq(text) {
  const lower = text.toLowerCase();
  for (const item of FAQ) {
    if (item.keys.some(k => lower.includes(k))) return item.answer;
  }
  return null;
}

// ─── Claude AI ───────────────────────────────────────────────────────────────
const CLAUDE_SYSTEM = `Ты — Алекс, эксперт-консультант и топовый продавец интернет-магазина АктивПлюс. Твоя цель — помочь клиенту решить его проблему со здоровьем и оформить заказ прямо в чате.

ОБЯЗАТЕЛЬНО: всегда обращайся к клиенту на "Вы" (с большой буквы). Никогда не на "ты".

ПРОДУКТ:
- Дигидрокверцетин (ДГК) — чистый порошок без добавок из сибирской лиственницы, Иркутская область
- Чистота: 96%+ (подтверждена сертификатом) — один из лучших показателей на рынке РФ
- Антиоксидант в 25 раз мощнее витамина C
- Поддерживает сосуды, иммунитет, давление, восстановление после нагрузок и болезней
- Форма: порошок, растворяется в воде/соке/чае
- Никаких добавок, наполнителей, красителей — только чистое вещество

КАК ПРИНИМАТЬ: 1/5 чайной ложки в день в воде/соке/чае, утром до еды. Курс 2–3 месяца. Эффект с 2–3 недели.
ВАЖНО: никогда не говори "1 грамм" или "1 г" — всегда говори только "1/5 чайной ложки".

ЦЕНЫ И ОБЪЁМЫ:
- 10 г — 2 590 ₽ (~30 дней) — попробовать
- 20 г — 3 990 ₽ (~60 дней) — выгоднее, большинство берут
- 30 г — 4 990 ₽ (~90 дней) — максимальный результат, лучшая цена за грамм

ДОСТАВКА: по Иркутску бесплатно, по РФ от 2 дней (СДЭК, Почта России)
ГАРАНТИЯ: возврат 30 дней без вопросов
ТЕЛЕФОН: 8 (950) 114-41-75, с 08:00 до 17:00 МСК

СТРАТЕГИЯ ПРОДАЖИ (следуй этим шагам):
1. Поприветствуй тепло и сразу спроси — какую проблему хочет решить или что интересует
2. Внимательно выслушай, задай уточняющий вопрос если нужно
3. Дай конкретный совет — какой объём подойдёт и почему (исходя из ситуации клиента)
4. Закрой возражения — если сомневается в цене, напомни про гарантию возврата и выгоду большого объёма
5. Когда клиент готов заказать — собери по очереди: имя, телефон, город доставки
6. Подтверди заказ и скажи что менеджер свяжется в рабочее время с 08:00 до 17:00 МСК

КОГДА СОБРАНЫ ВСЕ ДАННЫЕ (имя + телефон + город + выбранный товар):
Напиши клиенту подтверждение, а в самом конце ответа на отдельной строке добавь:
[[ORDER:{"name":"ИМЯ","phone":"ТЕЛЕФОН","city":"ГОРОД","product":"ТОВАР"}]]

ПРАВИЛА:
- Отвечай коротко — 2–4 предложения, живым но уважительным языком
- Говори о продукте только то, что есть выше — не преувеличивай, не придумывай
- Никогда не называй продукт лекарством, не обещай лечение болезней
- На вопросы о конкретных болезнях: "ДГК поддерживает организм как БАД, по лечению — к врачу. Могу рассказать, что именно он даёт?"
- На посторонние вопросы (погода, политика, другие товары и т.д.): "Я специализируюсь только на дигидрокверцетине АктивПлюс — позвольте помочь Вам с выбором?"
- Будь тёплым и уважительным, не занудным. Не перечисляй всё сразу — веди диалог
- Не придумывай данных которых нет выше`;

function claudeChat(history, userMessage, cb) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) return cb(null, null);

  const messages = [
    ...history.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.text })),
    { role: 'user', content: userMessage },
  ];

  const body = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: CLAUDE_SYSTEM,
    messages,
  });

  const req = https.request(
    'https://api.anthropic.com/v1/messages',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body),
      },
    },
    (r) => {
      let raw = '';
      r.on('data', c => { raw += c; });
      r.on('end', () => {
        try {
          const json = JSON.parse(raw);
          const text = json.content?.[0]?.text || null;
          cb(null, text);
        } catch {
          cb(null, null);
        }
      });
    }
  );
  req.on('error', () => cb(null, null));
  req.write(body);
  req.end();
}

// ─── Telegram ────────────────────────────────────────────────────────────────
const PRODUCT_LABELS = { '10': 'D-Quercetin 10 г — 2 590 ₽', '20': 'D-Quercetin 20 г — 3 990 ₽', '30': 'D-Quercetin 30 г — 4 990 ₽' };
const CONTACT_LABELS = { phone: 'Звонок', max: 'Менеджер', telegram: 'Telegram' };

function tgRequest(method, body, cb) {
  const token = process.env.TG_BOT_TOKEN;
  if (!token) return cb && cb(null);
  const payload = JSON.stringify(body);
  const req = https.request(
    `https://api.telegram.org/bot${token}/${method}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } },
    (r) => { let d = ''; r.on('data', c => d += c); r.on('end', () => cb && cb(null, d)); }
  );
  req.on('error', () => cb && cb(null));
  req.write(payload);
  req.end();
}

function sendChatHistory(sessionId, history) {
  const chatId = process.env.TG_CHAT_ID;
  if (!chatId || !history || !history.length) return;
  const lines = history.map(m => {
    const who = m.role === 'user' ? '🧑 Клиент' : '🤖 Бот';
    return `${who}: ${m.text.replace(/\[\[ORDER:.*?\]\]/s, '').replace(/\*\*(.*?)\*\*/g, '$1').trim()}`;
  });
  const text = [`💬 <b>История чата</b> [<code>${sessionId}</code>]`, '', ...lines].join('\n');
  // Telegram limit 4096 chars
  const chunks = [];
  for (let i = 0; i < text.length; i += 4000) chunks.push(text.slice(i, i + 4000));
  chunks.forEach(chunk => tgRequest('sendMessage', { chat_id: chatId, text: chunk, parse_mode: 'HTML' }));
}

function notifyManagerNeeded(sessionId) {
  const chatId = process.env.TG_CHAT_ID;
  if (!chatId) return;
  const text = [
    `❓ <b>Клиент ждёт менеджера</b> [<code>${sessionId}</code>]`,
    '',
    `Чтобы ответить напишите боту:`,
    `<code>${sessionId} Ваш ответ</code>`,
  ].join('\n');
  tgRequest('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML' });
}

function buildTgMessage(d) {
  const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
  const PRICES = { '10': 2590, '20': 3990, '30': 4990 };
  const cartLines = (d.cart || []).map(item => {
    const total = (PRICES[item.id] ?? 0) * item.qty;
    return `  • ${PRODUCT_LABELS[item.id] ?? item.id} × ${item.qty} шт. — ${total.toLocaleString('ru-RU')} ₽`;
  });
  const grandTotal = (d.cart || []).reduce((s, i) => s + (PRICES[i.id] ?? 0) * i.qty, 0);
  return [
    '🛒 <b>Новый заказ — АктивПлюс</b>', '',
    `👤 <b>Имя:</b> ${d.name}`,
    `📞 <b>Телефон:</b> ${d.phone}`, '',
    '🧺 <b>Состав:</b>', ...cartLines,
    `💰 <b>Итого: ${grandTotal.toLocaleString('ru-RU')} ₽</b>`, '',
    `💬 <b>Связь:</b> ${CONTACT_LABELS[d.contact] ?? d.contact}`,
    d.comment ? `📝 <b>Комментарий:</b> ${d.comment}` : '',
    '', `⏰ ${now} МСК`,
  ].filter(Boolean).join('\n');
}

// ─── Telegram polling (owner replies) ────────────────────────────────────────
let tgOffset = 0;

function pollTelegram() {
  const token = process.env.TG_BOT_TOKEN;
  const ownerChatId = process.env.TG_CHAT_ID;
  if (!token || !ownerChatId) return;

  const body = JSON.stringify({ offset: tgOffset, timeout: 5, allowed_updates: ['message'] });
  const req = https.request(
    `https://api.telegram.org/bot${token}/getUpdates`,
    { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
    (r) => {
      let raw = '';
      r.on('data', c => raw += c);
      r.on('end', () => {
        try {
          const data = JSON.parse(raw);
          if (!data.ok) return;
          for (const update of data.result) {
            tgOffset = update.update_id + 1;
            const msg = update.message;
            if (!msg || String(msg.chat.id) !== String(ownerChatId)) continue;
            const text = msg.text || '';
            // Format: "SESSIONID ответ владельца"
            const match = text.match(/^([a-z0-9]{8})\s+(.+)$/is);
            if (match) {
              const [, sid, reply] = match;
              if (sessions.has(sid)) {
                getSession(sid).ownerReplies.push(reply.trim());
              }
            }
          }
        } catch {}
        setTimeout(pollTelegram, 3000);
      });
    }
  );
  req.on('error', () => setTimeout(pollTelegram, 5000));
  req.write(body);
  req.end();
}

setTimeout(pollTelegram, 2000);

// ─── HTTP server ─────────────────────────────────────────────────────────────
function readBody(req, cb) {
  let raw = '';
  req.on('data', c => { raw += c.toString(); });
  req.on('end', () => { try { cb(null, JSON.parse(raw)); } catch { cb(new Error('bad json')); } });
}

http.createServer((req, res) => {
  const json = (data, status = 200) => {
    res.writeHead(status, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify(data));
  };

  // POST /api/order
  if (req.method === 'POST' && req.url === '/api/order') {
    readBody(req, (err, data) => {
      if (err) return json({ ok: false }, 400);
      const token = process.env.TG_BOT_TOKEN;
      const chatId = process.env.TG_CHAT_ID;
      if (!token || !chatId) return json({ ok: true });
      const body = JSON.stringify({ chat_id: chatId, text: buildTgMessage(data), parse_mode: 'HTML' });
      const r = https.request(
        `https://api.telegram.org/bot${token}/sendMessage`,
        { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
        () => json({ ok: true })
      );
      r.on('error', () => json({ ok: true }));
      r.write(body); r.end();
    });
    return;
  }

  // POST /api/chat
  if (req.method === 'POST' && req.url === '/api/chat') {
    readBody(req, (err, data) => {
      if (err) return json({ ok: false }, 400);
      const { message, sessionId } = data;
      if (!message || !sessionId) return json({ ok: false }, 400);

      getSession(sessionId);
      const session = getSession(sessionId);
      const history = session.history || [];
      claudeChat(history, message, (err, claudeReply) => {
        if (claudeReply) {
          // Парсим [[ORDER:...]] если Claude оформил заказ
          const orderMatch = claudeReply.match(/\[\[ORDER:(\{.*?\})\]\]/s);
          let orderPlaced = false;
          let cleanReply = claudeReply
            .replace(/\[\[ORDER:.*?\]\]/s, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .trim();

          const newHistory = [...history, { role: 'user', text: message }, { role: 'model', text: claudeReply }];
          session.history = newHistory;

          if (orderMatch) {
            try {
              const order = JSON.parse(orderMatch[1]);
              const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
              const tgText = [
                '🛒 <b>Заявка из чата — АктивПлюс</b>', '',
                `👤 <b>Имя:</b> ${order.name}`,
                `📞 <b>Телефон:</b> ${order.phone}`,
                `📍 <b>Город:</b> ${order.city}`,
                `📦 <b>Товар:</b> ${order.product}`,
                '', `⏰ ${now} МСК`,
              ].join('\n');
              tgRequest('sendMessage', { chat_id: process.env.TG_CHAT_ID, text: tgText, parse_mode: 'HTML' });
              sendChatHistory(sessionId, newHistory);
              orderPlaced = true;
            } catch {}
          }

          return json({ ok: true, reply: cleanReply, source: 'claude', orderPlaced });
        }
        // Claude недоступен — передаём менеджеру
        if (session.managerEngaged) {
          return json({ ok: true, reply: null, source: 'bot', waitOwner: true });
        }
        session.managerEngaged = true;
        notifyManagerNeeded(sessionId);
        sendChatHistory(sessionId, [...(session.history || []), { role: 'user', text: message }]);
        json({
          ok: true,
          reply: 'Передаю вопрос менеджеру — ответит в течение нескольких минут. Также можно позвонить: 8 (950) 114-41-75',
          source: 'bot',
          waitOwner: true,
        });
      });
    });
    return;
  }

  // GET /api/chat-poll?session=ID
  if (req.method === 'GET' && req.url.startsWith('/api/chat-poll')) {
    const sid = new URL(req.url, 'http://x').searchParams.get('session');
    if (!sid || !sessions.has(sid)) return json({ replies: [] });
    const s = sessions.get(sid);
    const replies = [...s.ownerReplies];
    s.ownerReplies = [];
    json({ replies });
    return;
  }

  // Static files
  let url = req.url.split('?')[0];
  let file = path.join(dist, url === '/' ? 'index.html' : url);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(dist, 'index.html');
  }
  const ext = path.extname(file);
  res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);

}).listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});
