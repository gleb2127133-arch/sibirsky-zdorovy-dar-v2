import jarsImg from "@/assets/jars-real.jpg";

export const About = () => (
  <section id="about" className="bg-white py-20 lg:py-28">
    <div className="container-narrow grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
      <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
        <img
          src={jarsImg}
          alt="Линейка Дигидрокверцетин"
          width={1280}
          height={960}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div>
        <span className="eyebrow">Простыми словами</span>
        <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
          Что такое дигидрокверцетин
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Дигидрокверцетин (ДГК)</strong> — природный
            биофлавоноид, который добывают из ядровой древесины сибирской и даурской лиственницы.
            Его антиоксидантная сила в десятки раз выше, чем у витамина C.
          </p>
          <p>
            Молекула работает как охранник для каждой клетки: нейтрализует свободные радикалы,
            восстанавливает эластичность сосудов и поддерживает естественные защитные системы организма.
          </p>
          <p>
            ДГК открыли советские учёные —{" "}
            <strong className="text-foreground">Н. А. Тюкавкина и В. А. Запесочная</strong>.
            Сегодня это один из самых изученных российских препаратов натурального происхождения.
          </p>
        </div>
      </div>
    </div>
  </section>
);
