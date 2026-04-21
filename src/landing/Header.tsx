import { Leaf, Menu, X } from "lucide-react";
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
        <a href="#top" className="flex items-center gap-2.5 text-lg font-bold text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft">
            <Leaf className="h-5 w-5 text-primary" strokeWidth={2.2} />
          </span>
          <span className="font-serif">ТайгаФлав</span>
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
