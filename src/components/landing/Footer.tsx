import { Leaf, Send, MessageCircle, Phone } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border bg-secondary/30 py-14">
    <div className="container-narrow grid gap-10 md:grid-cols-3">
      <div>
        <a href="#top" className="flex items-center gap-2.5 text-lg font-bold text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft">
            <Leaf className="h-5 w-5 text-primary" strokeWidth={2.2} />
          </span>
          <span className="font-serif">ТайгаФлав</span>
        </a>
        <p className="mt-4 max-w-xs text-sm text-muted-foreground">
          Натуральный дигидрокверцетин из сибирской лиственницы. Сертифицировано в ЕАЭС.
        </p>
      </div>

      <div>
        <h3 className="font-serif text-base font-bold text-foreground">Контакты</h3>
        <ul className="mt-4 space-y-3 text-sm">
          <li>
            <a href="tel:89501144175" className="flex items-center gap-2.5 text-foreground/80 transition-colors hover:text-primary">
              <Phone className="h-4 w-4 text-primary" strokeWidth={2.2} /> 8 (950) 114-41-75
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-2.5 text-foreground/80 transition-colors hover:text-primary">
              <MessageCircle className="h-4 w-4 text-primary" strokeWidth={2.2} /> Макс
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-2.5 text-foreground/80 transition-colors hover:text-primary">
              <Send className="h-4 w-4 text-primary" strokeWidth={2.2} /> Telegram
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-serif text-base font-bold text-foreground">Документы</h3>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li><a href="#" className="transition-colors hover:text-primary">Сертификат ТР ТС</a></li>
          <li><a href="#" className="transition-colors hover:text-primary">Свидетельство СГР</a></li>
          <li><a href="#" className="transition-colors hover:text-primary">Политика конфиденциальности</a></li>
          <li><a href="#" className="transition-colors hover:text-primary">Договор оферты</a></li>
        </ul>
      </div>
    </div>

    <div className="container-narrow mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
      © {new Date().getFullYear()} ТайгаФлав. Не является лекарственным средством.
      Перед применением проконсультируйтесь со специалистом.
    </div>
  </footer>
);
