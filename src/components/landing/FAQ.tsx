import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Как принимать дигидрокверцетин?",
    a: "Принимать 1 раз в день по 1/3 чайной ложки во время еды, запивая водой. Порошок можно также растворить в тёплой воде или добавить в напиток. Курс — 2 месяца, затем перерыв 1 месяц. Точную дозировку лучше согласовать с врачом.",
  },
  {
    q: "Есть ли противопоказания?",
    a: "Индивидуальная непереносимость, беременность и период лактации. Детям до 14 лет — только по назначению врача. Перед применением проконсультируйтесь со специалистом.",
  },
  {
    q: "Совместим ли с лекарствами?",
    a: "ДГК хорошо сочетается с большинством препаратов и усиливает действие витамина C. Если вы принимаете антикоагулянты — обязательно посоветуйтесь с врачом.",
  },
  {
    q: "Через сколько появится эффект?",
    a: "Первые ощущения — лёгкость, бодрость — обычно с 7–10 дня. Накопительные эффекты (давление, сосуды) — со 2–3 недели регулярного приёма.",
  },
  {
    q: "Какой срок годности?",
    a: "24 месяца с даты производства. Хранить в сухом месте при температуре до +25°C.",
  },
  {
    q: "Как доставляете?",
    a: "СДЭК, Почта России, самовывоз из пунктов выдачи. По Москве — курьером в день заказа. От 2 000 ₽ доставка бесплатная.",
  },
];

export const FAQ = () => (
  <section id="faq" className="bg-white py-20 lg:py-28">
    <div className="container-narrow grid gap-12 lg:grid-cols-[1fr_1.6fr]">
      <div>
        <span className="eyebrow">Вопросы и ответы</span>
        <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
          Частые вопросы
        </h2>
        <p className="mt-4 text-muted-foreground">
          Не нашли ответ? Напишите в чат или оставьте заявку — перезвоним за 15 минут.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-border">
            <AccordionTrigger className="py-5 text-left font-serif text-lg hover:no-underline hover:text-primary">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-base leading-relaxed text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
