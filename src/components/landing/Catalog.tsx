import jar10 from "@/assets/jar-10g.png";
import jar20 from "@/assets/jar-20g.png";
import jar30 from "@/assets/jar-30g.png";
import { ArrowRight } from "lucide-react";

type CatalogProps = { onOrder: (productId: string) => void };

type Product = {
  id: string;
  img: string;
  title: string;
  subtitle: string;
  duration: string;
  price: number;
  oldPrice?: number;
  badge?: string;
};

const products: Product[] = [
  { id: "10", img: jar10, title: "D-Quercetin 10 г", subtitle: "259 ₽ за грамм", duration: "Хватит на ~30 дней", price: 2590, oldPrice: 3200 },
  { id: "20", img: jar20, title: "D-Quercetin 20 г", subtitle: "199,50 ₽ за грамм", duration: "Хватит на ~60 дней", price: 3990, oldPrice: 5160, badge: "Выгодно" },
  { id: "30", img: jar30, title: "D-Quercetin 30 г", subtitle: "166,30 ₽ за грамм", duration: "Хватит на ~90 дней", price: 4990, oldPrice: 7740, badge: "Лучшая цена" },
];

const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₽";

export const Catalog = ({ onOrder }: CatalogProps) => (
  <section id="catalog" className="bg-white py-20 lg:py-28">
    <div className="container-narrow">
      <div className="max-w-2xl">
        <span className="eyebrow">Каталог</span>
        <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
          Выберите граммовку на ваш вкус
        </h2>
        <p className="mt-4 text-muted-foreground">
          Чем больше объём — тем выгоднее цена за грамм. Доставка по РФ от 2 дней.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <article
            key={p.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
          >
            <div className="relative aspect-square overflow-hidden bg-white">
              <img
                src={p.img}
                alt={p.title}
                width={800}
                height={800}
                loading="lazy"
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              {p.badge && (
                <span className="absolute left-2 top-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                  {p.badge}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-serif text-lg leading-snug">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.subtitle}</p>
              <p className="mt-1.5 text-sm font-medium text-primary">{p.duration}</p>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-foreground">{fmt(p.price)}</span>
                {p.oldPrice && (
                  <span className="text-base text-muted-foreground line-through">{fmt(p.oldPrice)}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => onOrder(p.id)}
                className="btn-primary mt-5 w-full"
              >
                Заказать
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
