import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Effects } from "@/components/landing/Effects";
import { Compare } from "@/components/landing/Compare";
import { Science } from "@/components/landing/Science";
import { Production } from "@/components/landing/Production";
import { Reviews } from "@/components/landing/Reviews";
import { Catalog } from "@/components/landing/Catalog";
import { FAQ } from "@/components/landing/FAQ";
import { OrderForm } from "@/components/landing/OrderForm";
import { Footer } from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <Hero />
      <About />
      <Effects />
      <Compare />
      <Science />
      <Production />
      <Reviews />
      <Catalog />
      <FAQ />
      <OrderForm />
    </main>
    <Footer />
  </div>
);

export default Index;
