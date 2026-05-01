import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Zap, TrendingUp, Shield, Star } from "lucide-react";

const steps = [
  {
    week: "1–7 дней",
    label: "Старт",
    icon: Zap,
    title: "Организм адаптируется",
    text: "Молекулы ДГК начинают насыщать клетки. В первые дни изменений почти не заметно — антиоксидант накапливается в тканях.",
    metric: "100%",
    metricLabel: "усвоение",
    color: "from-emerald-500/20 to-transparent",
  },
  {
    week: "2–3 недели",
    label: "Первые признаки",
    icon: TrendingUp,
    title: "Ощущается прилив сил",
    text: "Улучшается микроциркуляция крови. Большинство покупателей отмечают: легче просыпаться, меньше усталости к вечеру.",
    metric: "73%",
    metricLabel: "замечают эффект",
    color: "from-emerald-500/30 to-transparent",
  },
  {
    week: "4–6 недель",
    label: "Видимый результат",
    icon: Shield,
    title: "Сосуды и давление",
    text: "Стенки сосудов укрепляются, давление стабилизируется. Именно в этот период большинство покупают следующую банку.",
    metric: "89%",
    metricLabel: "продолжают курс",
    color: "from-emerald-400/35 to-transparent",
  },
  {
    week: "2–3 месяца",
    label: "Накопительный эффект",
    icon: Star,
    title: "Глубокая защита клеток",
    text: "Полный антиоксидантный эффект на клеточном уровне. Организм защищён от свободных радикалов изнутри — это и есть цель курса.",
    metric: "25×",
    metricLabel: "мощнее витамина C",
    color: "from-emerald-300/40 to-transparent",
  },
];

function Counter({ value, inView }: { value: string; inView: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.]/g, "");
  const hasRun = useRef(false);

  useEffect(() => {
    if (!inView || hasRun.current || isNaN(numeric)) return;
    hasRun.current = true;
    const el = ref.current;
    if (!el) return;
    const controls = animate(0, numeric, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        el.textContent = (Number.isInteger(numeric) ? Math.round(v) : v.toFixed(0)) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, numeric, suffix]);

  return <span ref={ref}>{isNaN(numeric) ? value : "0" + suffix}</span>;
}

const LINE_VARIANTS = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.12 },
  }),
};

export const CourseTimeline = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-foreground py-20 text-white lg:py-28"
    >
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(158_64%_32%_/_0.25),transparent)]" />

      <div className="container-narrow relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="inline-block h-px w-8 bg-primary" />
            Курс приёма
          </span>
          <h2 className="mt-5 font-serif text-3xl leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
            Когда почувствуете результат
          </h2>
          <p className="mt-4 text-white/60">
            ДГК действует накопительно. Вот как меняется самочувствие по неделям.
          </p>
        </motion.div>

        {/* Desktop: horizontal timeline */}
        <div className="mt-16 hidden lg:block">
          {/* Progress line */}
          <div className="relative mb-2 flex items-center">
            {steps.map((_, i) => (
              <div key={i} className="relative flex flex-1 items-center">
                {/* Dot */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.12, ease: "backOut" }}
                  className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-foreground shadow-[0_0_0_4px_hsl(158_64%_32%_/_0.15)]"
                >
                  <span className="font-serif text-sm font-bold text-primary">{i + 1}</span>
                </motion.div>

                {/* Connector */}
                {i < steps.length - 1 && (
                  <div className="relative mx-2 h-px flex-1 bg-white/10">
                    <motion.div
                      variants={LINE_VARIANTS}
                      initial="hidden"
                      animate={inView ? "show" : "hidden"}
                      style={{ originX: 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Cards */}
          <div className="mt-6 grid grid-cols-4 gap-5">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.week}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate={inView ? "show" : "hidden"}
                  onMouseEnter={() => setActiveStep(i)}
                  onMouseLeave={() => setActiveStep(null)}
                  className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
                    activeStep === i
                      ? "border-primary/50 bg-white/8 shadow-[0_0_40px_hsl(158_64%_32%_/_0.2)]"
                      : "border-white/8 bg-white/4 hover:border-primary/30"
                  }`}
                >
                  {/* Glow bg */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${s.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                  <div className="relative">
                    {/* Week badge */}
                    <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                      {s.week}
                    </span>

                    {/* Icon */}
                    <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </div>

                    <h3 className="mt-4 font-serif text-lg leading-snug text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{s.text}</p>

                    {/* Metric */}
                    <div className="mt-5 border-t border-white/8 pt-4">
                      <div className="font-serif text-2xl font-semibold text-primary">
                        <Counter value={s.metric} inView={inView} />
                      </div>
                      <div className="mt-0.5 text-xs text-white/40">{s.metricLabel}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="mt-12 flex flex-col gap-0 lg:hidden">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isLast = i === steps.length - 1;
            return (
              <motion.div
                key={s.week}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="flex gap-4"
              >
                {/* Left: dot + line */}
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-foreground">
                    <span className="font-serif text-sm font-bold text-primary">{i + 1}</span>
                  </div>
                  {!isLast && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={inView ? { scaleY: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                      style={{ originY: 0 }}
                      className="mt-1 w-px flex-1 bg-gradient-to-b from-primary to-primary/20"
                    />
                  )}
                </div>

                {/* Right: card */}
                <div className="mb-6 flex-1 overflow-hidden rounded-2xl border border-white/8 bg-white/4 p-5">
                  <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {s.week}
                  </span>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Icon className="h-4 w-4" strokeWidth={2.2} />
                    </div>
                    <h3 className="font-serif text-lg text-white">{s.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{s.text}</p>
                  <div className="mt-4 border-t border-white/8 pt-3">
                    <span className="font-serif text-xl font-semibold text-primary">
                      <Counter value={s.metric} inView={inView} />
                    </span>
                    <span className="ml-2 text-xs text-white/40">{s.metricLabel}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/4 px-8 py-8 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <div>
            <p className="font-serif text-xl text-white">Минимальный курс — 30 дней</p>
            <p className="mt-1 text-sm text-white/50">Хватит одной банки на 10 г. Этого достаточно чтобы почувствовать разницу.</p>
          </div>
          <a
            href="#catalog"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_12px_hsl(158_64%_32%_/_0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_6px_20px_hsl(158_64%_32%_/_0.5)] active:scale-[0.98]"
          >
            Выбрать объём
          </a>
        </motion.div>
      </div>
    </section>
  );
};
