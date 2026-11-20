import {SlidersHorizontal, ShoppingBag} from 'lucide-react';
import {
  PizzaConfig,
  SIGNATURE_PRESETS,
  calculatePizzaMetrics,
  formatEuro,
} from '../data/pizzaData';

interface PresetsSectionProps {
  onLoadPreset: (config: PizzaConfig, name: string) => void;
  onAddPresetToCart: (config: PizzaConfig, name: string) => void;
}

export function PresetsSection({
  onLoadPreset,
  onAddPresetToCart,
}: PresetsSectionProps) {
  return (
    <section id="recetas" className="py-16 sm:py-20 border-t border-[#E5E2DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-medium tracking-wide text-[#C83E2B] mb-2">
            Selección del maestro pizzero
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#18181B] [text-wrap:balance]">
            Recetas de autor listas para personalizar
          </h2>
          <p className="text-base text-[#52525B] mt-3 leading-relaxed">
            Carga cualquiera de nuestras combinaciones insignia directamente en el
            configurador para ajustar la masa, intercambiar quesos o consultar su
            perfil nutricional al detalle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SIGNATURE_PRESETS.map((preset) => {
            const m = calculatePizzaMetrics(preset.config);
            return (
              <article
                key={preset.id}
                className="group bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-[#EFECE6] overflow-hidden">
                  <img
                    src={preset.image}
                    alt={`Pizza artesanal ${preset.name}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="sr-only">{preset.name}</div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#71717A]">{preset.kicker}</p>
                    <h3 className="font-display text-xl font-semibold text-[#18181B] mt-1">
                      {preset.name}
                    </h3>
                    <p className="text-sm text-[#52525B] mt-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E5E2DC] space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                      <span className="text-[#71717A]">
                        {m.calories} kcal · {m.weightGrams} g
                      </span>
                      <span className="text-sm font-semibold text-[#18181B]">
                        {formatEuro(m.price)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onLoadPreset(preset.config, preset.name)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#E5E2DC] bg-white hover:bg-[#F8F7F4] text-xs font-medium text-[#18181B] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Personalizar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddPresetToCart(preset.config, preset.name)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-xs font-medium text-white transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Añadir</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
