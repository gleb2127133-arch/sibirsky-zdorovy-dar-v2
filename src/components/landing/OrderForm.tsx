import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Gift, Truck, Phone, ArrowRight, Check, ShieldCheck } from "lucide-react";

const PRODUCTS = [
  { id: "10", label: "10 г", price: "2 590 ₽" },
  { id: "20", label: "20 г", price: "3 990 ₽", badge: "Выгодно" },
  { id: "30", label: "30 г", price: "4 990 ₽", badge: "Лучшая" },
] as const;

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

export const OrderForm = ({ productId }: { productId?: string | null }) => {
  const [product, setProduct] = useState(productId ?? "20");
  const [contact, setContact] = useState<ContactMethod>("phone");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) setProduct(productId);
  }, [productId]);

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
    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, product, contact }),
      });
      if (res.ok) {
        (e.target as HTMLFormElement).reset();
        setContact("phone");
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
              { icon: Gift, t: "3 по цене 2", d: "При заказе трёх упаковок третья — в подарок" },
              { icon: Truck, t: "Бесплатная доставка", d: "От 2 000 ₽ по всей России" },
              { icon: Phone, t: "Связь за 15 минут", d: "С 9:00 до 21:00 МСК ежедневно" },
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
        <form
          onSubmit={onSubmit}
          className="rounded-3xl bg-white p-7 text-foreground shadow-lg sm:p-9"
        >
          {/* Product selector */}
          <div className="mb-5">
            <p className="mb-2.5 text-sm font-medium">Выберите упаковку</p>
            <div className="grid grid-cols-3 gap-2">
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProduct(p.id)}
                  className={`relative flex flex-col items-center rounded-xl border-2 px-2 py-3 text-center transition-all ${
                    product === p.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-white text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {"badge" in p && p.badge && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                      {p.badge}
                    </span>
                  )}
                  {product === p.id && (
                    <Check
                      className="absolute right-2 top-2 h-3.5 w-3.5 text-primary"
                      strokeWidth={3}
                    />
                  )}
                  <span className="text-sm font-bold text-foreground">{p.label}</span>
                  <span className="mt-0.5 text-xs text-muted-foreground">{p.price}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                Ваше имя
              </label>
              <input
                id="name"
                name="name"
                required
                maxLength={80}
                placeholder="Как к вам обращаться"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                Телефон
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                maxLength={20}
                placeholder="+7 (___) ___-__-__"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Contact method */}
            <div>
              <p className="mb-2.5 text-sm font-medium">Как удобнее связаться</p>
              <div className="flex gap-2">
                {CONTACTS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setContact(c.value)}
                    className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all ${
                      contact === c.value
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="mb-1.5 block text-sm font-medium">
                Комментарий{" "}
                <span className="text-muted-foreground">(необязательно)</span>
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={2}
                maxLength={500}
                placeholder="Удобное время, вопросы по заказу..."
                className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-6 w-full py-4 text-base disabled:opacity-60"
          >
            {loading ? (
              "Отправляем..."
            ) : (
              <>
                Оставить заявку{" "}
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </>
            )}
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
