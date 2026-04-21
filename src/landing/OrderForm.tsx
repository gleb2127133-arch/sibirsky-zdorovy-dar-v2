import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Gift, Truck, Phone, ArrowRight } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(80),
  phone: z.string().trim().min(10, "Укажите телефон").max(20),
  comment: z.string().trim().max(500).optional(),
});

export const OrderForm = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    setTimeout(() => {
      setLoading(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Заявка принята! Перезвоним в течение 5 минут.");
    }, 800);
  };

  return (
    <section id="order" className="bg-primary py-20 text-primary-foreground lg:py-28">
      <div className="container-narrow grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            <span className="inline-block h-px w-8 bg-white/50" />
            Оформление заказа
          </span>
          <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
            Оставьте заявку —<br /> перезвоним за 5 минут
          </h2>
          <p className="mt-5 max-w-md text-primary-foreground/85">
            Менеджер уточнит детали, рассчитает доставку и ответит на любые вопросы.
            Оплата при получении или онлайн — на ваш выбор.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              { icon: Gift, t: "3 по цене 2", d: "При заказе трёх упаковок третья — в подарок" },
              { icon: Truck, t: "Бесплатная доставка", d: "От 2 000 ₽ по всей России" },
              { icon: Phone, t: "Перезвон за 5 минут", d: "С 9:00 до 21:00 МСК ежедневно" },
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

        <form onSubmit={onSubmit} className="rounded-3xl bg-white p-7 text-foreground shadow-lg sm:p-9">
          <div className="space-y-4">
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
            <div>
              <label htmlFor="comment" className="mb-1.5 block text-sm font-medium">
                Комментарий <span className="text-muted-foreground">(необязательно)</span>
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={3}
                maxLength={500}
                placeholder="Какие упаковки интересуют, удобное время звонка..."
                className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full py-4 text-base disabled:opacity-60">
            {loading ? "Отправляем..." : (<>Получить консультацию <ArrowRight className="h-4 w-4" strokeWidth={2.5} /></>)}
          </button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных
          </p>
        </form>
      </div>
    </section>
  );
};
