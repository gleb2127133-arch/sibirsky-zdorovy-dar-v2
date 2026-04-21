import { BookOpen } from "lucide-react";

const studies = [
  {
    title: "Защита эндотелия сосудов",
    source: "Кардиология, 2018",
    text: "Курсовой приём ДГК улучшил реологические свойства крови и снизил агрегацию тромбоцитов у пациентов с ИБС.",
  },
  {
    title: "Антиоксидантная активность",
    source: "Биохимия, 2015",
    text: "Эффективность ДГК как ловушки свободных радикалов в 11 раз превышает витамин C в стандартизованных тестах.",
  },
  {
    title: "Поддержка иммунитета",
    source: "Тюкавкина Н. А., обзор",
    text: "ДГК потенцирует действие витамина C, продлевая его антиоксидантный эффект и снижая частоту ОРВИ.",
  },
];

export const Science = () => (
  <section id="science" className="bg-secondary/40 py-20 lg:py-28">
    <div className="container-narrow">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <span className="eyebrow">Научная база</span>
          <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
            Открыт в России. Изучается с&nbsp;1970-х.
          </h2>
          <p className="mt-5 text-muted-foreground">
            Молекулу выделили советские химики Н. А. Тюкавкина и В. А. Запесочная.
            С тех пор по дигидрокверцетину опубликовано более 1 200 научных работ.
          </p>
        </div>

        <ul className="grid gap-4">
          {studies.map((s) => (
            <li
              key={s.title}
              className="rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                  <BookOpen className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-foreground">{s.title}</h3>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
                    {s.source}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
