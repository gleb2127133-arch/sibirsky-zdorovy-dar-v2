import { Star } from "lucide-react";

const reviews = [
  {
    name: "Ирина М., 58 лет",
    role: "Купила маме",
    text: "Мама пьёт второй месяц. Давление держится ровнее, стала меньше жаловаться на головокружения. Заметили оба — и я, и она.",
    rating: 5,
  },
  {
    name: "Андрей К., 45 лет",
    role: "После ковида",
    text: "Долго не мог восстановиться — одышка, слабость. Через месяц приёма стало значительно легче дышать при нагрузке.",
    rating: 5,
  },
  {
    name: "Светлана П., 39 лет",
    role: "ЗОЖ, бег",
    text: "Принимаю как антиоксидант после длинных тренировок. Восстановление заметно быстрее, кожа выглядит свежее.",
    rating: 5,
  },
];

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

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {reviews.map((r) => (
          <article
            key={r.name}
            className="flex flex-col rounded-2xl border border-border bg-white p-7 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="mt-5 flex-1 leading-relaxed text-foreground/85">«{r.text}»</p>
            <div className="mt-6 border-t border-border pt-5">
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-muted-foreground">{r.role}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
