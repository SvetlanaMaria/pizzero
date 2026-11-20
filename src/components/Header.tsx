import {ShoppingBag} from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

export function Header({cartCount, onOpenCart}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#F8F7F4]/95 backdrop-blur-sm border-b border-[#E5E2DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <a
          href="#inicio"
          className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#18181B] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C83E2B] rounded-sm"
        >
          Forno Vivo
        </a>

        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#52525B]"
        >
          <a
            href="#configurador"
            className="hover:text-[#18181B] hover:underline underline-offset-4 decoration-[#C83E2B] transition-colors whitespace-nowrap shrink-0"
          >
            Configurador
          </a>
          <a
            href="#recetas"
            className="hover:text-[#18181B] hover:underline underline-offset-4 decoration-[#C83E2B] transition-colors whitespace-nowrap shrink-0"
          >
            Recetas de Autor
          </a>
          <a
            href="#artesania"
            className="hover:text-[#18181B] hover:underline underline-offset-4 decoration-[#C83E2B] transition-colors whitespace-nowrap shrink-0"
          >
            Masa y Horno
          </a>
          <a
            href="#mis-pizzas"
            className="hover:text-[#18181B] hover:underline underline-offset-4 decoration-[#C83E2B] transition-colors whitespace-nowrap shrink-0"
          >
            Mis Pizzas
          </a>
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#18181B] text-white text-sm font-medium hover:bg-[#27272A] active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C83E2B] focus-visible:ring-offset-2"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>Pedido</span>
            <span className="font-mono tabular-nums text-xs bg-white/15 px-1.5 py-0.5 rounded">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
