import { ShoppingCart } from "lucide-react";
import { type CartItem } from "@/components/landing/Catalog";

type Props = { cart: CartItem[] };

export const FloatingCart = ({ cart }: Props) => {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleClick = () => {
    const target = totalQty > 0 ? "order" : "catalog";
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Корзина"
      className="fixed bottom-24 right-5 z-50 flex flex-col items-center gap-1 md:bottom-8 md:right-6"
    >
      <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-lg border border-border transition-transform hover:scale-105 active:scale-95">
        <ShoppingCart className="h-6 w-6 text-primary" strokeWidth={2.2} />
        {totalQty > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shadow">
            {totalQty}
          </span>
        )}
      </div>
      <span className="text-[10px] font-semibold text-muted-foreground">Корзина</span>
    </button>
  );
};
