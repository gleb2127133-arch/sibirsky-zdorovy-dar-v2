import { Leaf, Send, MessageCircle, Phone } from "lucide-react";

const VkIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm2.18 13.27h-1.56c-.59 0-.77-.47-1.83-1.54--.92-.9-1.32-.9-1.32s-.16 0-.16.76v1.4c0 .54-.17.76-1.62.76-2.4 0-5.06-1.45-6.93-4.16C1.83 9.38 1.36 7.3 1.36 7.3s0-.16.76-.16h1.57c.57 0 .78.25 1 .93.97 2.87 2.6 5.38 3.27 5.38.25 0 .37-.12.37-.76V9.96c-.08-1.36-.8-1.48-.8-1.98 0-.27.22-.54.57-.54h2.46c.48 0 .65.25.65.8v4.31c0 .48.22.65.35.65.25 0 .47-.17.94-.65 1.46-1.63 2.5-4.13 2.5-4.13.14-.3.38-.57.97-.57h1.56c.47 0 .58.25.47.54-.22.98-2.33 4-2.33 4-.19.3-.25.44 0 .77.18.25.78.77 1.18 1.23.73.83 1.29 1.53 1.44 2.02.13.47-.12.71-.6.71z"/>
  </svg>
);

export const Footer = () => (
  <footer className="border-t border-border bg-secondary/30 py-14">
    <div className="container-narrow grid gap-10 md:grid-cols-2">
      <div>
        <a href="#top" className="flex items-center gap-2.5 text-lg font-bold text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft">
            <Leaf className="h-5 w-5 text-primary" strokeWidth={2.2} />
          </span>
          <span className="font-serif">ТайгаФлав</span>
        </a>
        <p className="mt-4 max-w-xs text-sm text-muted-foreground">
          Натуральный дигидрокверцетин из сибирской лиственницы. Производство — Иркутская область.
        </p>
        <div className="mt-5 flex gap-3">
          <a
            href="#"
            aria-label="ВКонтакте"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-white text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <VkIcon />
          </a>
          <a
            href="#"
            aria-label="Telegram"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-white text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Send className="h-4 w-4" strokeWidth={2.2} />
          </a>
        </div>
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
              <Send className="h-4 w-4 text-primary" strokeWidth={2.2} /> Telegram-канал
            </a>
          </li>
        </ul>
      </div>

    </div>

    <div className="container-narrow mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
      © {new Date().getFullYear()} ТайгаФлав. Не является лекарственным средством.
      Перед применением проконсультируйтесь со специалистом.
    </div>
  </footer>
);
