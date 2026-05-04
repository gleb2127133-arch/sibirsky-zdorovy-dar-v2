import { FlaskConical, Clock, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: FlaskConical,
    title: "Дозировка",
    text: "1/3 чайной ложки порошка один раз в день во время еды. Можно растворить в тёплой воде или добавить в напиток.",
  },
  {
    icon: Clock,
    title: "Курс приёма",
    text: "2 месяца — затем перерыв 1 месяц. Первые ощущения появляются с 7–10 дня, накопительный эффект — со 2–3 недели.",
  },
  {
    icon: RotateCcw,
    title: "Повторный курс",
    text: "Для стойкого результата рекомендуется 2–3 курса в год. Особенно эффективно в осенне-зимний период.",
  },
];

const contraindications = [
  "Индивидуальная непереносимость компонентов",
  "Беременность и период лактации",
  "Дети до 14 лет — только по назначению врача",
  "Приём антикоагулянтов — предварительно проконсультируйтесь с врачом",
];

export const HowToUse = () => (
  <section id="how-to-use" className="bg-secondary/40 py-20 lg:py-28">
    <div className="container-narrow">
      <div className="max-w-2xl">
        <span className="eyebrow">Применение</span>
        <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
          Как принимать
        </h2>
        <p className="mt-4 text-muted-foreground">
          Простой приём, без капсул и таблеток — чистый порошок с чистотой 96%+.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-border bg-white p-6">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary-soft text-primary">
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <h3 className="mt-5 font-serif text-xl text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>

      {/* Чистота + противопоказания */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">

        {/* Чистота */}
        <div className="flex items-start gap-5 rounded-2xl bg-primary p-7 text-primary-foreground">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/15">
            <CheckCircle2 className="h-6 w-6" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold">Чистота 96%+</h3>
            <p className="mt-2 text-sm leading-relaxed text-primary-foreground/85">
              Без добавок, красителей и наполнителей. Каждая партия проходит лабораторный контроль на чистоту, тяжёлые металлы и микробиологию. Производство — Иркутская область.
            </p>
          </div>
        </div>

        {/* Противопоказания */}
        <div className="rounded-2xl border border-border bg-white p-7">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600">
              <AlertCircle className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <h3 className="font-serif text-xl text-foreground">Противопоказания</h3>
          </div>
          <ul className="mt-4 space-y-2">
            {contraindications.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Не является лекарственным средством. Перед применением проконсультируйтесь со специалистом.
          </p>
        </div>

      </div>
    </div>
  </section>
);
