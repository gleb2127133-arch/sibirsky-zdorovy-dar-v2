import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Effects } from "@/components/landing/Effects";
import { Compare } from "@/components/landing/Compare";
import { CourseTimeline } from "@/components/landing/CourseTimeline";
import { Science } from "@/components/landing/Science";
import { Production } from "@/components/landing/Production";
import { Reviews } from "@/components/landing/Reviews";
import { Catalog, type CartItem } from "@/components/landing/Catalog";
import { FAQ } from "@/components/landing/FAQ";
import { OrderForm } from "@/components/landing/OrderForm";
import { Footer } from "@/components/landing/Footer";
import { FloatingCall } from "@/components/landing/FloatingCall";
import { FloatingCart } from "@/components/landing/FloatingCart";
import { ChatWidget } from "@/components/landing/ChatWidget";

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (id: string, qty: number) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === id);
      if (exists) return prev.map((item) => item.id === id ? { ...item, qty } : item);
      return [...prev, { id, qty }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
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
        <CourseTimeline />
        <Compare />
        <Science />
        <Production />
        <Reviews />
        <Catalog
          cart={cart}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onClearCart={() => setCart([])}
          onCheckout={handleCheckout}
        />
        <FAQ />
        <OrderForm
          cart={cart}
          onRemoveFromCart={removeFromCart}
          onClearCart={() => setCart([])}
        />
      </main>
      <Footer />
      <FloatingCall />
      <FloatingCart cart={cart} />
      <ChatWidget />
    </div>
  );
};

export default Index;
