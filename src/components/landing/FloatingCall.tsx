import { Phone } from "lucide-react";

export const FloatingCall = () => (
  <a
    href="tel:89501144175"
    className="fixed bottom-6 right-5 z-50 flex items-center gap-2.5 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform active:scale-95 md:hidden"
    aria-label="Позвонить"
  >
    <Phone className="h-4 w-4" strokeWidth={2.5} />
    Позвонить
  </a>
);
