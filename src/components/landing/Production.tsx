import { Factory } from "lucide-react";
import tempImg from "@/assets/hero-3jars.jpg";

export const Production = () => (
  <section className="bg-white py-20 lg:py-28">
    <div className="container-narrow grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">

      {/* Фото */}
      <div className="overflow-hidden rounded-3xl border border-border shadow-sm">
        <img
          src={tempImg}
          alt="Производство дигидрокверцетина"
          width={1280}
          height={960}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Текст + сертификаты */}
      <div>
        <span className="eyebrow">Производство и качество</span>
        <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
          Российское сырьё.<br /> Сибирская лиственница.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Производим в Иркутской области из ядровой древесины сибирской лиственницы.
          Каждая партия проходит проверку на чистоту, тяжёлые металлы и микробиологию.
        </p>

        <div className="mt-8">
          <div className="rounded-2xl border border-border bg-white p-5 transition-all hover:border-primary/30 hover:shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
              <Factory className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <h3 className="mt-4 font-serif text-base font-semibold">Производство в Иркутской области</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">Сырьё — сибирская лиственница</p>
          </div>
        </div>
      </div>

    </div>
  </section>
);
