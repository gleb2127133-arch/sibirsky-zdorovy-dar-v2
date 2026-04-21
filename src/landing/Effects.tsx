import { Heart, Activity, Droplets, Shield, Sparkles, Zap, Atom } from "lucide-react";

const items = [
  { icon: Heart, title: "Сосуды и капилляры", text: "Укрепляет стенки и восстанавливает эластичность." },
  { icon: Activity, title: "Давление", text: "Поддерживает здоровый кровоток и нормализует тонус." },
  { icon: Droplets, title: "Холестерин", text: "Помогает снижать «плохой» LDL-холестерин." },
  { icon: Shield, title: "Иммунитет", text: "Активирует защитные реакции, особенно после болезней." },
  { icon: Sparkles, title: "Кожа и молодость", text: "Замедляет окислительное старение клеток." },
  { icon: Zap, title: "Энергия и тонус", text: "Снижает усталость, ускоряет восстановление." },
];

export const Effects = () => (
  <section id="effects" className="bg-secondary/40 py-20 lg:py-28">
    <div className="container-narrow">
      <div className="max-w-2xl">
        <span className="eyebrow">Эффекты</span>
        <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
          Что чувствуют те, кто принимает курсом
        </h2>
        <p className="mt-4 text-muted-foreground">
          Эффекты накапливаются со 2–3 недели приёма. Полный курс — 2–3 месяца.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="group rounded-2xl border border-border bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
          >
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <h3 className="mt-5 font-serif text-xl text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </article>
        ))}
      </div>

      {/* Feature row instead of odd 7th card */}
      <div className="mt-6 flex flex-col items-center justify-between gap-5 rounded-2xl bg-primary p-8 text-primary-foreground lg:flex-row lg:gap-8 lg:p-10">
        <div className="flex items-center gap-5">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/15">
            <Atom className="h-6 w-6" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl">Антиоксидант №1</h3>
            <p className="mt-1 text-sm text-primary-foreground/85 sm:text-base">
              Активность в 10–25 раз выше, чем у витамина C
            </p>
          </div>
        </div>
        <a
          href="#science"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Научная база
        </a>
      </div>
    </div>
  </section>
);
