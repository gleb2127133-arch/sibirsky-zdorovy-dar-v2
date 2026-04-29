import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Truck, Phone, ArrowRight, ShieldCheck, ShoppingCart, X } from "lucide-react";
import { type CartItem, PRODUCTS } from "@/components/landing/Catalog";

const CONTACTS = [
  { value: "phone" as const, label: "Звонок" },
  { value: "max" as const, label: "Макс" },
  { value: "telegram" as const, label: "Telegram" },
];

type ContactMethod = "phone" | "max" | "telegram";

const schema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(80),
  phone: z.string().trim().min(10, "Укажите телефон").max(20),
  comment: z.string().trim().max(500).optional(),
});

const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₽";

type Props = {
  cart: CartItem[];
  onRemoveFromCart: (id: string) => void;
  onClearCart: () => void;
};

export const OrderForm = ({ cart, onRemoveFromCart, onClearCart }: Props) => {
  const [contact, setContact] = useState<ContactMethod>("phone");
  const [loading, setLoading] = useState(false);

  const cartTotal = cart.reduce((sum, item) => {
    const p = PRODUCTS.find((p) => p.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);

  const hasCart = cart.length > 0;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      phone: fd.get("phone"),
      comment: fd.get("comment"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Проверьте поля");
      return;
    }
    if (!hasCart) {
      toast.error("Добавьте хотя бы один товар в корзину");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, cart, contact }),
      });
      if (res.ok) {
        (e.target as HTMLFormElement).reset();
        setContact("phone");
        onClearCart();
        toast.success("Заявка принята! Свяжемся с вами в течение 15 минут.");
      } else {
        toast.error("Ошибка отправки. Позвоните нам напрямую.");
      }
    } catch {
      toast.error("Нет соединения. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="order" className="bg-primary py-20 text-primary-foreground lg:py-28">
      <div className="container-narrow grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* LEFT */}
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            <span className="inline-block h-px w-8 bg-white/50" />
            Оформление заказа
          </span>
          <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
            Оставьте заявку —<br /> свяжемся за 15 минут
          </h2>
          <p className="mt-5 max-w-md text-primary-foreground/85">
            Менеджер подтвердит заказ, уточнит детали и рассчитает доставку.
            Оплата удобным способом — картой, переводом или при получении.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              { icon: Truck, t: "Бесплатная доставка", d: "По Иркутску бесплатно, в другие города от 2 000 ₽" },
              { icon: Phone, t: "Связь за 15 минут", d: "С 07:00 до 17:00 МСК ежедневно" },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/15">
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <div>
                  <div className="font-semibold">{t}</div>
                  <div className="text-sm text-primary-foreground/80">{d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT — form */}
        <form onSubmit={onSubmit} className="rounded-3xl bg-white p-7 text-foreground shadow-lg sm:p-9">

          {/* Корзина или пустое состояние */}
          <div className="mb-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-medium">
                <ShoppingCart className="h-4 w-4 text-primary" strokeWidth={2.2} />
                Ваш заказ
              </p>
              {hasCart && (
                <button type="button" onClick={onClearCart}
                  className="text-xs text-muted-foreground transition-colors hover:text-destructive">
                  Очистить
                </button>
              )}
            </div>

            {hasCart ? (
              <div className="rounded-xl border border-border bg-background p-4">
                <ul className="divide-y divide-border">
                  {cart.map((item) => {
                    const p = PRODUCTS.find((p) => p.id === item.id)!;
                    return (
                      <li key={item.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium">{p.title}</p>
                          <p className="text-xs text-muted-foreground">{item.qty} шт. × {fmt(p.price)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">{fmt(p.price * item.qty)}</span>
                          <button type="button" onClick={() => onRemoveFromCart(item.id)}
                            className="text-muted-foreground transition-colors hover:text-destructive">
                            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-3 border-t border-border pt-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Итого</span>
                  <span className="font-serif text-xl font-semibold text-foreground">{fmt(cartTotal)}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Корзина пуста — выберите товар в каталоге выше
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Ваше имя</label>
              <input id="name" name="name" required maxLength={80} placeholder="Как к вам обращаться"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">Телефон</label>
              <input id="phone" name="phone" type="tel" required maxLength={20} placeholder="+7 (___) ___-__-__"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>

            {/* Contact method */}
            <div>
              <p className="mb-2.5 text-sm font-medium">Как удобнее связаться</p>
              <div className="flex gap-2">
                {CONTACTS.map((c) => (
                  <button key={c.value} type="button" onClick={() => setContact(c.value)}
                    className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all ${
                      contact === c.value
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="mb-1.5 block text-sm font-medium">
                Комментарий <span className="text-muted-foreground">(необязательно)</span>
              </label>
              <textarea id="comment" name="comment" rows={2} maxLength={500}
                placeholder="Удобное время, вопросы по заказу..."
                className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          <button type="submit" disabled={loading || !hasCart}
            className="btn-primary mt-6 w-full py-4 text-base disabled:opacity-60">
            {loading ? "Отправляем..." : (<>Оставить заявку <ArrowRight className="h-4 w-4" strokeWidth={2.5} /></>)}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary-soft px-4 py-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary" strokeWidth={2.2} />
            <p className="text-sm font-medium text-primary">
              Гарантия возврата 30 дней — если не подойдёт, вернём деньги
            </p>
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных
          </p>
        </form>
      </div>
    </section>
  );
};
