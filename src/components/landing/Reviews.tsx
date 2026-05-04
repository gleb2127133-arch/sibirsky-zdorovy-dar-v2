import { Star } from "lucide-react";
import productReviewImg from "@/assets/product-review.jpeg";

const reviews = [
  {
    name: "Ирина М.",
    age: "58 лет",
    role: "Купила маме",
    initials: "ИМ",
    color: "bg-emerald-100 text-emerald-700",
    text: "Мама пьёт второй месяц. Давление держится ровнее, стала меньше жаловаться на головокружения. Заметили оба — и я, и она.",
    rating: 5,
  },
  {
    name: "Андрей К.",
    age: "45 лет",
    role: "После ковида",
    initials: "АК",
    color: "bg-blue-100 text-blue-700",
    text: "Долго не мог восстановиться — одышка, слабость. Через месяц приёма стало значительно легче дышать при нагрузке.",
    rating: 5,
  },
  {
    name: "Светлана П.",
    age: "39 лет",
    role: "ЗОЖ, бег",
    initials: "СП",
    color: "bg-violet-100 text-violet-700",
    text: "Принимаю как антиоксидант после длинных тренировок. Восстановление заметно быстрее, кожа выглядит свежее.",
    rating: 5,
  },
  {
    name: "Николай В.",
    age: "62 года",
    role: "Гипертония",
    initials: "НВ",
    color: "bg-amber-100 text-amber-700",
    text: "Врач посоветовала попробовать в дополнение к основному лечению. Через три недели заметил, что голова стала яснее и давление чуть стабильнее. Буду продолжать.",
    rating: 4,
  },
  {
    name: "Марина Д.",
    age: "44 года",
    role: "Хроническая усталость",
    initials: "МД",
    color: "bg-rose-100 text-rose-700",
    text: "Брала на пробу 10г — понравилось, что нет химии. Сейчас уже второй заказ на 30г. Стала высыпаться лучше и меньше болею в сезон простуд.",
    rating: 5,
  },
];

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

export const Reviews = () => (
  <section className="bg-secondary/40 py-20 lg:py-28">
    <div className="container-narrow">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <span className="eyebrow">Отзывы покупателей</span>
          <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
            Реальные истории за 2 года продаж
          </h2>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 shadow-sm">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
          </div>
          <span className="text-sm font-semibold">4.9 из 5</span>
          <span className="text-sm text-muted-foreground">· 1 247 отзывов</span>
        </div>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <article
            key={r.name}
            className="flex flex-col rounded-2xl border border-border bg-white p-7 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <StarRow rating={r.rating} />
            <p className="mt-5 flex-1 leading-relaxed text-foreground/85">«{r.text}»</p>
            <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${r.color}`}>
                {r.initials}
              </div>
              <div>
                <div className="font-semibold">{r.name}, {r.age}</div>
                <div className="text-sm text-muted-foreground">{r.role}</div>
              </div>
            </div>
          </article>
        ))}

        {/* Фото-отзыв */}
        <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all hover:border-primary/30 hover:shadow-md">
          <div className="relative h-56 w-full overflow-hidden">
            <img
              src={productReviewImg}
              alt="Посылка АктивПлюс — баночки и упаковка"
              className="h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="flex flex-1 flex-col p-7">
            <StarRow rating={5} />
            <p className="mt-5 flex-1 leading-relaxed text-foreground/85">«Заказывала сразу три баночки — пришло всё аккуратно упаковано, с памяткой и мерной ложечкой. Приятно, что всё продумано до мелочей.»</p>
            <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-pink-100 text-sm font-bold text-pink-700">
                ОС
              </div>
              <div>
                <div className="font-semibold">Ольга С., 47 лет</div>
                <div className="text-sm text-muted-foreground">Постоянный покупатель</div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
);
