import { useState } from "react";
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
import { FloatingCall } from "@/components/landing/FloatingCall";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  const handleOrder = (productId: string, quantity: number) => {
    setSelectedProduct(productId);
    setSelectedQuantity(quantity);
    setTimeout(() => {
      document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
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
        <Catalog onOrder={handleOrder} />
        <FAQ />
        <OrderForm productId={selectedProduct} quantity={selectedQuantity} />
      </main>
      <Footer />
      <FloatingCall />
    </div>
  );
};

export default Index;
