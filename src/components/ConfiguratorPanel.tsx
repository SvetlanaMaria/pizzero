import {useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {Check, ChevronLeft, ChevronRight, Minus, Plus} from 'lucide-react';
import {
  BAKE_LEVELS,
  BakeId,
  CHEESES,
  CUT_STYLES,
  CheeseId,
  CutId,
  DOUGHS,
  DoughId,
  PizzaConfig,
  SAUCES,
  SIZES,
  SauceId,
  SizeId,
  TOPPINGS,
  ToppingCategory,
  formatEuro,
} from '../data/pizzaData';

interface ConfiguratorPanelProps {
  config: PizzaConfig;
  onChangeSize: (sizeId: SizeId) => void;
  onChangeDough: (doughId: DoughId) => void;
  onChangeSauce: (sauceId: SauceId) => void;
  onToggleCheese: (cheeseId: CheeseId) => void;
  onToggleTopping: (toppingId: string) => void;
  onToggleDoubleTopping: (toppingId: string) => void;
  onChangeBake: (bakeId: BakeId) => void;
  onChangeCut: (cutId: CutId) => void;
}

type StepKey = 'masa' | 'salsa' | 'quesos' | 'ingredientes' | 'horno';

const STEPS: {key: StepKey; label: string; shortLabel: string}[] = [
  {key: 'masa', label: '01. Tamaño y Masa', shortLabel: '01. Masa'},
  {key: 'salsa', label: '02. Base de Salsa', shortLabel: '02. Salsa'},
  {key: 'quesos', label: '03. Quesos', shortLabel: '03. Quesos'},
  {key: 'ingredientes', label: '04. Ingredientes', shortLabel: '04. Extras'},
  {key: 'horno', label: '05. Horno y Corte', shortLabel: '05. Horno'},
];

export function ConfiguratorPanel({
  config,
  onChangeSize,
  onChangeDough,
  onChangeSauce,
  onToggleCheese,
  onToggleTopping,
  onToggleDoubleTopping,
  onChangeBake,
  onChangeCut,
}: ConfiguratorPanelProps) {
  const [activeStep, setActiveStep] = useState<StepKey>('masa');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ToppingCategory>('all');
  const [onlyVegetarian, setOnlyVegetarian] = useState(false);

  const currentStepIndex = STEPS.findIndex((s) => s.key === activeStep);
  const currentSize = SIZES.find((s) => s.id === config.sizeId) ?? SIZES[1];

  const filteredToppings = TOPPINGS.filter((t) => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (onlyVegetarian && !t.vegetarian) return false;
    return true;
  });

  const goToStep = (delta: number) => {
    const next = currentStepIndex + delta;
    if (next >= 0 && next < STEPS.length) {
      setActiveStep(STEPS[next].key);
    }
  };

  return (
    <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 sm:p-7 shadow-sm">
      {/* Step Navigation Bar */}
      <div
        role="tablist"
        aria-label="Pasos de configuración"
        className="flex items-center gap-1.5 overflow-x-auto pb-3 border-b border-[#E5E2DC]"
      >
        {STEPS.map((step) => {
          const isActive = step.key === activeStep;
          return (
            <button
              key={step.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveStep(step.key)}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#18181B] text-white'
                  : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#F3F1EC]'
              }`}
            >
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="mt-6 min-h-[420px]">
        <AnimatePresence mode="wait">
          {activeStep === 'masa' && (
            <motion.div
              key="masa"
              initial={{opacity: 0, y: 6}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -6}}
              transition={{duration: 0.16}}
              className="space-y-7"
            >
              {/* Size selector */}
              <div>
                <div className="flex items-baseline justify-between gap-4 mb-3">
                  <h3 className="text-base font-semibold text-[#18181B]">
                    Elige el diámetro de tu pizza
                  </h3>
                  <span className="text-xs text-[#71717A]">
                    Escala calorías y peso proporcionalmente
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SIZES.map((size) => {
                    const selected = config.sizeId === size.id;
                    return (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => onChangeSize(size.id)}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                          selected
                            ? 'border-[#C83E2B] bg-[#C83E2B]/[0.04]'
                            : 'border-[#E5E2DC] bg-white hover:border-[#A1A1AA]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-[#18181B]">
                            {size.name}
                          </span>
                          <span className="font-mono tabular-nums text-xs font-medium text-[#18181B]">
                            {size.diameterCm} cm
                          </span>
                        </div>
                        <p className="text-xs text-[#71717A] mt-1">{size.description}</p>
                        <p className="font-mono tabular-nums text-xs font-medium text-[#C83E2B] mt-2">
                          Desde {formatEuro(size.basePrice)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dough selector */}
              <div>
                <div className="flex items-baseline justify-between gap-4 mb-3">
                  <h3 className="text-base font-semibold text-[#18181B]">
                    Selecciona la masa madre
                  </h3>
                  <span className="text-xs text-[#71717A]">
                    Valores calculados para tamaño {currentSize.name}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {DOUGHS.map((dough) => {
                    const selected = config.doughId === dough.id;
                    const scaledKcal = Math.round(dough.calories * currentSize.multiplier);
                    return (
                      <button
                        key={dough.id}
                        type="button"
                        onClick={() => onChangeDough(dough.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                          selected
                            ? 'border-[#C83E2B] bg-[#C83E2B]/[0.04]'
                            : 'border-[#E5E2DC] bg-white hover:border-[#A1A1AA]'
                        }`}
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          <span
                            aria-hidden="true"
                            className="w-7 h-7 rounded-full border border-black/10 shrink-0 mt-0.5"
                            style={{backgroundColor: dough.crustColorBaked}}
                          />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <span className="text-sm font-semibold text-[#18181B]">
                                {dough.name}
                              </span>
                              {dough.glutenFree && (
                                <span className="text-xs font-medium text-[#3F6212]">
                                  · Sin gluten
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#52525B] mt-0.5">{dough.subtitle}</p>
                            <p className="text-xs text-[#71717A] mt-1.5 font-mono tabular-nums">
                              {dough.hydration}% hidratación · {dough.fermentationHours} h fermentación · {scaledKcal} kcal
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                          <span className="font-mono tabular-nums text-xs font-semibold text-[#18181B]">
                            {dough.priceDelta === 0
                              ? 'Incluida'
                              : `+${formatEuro(dough.priceDelta)}`}
                          </span>
                          {selected && (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#C83E2B] text-white">
                              <Check className="w-3 h-3" aria-hidden="true" />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 'salsa' && (
            <motion.div
              key="salsa"
              initial={{opacity: 0, y: 6}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -6}}
              transition={{duration: 0.16}}
              className="space-y-4"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-base font-semibold text-[#18181B]">
                  Base aromática de la pizza
                </h3>
                <span className="text-xs text-[#71717A]">
                  Elaboradas cada mañana en el obrador
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAUCES.map((sauce) => {
                  const selected = config.sauceId === sauce.id;
                  const scaledKcal = Math.round(sauce.calories * currentSize.multiplier);
                  return (
                    <button
                      key={sauce.id}
                      type="button"
                      onClick={() => onChangeSauce(sauce.id)}
                      className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                        selected
                          ? 'border-[#C83E2B] bg-[#C83E2B]/[0.04]'
                          : 'border-[#E5E2DC] bg-white hover:border-[#A1A1AA]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="w-7 h-7 rounded-full border border-black/15 shrink-0 mt-0.5"
                            style={{
                              backgroundColor:
                                sauce.color === 'transparent' ? '#F3E5AB' : sauce.color,
                            }}
                          />
                          <div>
                            <p className="text-sm font-semibold text-[#18181B]">
                              {sauce.name}
                            </p>
                            <p className="text-xs text-[#52525B] mt-0.5">{sauce.origin}</p>
                          </div>
                        </div>

                        {selected && (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#C83E2B] text-white shrink-0">
                            <Check className="w-3 h-3" aria-hidden="true" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E5E2DC]/70 text-xs font-mono tabular-nums">
                        <span className="text-[#71717A]">
                          {scaledKcal} kcal {sauce.vegan ? '· Vegana' : ''}
                        </span>
                        <span className="font-semibold text-[#18181B]">
                          {sauce.price === 0 ? 'Incluida' : `+${formatEuro(sauce.price)}`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeStep === 'quesos' && (
            <motion.div
              key="quesos"
              initial={{opacity: 0, y: 6}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -6}}
              transition={{duration: 0.16}}
              className="space-y-4"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-base font-semibold text-[#18181B]">
                  Combina uno o varios quesos
                </h3>
                <span className="text-xs text-[#71717A]">
                  Puedes dejarla sin queso si lo prefieres
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CHEESES.map((cheese) => {
                  const selected = config.cheeseIds.includes(cheese.id);
                  const scaledKcal = Math.round(cheese.calories * currentSize.multiplier);
                  const price =
                    cheese.price * (config.sizeId === 'familiar' ? 1.25 : 1);
                  return (
                    <button
                      key={cheese.id}
                      type="button"
                      onClick={() => onToggleCheese(cheese.id)}
                      className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                        selected
                          ? 'border-[#C83E2B] bg-[#C83E2B]/[0.04]'
                          : 'border-[#E5E2DC] bg-white hover:border-[#A1A1AA]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="w-7 h-7 rounded-full border border-black/15 shrink-0 mt-0.5"
                            style={{backgroundColor: cheese.color}}
                          />
                          <div>
                            <p className="text-sm font-semibold text-[#18181B]">
                              {cheese.name}
                            </p>
                            <p className="text-xs text-[#52525B] mt-0.5">{cheese.origin}</p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-md border shrink-0 transition-colors ${
                            selected
                              ? 'bg-[#C83E2B] border-[#C83E2B] text-white'
                              : 'border-[#D4D4D8] bg-white text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3" aria-hidden="true" />
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E5E2DC]/70 text-xs font-mono tabular-nums">
                        <span className="text-[#71717A]">
                          {scaledKcal} kcal · {cheese.protein} g prot.
                          {cheese.vegan ? ' · Vegano' : ''}
                        </span>
                        <span className="font-semibold text-[#18181B]">
                          {cheese.price === 0 ? 'Incluido' : `+${formatEuro(price)}`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeStep === 'ingredientes' && (
            <motion.div
              key="ingredientes"
              initial={{opacity: 0, y: 6}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -6}}
              transition={{duration: 0.16}}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-[#18181B]">
                    Ingredientes de temporada
                  </h3>
                  <p className="text-xs text-[#71717A]">
                    Pulsa para añadir o activa ×2 para porción doble
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 text-xs font-medium text-[#52525B] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyVegetarian}
                    onChange={(e) => setOnlyVegetarian(e.target.checked)}
                    className="rounded border-[#D4D4D8] text-[#C83E2B] focus:ring-[#C83E2B]"
                  />
                  <span>Solo opciones vegetarianas</span>
                </label>
              </div>

              {/* Category filter buttons */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F3F1EC] rounded-lg w-fit">
                {(
                  [
                    {id: 'all', label: 'Todos'},
                    {id: 'huerta', label: 'Huerta'},
                    {id: 'carnes', label: 'Curados y Carnes'},
                    {id: 'final', label: 'Toque Final'},
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      categoryFilter === cat.id
                        ? 'bg-white text-[#18181B] shadow-xs'
                        : 'text-[#52525B] hover:text-[#18181B]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredToppings.map((topping) => {
                  const sel = config.toppings.find((t) => t.id === topping.id);
                  const isSelected = Boolean(sel);
                  const isDouble = Boolean(sel?.double);
                  const qtyFactor = isDouble ? 1.8 : 1;
                  const scaledKcal = Math.round(
                    topping.calories * qtyFactor * currentSize.multiplier,
                  );
                  const price =
                    topping.price *
                    qtyFactor *
                    (config.sizeId === 'familiar' ? 1.2 : 1);

                  return (
                    <div
                      key={topping.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                        isSelected
                          ? 'border-[#C83E2B] bg-[#C83E2B]/[0.04]'
                          : 'border-[#E5E2DC] bg-white hover:border-[#A1A1AA]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleTopping(topping.id)}
                          className="flex-1 text-left flex items-start gap-2.5 cursor-pointer"
                        >
                          <span
                            aria-hidden="true"
                            className="w-3.5 h-3.5 rounded-full shrink-0 mt-1 border border-black/15"
                            style={{backgroundColor: topping.swatchColor}}
                          />
                          <div>
                            <p className="text-sm font-semibold text-[#18181B] leading-snug">
                              {topping.name}
                            </p>
                            <p className="text-xs text-[#71717A] mt-0.5 line-clamp-2">
                              {topping.note}
                            </p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleTopping(topping.id)}
                          aria-label={
                            isSelected
                              ? `Quitar ${topping.name}`
                              : `Añadir ${topping.name}`
                          }
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border shrink-0 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#C83E2B] border-[#C83E2B] text-white'
                              : 'bg-white border-[#E5E2DC] text-[#52525B] hover:border-[#18181B]'
                          }`}
                        >
                          {isSelected ? (
                            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E5E2DC]/70 text-xs font-mono tabular-nums">
                        <span className="text-[#71717A]">
                          +{scaledKcal} kcal · +{formatEuro(price)}
                        </span>

                        {isSelected && (
                          <button
                            type="button"
                            onClick={() => onToggleDoubleTopping(topping.id)}
                            className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                              isDouble
                                ? 'bg-[#18181B] text-white'
                                : 'bg-[#F3F1EC] text-[#52525B] hover:text-[#18181B]'
                            }`}
                          >
                            ×2 Doble
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeStep === 'horno' && (
            <motion.div
              key="horno"
              initial={{opacity: 0, y: 6}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -6}}
              transition={{duration: 0.16}}
              className="space-y-7"
            >
              <div>
                <h3 className="text-base font-semibold text-[#18181B] mb-3">
                  Punto de cocción en piedra refractaria
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {BAKE_LEVELS.map((bake) => {
                    const selected = config.bakeId === bake.id;
                    return (
                      <button
                        key={bake.id}
                        type="button"
                        onClick={() => onChangeBake(bake.id)}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                          selected
                            ? 'border-[#C83E2B] bg-[#C83E2B]/[0.04]'
                            : 'border-[#E5E2DC] bg-white hover:border-[#A1A1AA]'
                        }`}
                      >
                        <p className="text-sm font-semibold text-[#18181B]">
                          {bake.name}
                        </p>
                        <p className="text-xs text-[#71717A] mt-1">{bake.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#18181B] mb-3">
                  Tipo de corte al salir del horno
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CUT_STYLES.map((cut) => {
                    const selected = config.cutId === cut.id;
                    return (
                      <button
                        key={cut.id}
                        type="button"
                        onClick={() => onChangeCut(cut.id)}
                        className={`text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          selected
                            ? 'border-[#C83E2B] bg-[#C83E2B]/[0.04]'
                            : 'border-[#E5E2DC] bg-white hover:border-[#A1A1AA]'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#18181B]">
                            {cut.name}
                          </p>
                          <p className="text-xs text-[#71717A] mt-0.5 font-mono tabular-nums">
                            {cut.slicesCount === 1
                              ? 'Pieza entera'
                              : `${cut.slicesCount} porciones`}
                          </p>
                        </div>
                        {selected && (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#C83E2B] text-white shrink-0">
                            <Check className="w-3 h-3" aria-hidden="true" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Step Footer Navigation */}
      <div className="mt-7 pt-5 border-t border-[#E5E2DC] flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => goToStep(-1)}
          disabled={currentStepIndex === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E5E2DC] text-sm font-medium text-[#18181B] hover:bg-[#F8F7F4] disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          <span>Anterior</span>
        </button>

        <span className="text-xs font-mono tabular-nums text-[#71717A]">
          Paso {currentStepIndex + 1} de {STEPS.length}
        </span>

        <button
          type="button"
          onClick={() => goToStep(1)}
          disabled={currentStepIndex === STEPS.length - 1}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#18181B] text-white text-sm font-medium hover:bg-[#27272A] disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap cursor-pointer"
        >
          <span>Siguiente</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
