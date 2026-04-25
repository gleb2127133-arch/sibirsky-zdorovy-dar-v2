import { useState } from "react";
import jar10 from "@/assets/jar-10g.png";
import jar20 from "@/assets/jar-20g.png";
import jar30 from "@/assets/jar-30g.png";
import { ArrowRight, Minus, Plus, ShoppingCart, X } from "lucide-react";

export type CartItem = { id: string; qty: number };

type CatalogProps = {
  cart: CartItem[];
  onAddToCart: (id: string, qty: number) => void;
  onRemoveFromCart: (id: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
};

export const PRODUCTS = [
  { id: "10", img: jar10, title: "D-Quercetin 10 г", subtitle: "259 ₽ за грамм", duration: "Хватит на ~30 дней", price: 2590, oldPrice: 3200 },
  { id: "20", img: jar20, title: "D-Quercetin 20 г", subtitle: "199,50 ₽ за грамм", duration: "Хватит на ~60 дней", price: 3990, oldPrice: 5160, badge: "Выгодно" },
  { id: "30", img: jar30, title: "D-Quercetin 30 г", subtitle: "166,30 ₽ за грамм", duration: "Хватит на ~90 дней", price: 4990, oldPrice: 7740, badge: "Лучшая цена" },
] as const;

const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₽";

const ProductCard = ({
  p, cartQty, onAddToCart, onRemoveFromCart,
}: {
  p: typeof PRODUCTS[number];
  cartQty: number;
  onAddToCart: (id: string, qty: number) => void;
  onRemoveFromCart: (id: string) => void;
}) => {
  const [qty, setQty] = useState(1);
  const inCart = cartQty > 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-white">
        <img src={p.img} alt={p.title} width={800} height={800} loading="lazy"
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
        {"badge" in p && p.badge && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
            {p.badge}
          </span>
        )}
        {inCart && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white shadow">
            <ShoppingCart className="h-3 w-3" /> {cartQty} шт.
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg leading-snug">{p.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{p.subtitle}</p>
        <p className="mt-1.5 text-sm font-medium text-primary">{p.duration}</p>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-2xl font-bold text-foreground">{fmt(p.price)}</span>
          {"oldPrice" in p && p.oldPrice && (
            <span className="text-base text-muted-foreground line-through">{fmt(p.oldPrice)}</span>
          )}
        </div>

        {/* Счётчик */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border px-1 py-1">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty === 1}
              className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30">
              <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
            <span className="w-5 text-center text-sm font-semibold">{qty}</span>
            <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))} disabled={qty === 10}
              className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30">
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </div>
          <span className="text-sm text-muted-foreground">{fmt(p.price * qty)}</span>
        </div>

        {/* Кнопки */}
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => onAddToCart(p.id, qty)}
            className={`flex-1 ${inCart ? "btn-outline" : "btn-primary"}`}>
            {inCart ? "Обновить" : "В корзину"}
            {!inCart && <ShoppingCart className="h-4 w-4" strokeWidth={2.2} />}
          </button>
          {inCart && (
            <button type="button" onClick={() => onRemoveFromCart(p.id)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive">
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export const Catalog = ({ cart, onAddToCart, onRemoveFromCart, onClearCart, onCheckout }: CatalogProps) => {
  const cartTotal = cart.reduce((sum, item) => {
    const p = PRODUCTS.find((p) => p.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);

  return (
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
          {PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              cartQty={cart.find((c) => c.id === p.id)?.qty ?? 0}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
            />
          ))}
        </div>

        {/* Корзина */}
        {cart.length > 0 && (
          <div className="mt-10 rounded-2xl border-2 border-primary/20 bg-primary-soft p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-serif text-xl text-foreground">
                <ShoppingCart className="h-5 w-5 text-primary" strokeWidth={2.2} />
                Ваша корзина
              </h3>
              <button type="button" onClick={onClearCart}
                className="text-sm text-muted-foreground transition-colors hover:text-destructive">
                Очистить
              </button>
            </div>

            <ul className="mt-4 divide-y divide-primary/10">
              {cart.map((item) => {
                const p = PRODUCTS.find((p) => p.id === item.id)!;
                return (
                  <li key={item.id} className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium text-foreground">{p.title} × {item.qty} шт.</span>
                    <span className="text-sm font-semibold text-foreground">{(p.price * item.qty).toLocaleString("ru-RU")} ₽</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex flex-col gap-4 border-t border-primary/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Итого к оплате</p>
                <p className="font-serif text-2xl font-semibold text-foreground">{cartTotal.toLocaleString("ru-RU")} ₽</p>
              </div>
              <button type="button" onClick={onCheckout} className="btn-primary px-8 py-3.5 text-base">
                Оформить заказ
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
