import jarsImg from "@/assets/about-product.jpg";

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
          className="w-full object-cover"
        />
      </div>

      <div>
        <span className="eyebrow">Простыми словами</span>
        <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
          Что такое дигидрокверцетин
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Дигидрокверцетин (ДГКВ)</strong>, зарубежное название —{" "}
            <strong className="text-foreground">taxifolin</strong>, — это флавонол, который добывается
            в промышленных масштабах из древесины лиственницы сибирской (Larix sibirica) и лиственницы
            даурской (Larix gmelinii). Входит в группу препаратов «Антигипоксанты и антиоксиданты».
          </p>
          <p>
            Данное соединение обладает выраженными антиоксидантными свойствами, оказывает комплексное
            оздоравливающее влияние на организм. Его признали важнейшим Р-витамином. Антиоксидантная
            сила в 10–25 раз выше, чем у витамина C.
          </p>
          <p>
            Также подходит людям, проходящим реабилитационный период после болезни, часто сталкивающимся
            с повышенными умственными и физическими нагрузками.
          </p>
        </div>
      </div>
    </div>
  </section>
);
