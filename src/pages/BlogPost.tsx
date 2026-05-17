import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ChatWidget } from "@/components/landing/ChatWidget";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";

type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  date: string;
  readTime: number;
  content: string;
  keywords: string[];
};

const CATEGORY_COLORS: Record<string, string> = {
  sport:   "bg-blue-100 text-blue-700",
  science: "bg-violet-100 text-violet-700",
  health:  "bg-emerald-100 text-emerald-700",
  news:    "bg-amber-100 text-amber-700",
  stories: "bg-rose-100 text-rose-700",
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/blog/${slug}`)
      .then(r => { if (!r.ok) throw new Error("not found"); return r.json(); })
      .then(d => { setArticle(d); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} — АктивПлюс`;
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", article.description);
    }
  }, [article]);

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-narrow py-20">
        <div className="animate-pulse space-y-4 max-w-3xl">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
      <Footer />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-narrow py-20 text-center">
        <h1 className="font-serif text-3xl">Статья не найдена</h1>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Вернуться в блог
        </Link>
      </div>
      <Footer />
    </div>
  );

  if (!article) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Breadcrumb + meta */}
        <section className="bg-primary/5 py-10 lg:py-14">
          <div className="container-narrow max-w-3xl">
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Все статьи
            </Link>
            <div className="mt-4 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${CATEGORY_COLORS[article.category] ?? "bg-muted text-muted-foreground"}`}>
                {article.categoryLabel}
              </span>
            </div>
            <h1 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.5rem]">
              {article.title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">{article.description}</p>
            <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(article.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {article.readTime} минут чтения
              </span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 lg:py-16">
          <div className="container-narrow max-w-3xl">
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-serif prose-headings:text-foreground
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-foreground/85 prose-p:leading-relaxed
                prose-li:text-foreground/85
                prose-strong:text-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-xl prose-blockquote:py-1"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Keywords */}
            {article.keywords?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
                <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                {article.keywords.map(k => (
                  <span key={k} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{k}</span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="mt-10 rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center">
              <h3 className="font-serif text-2xl">Хотите попробовать дигидрокверцетин?</h3>
              <p className="mt-2 text-muted-foreground">Чистота 96%+, производство Иркутская область. Доставка по всей России.</p>
              <a href="/#catalog" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md">
                Выбрать объём →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
