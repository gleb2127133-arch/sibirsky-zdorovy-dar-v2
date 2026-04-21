import jars from "@/assets/jars-real.jpg";
import pouch from "@/assets/pouch-real.jpg";
import kit from "@/assets/kit-real.jpg";
import label from "@/assets/label-real.jpg";
import { ArrowRight } from "lucide-react";

type Product = {
  id: string;
  img: string;
  title: string;
  subtitle: string;
  price: number;
  oldPrice?: number;
  badge?: string;
};

const products: Product[] = [
  { id: "30", img: jars, title: "Дигидрокверцетин 30 г", subtitle: "Премиум баночка · курс на 30 дней", price: 1490, badge: "Хит" },
  { id: "60", img: kit, title: "Комплект 2 × 30 г", subtitle: "Курс 60 дней + мерная ложка", price: 2690, oldPrice: 2980 },
  { id: "pwd", img: pouch, title: "Travel 5 г", subtitle: "Дигидрокверцетин 92% — в дорогу", price: 690 },
  { id: "fam", img: label, title: "Семейный набор 3 × 30 г", subtitle: "3 по цене 2 — экономия 1 490 ₽", price: 2980, oldPrice: 4470, badge: "−33%" },
];

const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₽";

export const Catalog = () => (
  <section id="catalog" className="bg-white py-20 lg:py-28">
    <div className="container-narrow">
      <div className="max-w-2xl">
        <span className="eyebrow">Каталог</span>
        <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
          Выберите упаковку под ваш курс
        </h2>
        <p className="mt-4 text-muted-foreground">
          При заказе 3 упаковок — третья в подарок. Доставка от 2 000 ₽ — бесплатно.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <article
            key={p.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
          >
            <div className="relative aspect-square overflow-hidden bg-secondary/40">
              <img
                src={p.img}
                alt={p.title}
                width={800}
                height={800}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {p.badge && (
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                  {p.badge}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-serif text-lg leading-snug">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.subtitle}</p>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{fmt(p.price)}</span>
                {p.oldPrice && (
                  <span className="text-sm text-muted-foreground line-through">{fmt(p.oldPrice)}</span>
                )}
              </div>
              <a href={`#order?p=${p.id}`} className="btn-primary mt-5 w-full">
                Заказать
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
