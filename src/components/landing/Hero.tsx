import { motion, type Variants } from "framer-motion";
import jarImg from "@/assets/hero-3jars.jpg";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const imageVariant: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const viewport = { once: true, amount: 0.25 };

const highlights = [
  "Чистота 96%+",
  "Сертификат СГР ЕАЭС",
  "Сибирская лиственница",
];

export const Hero = () => {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-soft">
      <div className="container-narrow relative grid items-center gap-12 py-16 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-24">
        {/* LEFT */}
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={viewport}>
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
              Натуральный антиоксидант
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Дигидрокверцетин{" "}
            <span className="text-primary">из сибирской лиственницы</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Природный биофлавоноид для поддержки сосудов, сердца и иммунитета.
            Активность в 10–25 раз выше витамина C.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a href="#catalog" className="btn-primary">
              Выбрать упаковку
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </a>
            <a href="#about" className="btn-outline">
              Подробнее о продукте
            </a>
          </motion.div>

          <motion.ul
            variants={item}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2"
          >
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-sm font-medium text-foreground/75">
                <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                {h}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          variants={imageVariant}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="relative"
        >
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-border bg-white shadow-lg">
            <img
              src={jarImg}
              alt="Дигидрокверцетин — премиум баночка"
              width={1280}
              height={1280}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Clean price badge */}
          <div className="absolute -bottom-4 -right-2 rounded-2xl border border-border bg-white px-5 py-4 shadow-md sm:-right-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Цена от</p>
            <p className="font-serif text-2xl font-semibold text-foreground">2 590 ₽</p>
          </div>
        </motion.div>
      </div>

      {/* Trust strip */}
      <div className="border-t border-border bg-white">
        <div className="container-narrow flex flex-col items-center justify-between gap-3 py-5 text-center text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground sm:flex-row sm:text-left">
          <span>СГР Роспотребнадзора</span>
          <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
          <span>Производство — Иркутская область</span>
          <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
          <span>Доставка по РФ от 2 дней</span>
        </div>
      </div>
    </section>
  );
};
