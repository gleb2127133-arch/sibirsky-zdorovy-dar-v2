import { ShieldCheck, FileCheck2, Factory, Award } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "ТР ТС 021/2011", text: "Регламент о безопасности пищевой продукции" },
  { icon: FileCheck2, title: "Свидетельство СГР", text: "Государственная регистрация в ЕАЭС" },
  { icon: Award, title: "Декларация соответствия", text: "Подтверждение качества каждой партии" },
  { icon: Factory, title: "Производство в Иркутской области", text: "Сырьё — сибирская лиственница" },
];

export const Production = () => (
  <section className="bg-white py-20 lg:py-28">
    <div className="container-narrow">
      <div>
        <span className="eyebrow">Производство и качество</span>
        <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
          Российское сырьё.<br /> Сертифицировано в ЕАЭС.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Производим в Иркутской области из ядровой древесины сибирской лиственницы.
          Каждая партия проходит проверку на чистоту, тяжёлые металлы и микробиологию.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-white p-5 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <h3 className="mt-4 font-serif text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
