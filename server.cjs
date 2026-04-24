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

const PRODUCT_LABELS = {
  '10': 'D-Quercetin 10 г — 2 590 ₽',
  '20': 'D-Quercetin 20 г — 3 990 ₽',
  '30': 'D-Quercetin 30 г — 4 990 ₽',
};
const CONTACT_LABELS = { phone: 'Звонок', max: 'Макс', telegram: 'Telegram' };

function buildTgMessage(d) {
  const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
  return [
    '🛒 <b>Новый заказ — Сибирский здоровый дар</b>',
    '',
    `👤 <b>Имя:</b> ${d.name}`,
    `📞 <b>Телефон:</b> ${d.phone}`,
    `📦 <b>Товар:</b> ${PRODUCT_LABELS[d.product] || d.product}`,
    `💬 <b>Связь через:</b> ${CONTACT_LABELS[d.contact] || d.contact}`,
    d.comment ? `📝 <b>Комментарий:</b> ${d.comment}` : '',
    '',
    `⏰ ${now} МСК`,
  ].filter(Boolean).join('\n');
}

function sendToTelegram(text, cb) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  if (!token || !chatId || token.includes('your_')) return cb(null);
  const body = JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' });
  const req = https.request(
    `https://api.telegram.org/bot${token}/sendMessage`,
    { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
    (r) => { r.resume(); cb(null); }
  );
  req.on('error', cb);
  req.write(body);
  req.end();
}

http.createServer((req, res) => {
  // POST /api/order → Telegram
  if (req.method === 'POST' && req.url === '/api/order') {
    let raw = '';
    req.on('data', (c) => { raw += c.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(raw);
        sendToTelegram(buildTgMessage(data), () => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
        });
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false }));
      }
    });
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
