import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ChatWidget } from "@/components/landing/ChatWidget";
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";

type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  date: string;
  readTime: number;
};

const CATEGORY_COLORS: Record<string, string> = {
  sport:   "bg-blue-100 text-blue-700",
  science: "bg-violet-100 text-violet-700",
  health:  "bg-emerald-100 text-emerald-700",
  news:    "bg-amber-100 text-amber-700",
  stories: "bg-rose-100 text-rose-700",
};

export default function Blog() {
  const [articles, setArticles] = useState<ArticleMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Блог о дигидрокверцетине — АктивПлюс";
    fetch("/api/blog")
      .then(r => r.json())
      .then(d => { setArticles(d.articles || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-primary/5 py-16 lg:py-20">
          <div className="container-narrow">
            <span className="eyebrow">Экспертный блог</span>
            <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl lg:text-[3rem]">
              Всё о дигидрокверцетине
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Научные статьи, советы по применению, спорт и здоровье — актуальные материалы о природном антиоксиданте из сибирской лиственницы.
            </p>
          </div>
        </section>

        {/* Articles */}
        <section className="py-16 lg:py-20">
          <div className="container-narrow">
            {loading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl border border-border bg-white p-6 h-64" />
                ))}
              </div>
            )}

            {!loading && articles.length === 0 && (
              <div className="py-20 text-center text-muted-foreground">
                <p className="text-lg">Статьи скоро появятся — заходите завтра.</p>
              </div>
            )}

            {!loading && articles.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((a, i) => (
                  <Link
                    key={a.slug}
                    to={`/blog/${a.slug}`}
                    className={`group flex flex-col rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary/40 hover:shadow-lg ${i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${CATEGORY_COLORS[a.category] ?? "bg-muted text-muted-foreground"}`}>
                        {a.categoryLabel}
                      </span>
                    </div>
                    <h2 className="mt-3 flex-1 font-serif text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                      {a.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {a.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(a.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {a.readTime} мин
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
