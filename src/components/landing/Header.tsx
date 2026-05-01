import { Menu, X, Phone, MessageCircle } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { useState } from "react";

const links = [
  { href: "#about", label: "О продукте" },
  { href: "#effects", label: "Эффекты" },
  { href: "#science", label: "Наука" },
  { href: "#catalog", label: "Каталог" },
  { href: "#faq", label: "FAQ" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="container-narrow flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2 text-lg font-bold text-foreground">
          <img src={logoImg} alt="АктивПлюс" className="h-10 w-10 object-contain" />
          <span className="font-serif">АктивПлюс</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => window.dispatchEvent(new Event("open-chat"))}
            className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary-soft px-3.5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.2} />
            ИИ-консультант
          </button>
          <a
            href="tel:89501144175"
            className="flex items-center gap-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft">
              <Phone className="h-4 w-4 text-primary" strokeWidth={2.5} />
            </span>
            8 (950) 114-41-75
          </a>
        </div>
        <a href="#order" className="btn-primary hidden md:inline-flex">
          Заказать
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-foreground hover:bg-muted md:hidden"
          aria-label="Меню"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white md:hidden">
          <div className="container-narrow flex flex-col gap-1 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted"
              >
                {l.label}
              </a>
            ))}
            <a href="#order" onClick={() => setOpen(false)} className="btn-primary mt-2">
              Заказать
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
