/**
 * generate-article.cjs
 * Генерирует SEO-статью о дигидрокверцетине с помощью Claude API + web_search
 * Запуск: node generate-article.cjs
 * Cron: 0 6 * * * cd /var/www/aktivplus && node generate-article.cjs
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TG_CHAT_ID = process.env.TG_CHAT_ID;

const BLOG_DIR = path.join(__dirname, 'blog');
if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });

// ─── Категории ротации ───────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'sport',
    label: 'ДГК в спорте',
    topics: [
      'Дигидрокверцетин для спортсменов: восстановление после тренировок',
      'ДГК и выносливость: как антиоксидант помогает при физических нагрузках',
      'Дигидрокверцетин в бодибилдинге: защита мышц от окислительного стресса',
      'Природный антиоксидант для бегунов: дигидрокверцетин и аэробные нагрузки',
      'ДГК после марафона: ускорение восстановления с дигидрокверцетином',
    ],
  },
  {
    id: 'science',
    label: 'Научные исследования',
    topics: [
      'Клинические исследования дигидрокверцетина: что говорит наука',
      'Механизм действия ДГК: как таксифолин защищает клетки от окисления',
      'Дигидрокверцетин и сердечно-сосудистая система: научные данные',
      'Антиоксидантная активность ДГК: сравнение с витамином C и E',
      'Биодоступность дигидрокверцетина: как организм усваивает таксифолин',
    ],
  },
  {
    id: 'health',
    label: 'Здоровье и профилактика',
    topics: [
      'Дигидрокверцетин для иммунитета: природная защита в сезон простуд',
      'ДГК и давление: как антиоксидант поддерживает сосуды',
      'Дигидрокверцетин против старения: антиоксидант для молодости клеток',
      'ДГК при диабете: влияние на уровень сахара и сосуды',
      'Дигидрокверцетин для печени: защита от токсинов и алкоголя',
      'ДГК и холестерин: как таксифолин влияет на липидный профиль',
    ],
  },
  {
    id: 'news',
    label: 'Новости',
    topics: [
      'Рынок антиоксидантов в России 2026: тренды и перспективы',
      'Сибирская лиственница как источник ДГК: уникальные свойства российского сырья',
      'Дигидрокверцетин vs зарубежные БАД: почему отечественный продукт лучше',
      'Популярность ДГК растёт: почему россияне выбирают природные антиоксиданты',
    ],
  },
  {
    id: 'stories',
    label: 'Применение',
    topics: [
      'Дигидрокверцетин после 50: как антиоксидант помогает сохранить здоровье',
      'ДГК при восстановлении после COVID-19: опыт применения',
      'Дигидрокверцетин для мозга: влияние на память и концентрацию',
      'ДГК и кожа: антиоксидант для красоты изнутри',
      'Как правильно принимать дигидрокверцетин: полное руководство',
    ],
  },
];

// ─── Выбор темы ──────────────────────────────────────────────────────────────
function pickTopic() {
  const existing = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.json'));
  const usedTopics = new Set();
  for (const f of existing) {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(BLOG_DIR, f), 'utf8'));
      if (d.topicUsed) usedTopics.add(d.topicUsed);
    } catch {}
  }

  // Ротация категорий по дню недели
  const dayIndex = new Date().getDay();
  const catOrder = [1, 2, 0, 3, 0, 4, 1]; // Mon..Sun → категория
  const cat = CATEGORIES[catOrder[dayIndex] % CATEGORIES.length];

  const available = cat.topics.filter(t => !usedTopics.has(t));
  const topic = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : cat.topics[Math.floor(Math.random() * cat.topics.length)];

  return { category: cat, topic };
}

// ─── Slug из заголовка ───────────────────────────────────────────────────────
function slugify(text) {
  const map = { 'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya' };
  return text.toLowerCase()
    .split('').map(c => map[c] ?? c).join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

// ─── Запрос к Claude API ──────────────────────────────────────────────────────
function callClaude(systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 8000,
      tools: [{
        type: 'web_search_20250305',
        name: 'web_search',
        max_uses: 4,
      }],
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const req = https.request(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'web-search-2025-03-05',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (r) => {
        let raw = '';
        r.on('data', c => raw += c);
        r.on('end', () => {
          try {
            const json = JSON.parse(raw);
            // Берём последний text блок
            const texts = (json.content || []).filter(b => b.type === 'text');
            const text = texts[texts.length - 1]?.text || null;
            resolve(text);
          } catch (e) { reject(e); }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── Telegram уведомление ────────────────────────────────────────────────────
function notifyTelegram(text) {
  if (!TG_BOT_TOKEN || !TG_CHAT_ID) return;
  const body = JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: 'HTML' });
  const req = https.request(
    `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`,
    { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
    () => {}
  );
  req.on('error', () => {});
  req.write(body);
  req.end();
}

// ─── Главная функция ─────────────────────────────────────────────────────────
async function main() {
  if (!CLAUDE_API_KEY) {
    console.error('CLAUDE_API_KEY не задан');
    process.exit(1);
  }

  const { category, topic } = pickTopic();
  console.log(`Генерирую статью: "${topic}" [${category.label}]`);

  const SYSTEM = `Ты — профессиональный SEO-копирайтер и эксперт по нутрициологии. Пишешь статьи для блога российского производителя дигидрокверцетина (ДГК) АктивПлюс.

ПРОДУКТ: Дигидрокверцетин АктивПлюс — чистый порошок 96%+, из сибирской лиственницы, Иркутская область. Дозировка: 1/5 чайной ложки в день. Это БАД, не лекарство.
САЙТ: https://activepluse.ru

═══════════════════════════════════════════
ГЛАВНЫЙ ПРИНЦИП (Google E-E-A-T):
Статья пишется ДЛЯ ЛЮДЕЙ, а не для поисковиков.
Читатель должен получить исчерпывающий ответ на свой вопрос и не идти искать дальше.
Каждое утверждение — основано на реальных данных из web_search.
═══════════════════════════════════════════

ПРАВИЛА НАПИСАНИЯ:
1. Используй реальные научные данные — ищи через web_search актуальные исследования, цифры, факты
2. Пиши живым, экспертным языком — как умный врач-консультант с личным опытом, а не как Wikipedia
3. Структура: вступление (зачем читать) → 3-5 разделов h2 → практические советы → вывод + мягкая отсылка к продукту
4. Длина: 1500–2500 слов
5. Не пиши "лечит", "лекарство" — пиши "поддерживает", "способствует", "помогает организму"
6. Упоминай АктивПлюс 1-2 раза ненавязчиво
7. В конце — призыв посетить https://activepluse.ru

ПРАВИЛА SEO (Google Search Central):

— TITLE: уникальный, 50-60 символов, главный ключевой запрос БЛИЖЕ К НАЧАЛУ, точно описывает содержание, без кликбейта и преувеличений, не дублирует внутренние заголовки h2/h3

— META DESCRIPTION: 150-160 символов, КОНКРЕТНЫЙ (не "статья о ДГК"), содержит ключевой запрос, побуждает кликнуть, уникален для каждой статьи
  Плохо: "Всё о дигидрокверцетине в спорте"
  Хорошо: "Как ДГК ускоряет восстановление после тренировок: данные исследований и практические дозировки для спортсменов"

— ЗАГОЛОВКИ H2/H3: каждый раздел — свой заголовок, раскрывающий подтему. Ключевые слова — органично, не в каждом

— КЛЮЧЕВЫЕ СЛОВА: используй естественно, без переспама. Ключи: "дигидрокверцетин", "ДГК", "таксифолин", "антиоксидант из лиственницы", "природный антиоксидант". Синонимы снижают повторяемость и расширяют охват

— УНИКАЛЬНОСТЬ: оригинальный анализ, свой контекст к фактам. Не переписывай другие статьи и не копируй текст из источников

— СТРУКТУРА для удобного чтения: абзацы 3-5 предложений, предложения до 25 слов, списки ul/li где уместно, blockquote для важных цитат/фактов

— ПОЛНОТА: полностью отвечай на запрос, не обрывай мысль, не делай "воды" ради объёма

— ДОСТОВЕРНОСТЬ: только проверенные факты из web_search. Никаких выдуманных исследований, цифр, названий журналов

— ССЫЛКИ: не добавляй внешние ссылки в content. Только внутренняя ссылка на https://activepluse.ru в финале

САМОПРОВЕРКА перед финальным ответом:
✓ Читатель получит исчерпывающий ответ — ему не нужно идти искать дальше?
✓ Все факты подтверждены через web_search?
✓ Title 50-60 символов, ключевое слово в начале?
✓ Description конкретный, 150-160 символов?
✓ Нет keyword stuffing?
✓ Контент уникальный — не переписка чужих материалов?

ФОРМАТ ОТВЕТА — строго JSON:
{
  "title": "заголовок статьи (50-60 символов, главный ключевой запрос в начале)",
  "description": "SEO описание (150-160 символов, конкретное, с ключевым запросом, побуждающее к клику)",
  "readTime": число минут чтения,
  "keywords": ["ключевое слово 1", "ключевое слово 2", ...до 8 штук],
  "content": "полный HTML статьи (h2, h3, p, ul, li, strong, blockquote)"
}`;

  const USER = `Напиши статью на тему: "${topic}"

Категория: ${category.label}

Используй web_search для поиска актуальных научных данных, исследований и фактов по теме. Бери только достоверную информацию.

Верни строго валидный JSON без markdown-обёртки.`;

  let raw;
  try {
    raw = await callClaude(SYSTEM, USER);
    if (!raw) throw new Error('Пустой ответ от Claude');
  } catch (e) {
    console.error('Ошибка Claude API:', e.message);
    notifyTelegram(`❌ <b>Блог АктивПлюс</b>\nОшибка генерации статьи: ${e.message}`);
    process.exit(1);
  }

  // Парсим JSON (убираем markdown-обёртку если есть)
  let article;
  try {
    // Сначала ищем внутри ```json ... ``` блока
    const codeBlockMatch = raw.match(/```json\s*([\s\S]*?)```/);
    const jsonStr = codeBlockMatch ? codeBlockMatch[1] : raw;
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON не найден в ответе');
    article = JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error('Ошибка парсинга JSON:', e.message);
    console.error('Длина ответа:', raw.length);
    console.error('Начало:', raw.slice(0, 300));
    console.error('Конец:', raw.slice(-300));
    notifyTelegram(`❌ <b>Блог АктивПлюс</b>\nОшибка парсинга статьи: ${e.message}`);
    process.exit(1);
  }

  const date = new Date().toISOString().split('T')[0];
  const slug = slugify(article.title) + '-' + date;

  const fullArticle = {
    slug,
    title: article.title,
    description: article.description,
    category: category.id,
    categoryLabel: category.label,
    date,
    readTime: article.readTime || 7,
    keywords: article.keywords || [],
    content: article.content,
    topicUsed: topic,
  };

  const filePath = path.join(BLOG_DIR, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(fullArticle, null, 2), 'utf8');
  console.log(`✅ Статья сохранена: ${filePath}`);

  notifyTelegram([
    `✅ <b>Новая статья в блоге АктивПлюс</b>`,
    ``,
    `📝 <b>${article.title}</b>`,
    `🏷 ${category.label}`,
    `⏱ ${article.readTime} мин чтения`,
    ``,
    `🔗 https://activepluse.ru/blog/${slug}`,
  ].join('\n'));

  console.log(`Статья опубликована: https://activepluse.ru/blog/${slug}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
