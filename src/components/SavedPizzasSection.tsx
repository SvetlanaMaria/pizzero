import {Bookmark, ShoppingBag, SlidersHorizontal, Trash2} from 'lucide-react';
import {
  PizzaConfig,
  SavedPizza,
  calculatePizzaMetrics,
  describePizzaSummary,
  formatEuro,
} from '../data/pizzaData';

interface SavedPizzasSectionProps {
  savedPizzas: SavedPizza[];
  onLoadSaved: (config: PizzaConfig) => void;
  onAddSavedToCart: (config: PizzaConfig, name: string) => void;
  onDeleteSaved: (id: string) => void;
}

export function SavedPizzasSection({
  savedPizzas,
  onLoadSaved,
  onAddSavedToCart,
  onDeleteSaved,
}: SavedPizzasSectionProps) {
  return (
    <section id="mis-pizzas" className="py-16 sm:py-20 border-t border-[#E5E2DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-[#C83E2B] mb-2">
              Recetario personal
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#18181B]">
              Mis creaciones guardadas
            </h2>
            <p className="text-base text-[#52525B] mt-2">
              Guarda tus combinaciones favoritas en este dispositivo para
              recuperarlas o pedirlas en un clic.
            </p>
          </div>
        </div>

        {savedPizzas.length === 0 ? (
          <div className="bg-white border border-dashed border-[#D4D4D8] rounded-2xl p-10 text-center">
            <Bookmark
              className="w-8 h-8 text-[#A1A1AA] mx-auto mb-3"
              aria-hidden="true"
            />
            <p className="text-base font-medium text-[#18181B]">
              Todavía no has guardado ninguna pizza propia
            </p>
            <p className="text-sm text-[#71717A] mt-1 max-w-md mx-auto">
              Diseña tu pizza ideal en el configurador y pulsa el botón «Guardar»
              para conservar su receta y valores nutricionales aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedPizzas.map((item) => {
              const m = calculatePizzaMetrics(item.config);
              const summary = describePizzaSummary(item.config);
              return (
                <article
                  key={item.id}
                  className="bg-white border border-[#E5E2DC] rounded-2xl p-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-[#71717A]">{item.createdAt}</p>
                        <h3 className="font-display text-xl font-semibold text-[#18181B] mt-0.5">
                          {item.name}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteSaved(item.id)}
                        aria-label={`Eliminar ${item.name}`}
                        className="p-1.5 rounded-lg text-[#71717A] hover:text-[#C83E2B] hover:bg-[#F3F1EC] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="text-sm text-[#52525B] mt-2 leading-relaxed">
                      {summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E5E2DC] space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                      <span className="text-[#71717A]">
                        {m.calories} kcal · {m.dietaryLabel}
                      </span>
                      <span className="text-sm font-semibold text-[#18181B]">
                        {formatEuro(m.price)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onLoadSaved(item.config)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#E5E2DC] bg-white hover:bg-[#F8F7F4] text-xs font-medium text-[#18181B] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Cargar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddSavedToCart(item.config, item.name)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-xs font-medium text-white transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Al pedido</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
