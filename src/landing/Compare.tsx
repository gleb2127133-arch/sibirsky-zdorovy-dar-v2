import { Check, Minus } from "lucide-react";

const rows = [
  { name: "Антиоксидантная сила", values: [true, "средняя", "средняя", "слабая"] },
  { name: "Биодоступность", values: ["до 96%", "20–40%", "30%", "высокая"] },
  { name: "Защита капилляров", values: [true, true, false, false] },
  { name: "Натуральное происхождение", values: ["лиственница", "лук, яблоки", "виноград", "цитрусовые"] },
  { name: "Накопительный эффект", values: [true, false, true, false] },
];

const Cell = ({ v }: { v: boolean | string }) => {
  if (v === true) return <Check className="mx-auto h-5 w-5 text-primary" aria-label="Да" />;
  if (v === false) return <Minus className="mx-auto h-5 w-5 text-muted-foreground/50" aria-label="Нет" />;
  return <span className="text-sm text-foreground/80">{v}</span>;
};

export const Compare = () => (
  <section className="bg-white py-20 lg:py-28">
    <div className="container-narrow">
      <div className="max-w-2xl">
        <span className="eyebrow">Сравнение</span>
        <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
          ДГК против других антиоксидантов
        </h2>
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-5 py-4 text-sm font-semibold text-foreground">Параметр</th>
              <th className="px-5 py-4 text-center text-sm font-semibold text-primary">Дигидрокверцетин</th>
              <th className="px-5 py-4 text-center text-sm font-semibold text-foreground/70">Кверцетин</th>
              <th className="px-5 py-4 text-center text-sm font-semibold text-foreground/70">Ресвератрол</th>
              <th className="px-5 py-4 text-center text-sm font-semibold text-foreground/70">Витамин C</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name} className={i % 2 ? "bg-background" : "bg-card"}>
                <td className="px-5 py-4 text-sm font-medium">{r.name}</td>
                {r.values.map((v, idx) => (
                  <td
                    key={idx}
                    className={`px-5 py-4 text-center ${idx === 0 ? "bg-primary-soft/40" : ""}`}
                  >
                    <Cell v={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);
