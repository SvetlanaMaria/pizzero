import {FormEvent, useEffect, useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {ArrowDown, X} from 'lucide-react';
import {Header} from './components/Header';
import {PizzaVisualizer} from './components/PizzaVisualizer';
import {ConfiguratorPanel} from './components/ConfiguratorPanel';
import {MaestroPizzero} from './components/MaestroPizzero';
import {PresetsSection} from './components/PresetsSection';
import {CraftSection} from './components/CraftSection';
import {SavedPizzasSection} from './components/SavedPizzasSection';
import {OrderDrawer} from './components/OrderDrawer';
import {
  BakeId,
  CartItem,
  CheeseId,
  CutId,
  DEFAULT_PIZZA_CONFIG,
  DoughId,
  PizzaConfig,
  SavedPizza,
  SauceId,
  SizeId,
  calculatePizzaMetrics,
  generateChefSurprise,
} from './data/pizzaData';

const SAVED_STORAGE_KEY = 'forno_vivo_saved_pizzas_v1';
const CART_STORAGE_KEY = 'forno_vivo_cart_v1';

export default function App() {
  const [config, setConfig] = useState<PizzaConfig>(DEFAULT_PIZZA_CONFIG);
  const [activeRecipeName, setActiveRecipeName] = useState<string>(
    'Pizza Artesanal Personalizada',
  );
  const [isBaked, setIsBaked] = useState<boolean>(true);
  const [showSlices, setShowSlices] = useState<boolean>(false);
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [noticeText, setNoticeText] = useState<string | null>(null);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [saveNameInput, setSaveNameInput] = useState<string>('');

  const [savedPizzas, setSavedPizzas] = useState<SavedPizza[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedPizza[]) : [];
    } catch {
      return [];
    }
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedPizzas));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedPizzas]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  const metrics = useMemo(() => calculatePizzaMetrics(config), [config]);

  const totalCartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const showNotice = (msg: string) => {
    setNoticeText(msg);
    window.setTimeout(() => {
      setNoticeText((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleToggleCheese = (cheeseId: CheeseId) => {
    setActiveRecipeName('Pizza Artesanal Personalizada');
    setConfig((prev) => {
      const exists = prev.cheeseIds.includes(cheeseId);
      return {
        ...prev,
        cheeseIds: exists
          ? prev.cheeseIds.filter((id) => id !== cheeseId)
          : [...prev.cheeseIds, cheeseId],
      };
    });
  };

  const handleToggleTopping = (toppingId: string) => {
    setActiveRecipeName('Pizza Artesanal Personalizada');
    setConfig((prev) => {
      const exists = prev.toppings.some((t) => t.id === toppingId);
      return {
        ...prev,
        toppings: exists
          ? prev.toppings.filter((t) => t.id !== toppingId)
          : [...prev.toppings, {id: toppingId, double: false}],
      };
    });
  };

  const handleToggleDoubleTopping = (toppingId: string) => {
    setConfig((prev) => ({
      ...prev,
      toppings: prev.toppings.map((t) =>
        t.id === toppingId ? {...t, double: !t.double} : t,
      ),
    }));
  };

  const addPizzaToCart = (pizzaConfig: PizzaConfig, name: string) => {
    const serialized = JSON.stringify(pizzaConfig);
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.name === name && JSON.stringify(item.config) === serialized,
      );
      if (existingIndex >= 0) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? {...item, quantity: item.quantity + 1}
            : item,
        );
      }
      return [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name,
          config: pizzaConfig,
          quantity: 1,
        },
      ];
    });
  };

  const handleAddCurrentToCart = () => {
    addPizzaToCart(config, activeRecipeName);
    setJustAdded(true);
    showNotice(`«${activeRecipeName}» añadida a tu pedido`);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  const handleRandomize = () => {
    setConfig(generateChefSurprise());
    setActiveRecipeName('Creación Sorpresa del Maestro');
    showNotice('Nueva combinación aleatoria generada');
  };

  const handleReset = () => {
    setConfig(DEFAULT_PIZZA_CONFIG);
    setActiveRecipeName('Pizza Artesanal Personalizada');
    showNotice('Configuración restablecida');
  };

  const handleLoadPreset = (presetConfig: PizzaConfig, name: string) => {
    setConfig(presetConfig);
    setActiveRecipeName(name);
    showNotice(`Receta «${name}» cargada en el configurador`);
    document.getElementById('configurador')?.scrollIntoView({behavior: 'smooth'});
  };

  const handleSelectDoughFromCraft = (doughId: DoughId) => {
    setConfig((prev) => ({...prev, doughId}));
    showNotice('Masa actualizada en tu configuración');
    document.getElementById('configurador')?.scrollIntoView({behavior: 'smooth'});
  };

  const handleSaveSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanName = saveNameInput.trim() || 'Mi Pizza Artesanal';
    const newSaved: SavedPizza = {
      id: `${Date.now()}`,
      name: cleanName,
      createdAt: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
      }),
      config: JSON.parse(JSON.stringify(config)) as PizzaConfig,
    };
    setSavedPizzas((prev) => [newSaved, ...prev]);
    setSaveNameInput('');
    setIsSaveModalOpen(false);
    showNotice(`«${cleanName}» guardada en Mis Pizzas`);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? {...item, quantity: item.quantity + delta} : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div id="inicio" className="min-h-screen flex flex-col bg-[#F8F7F4]">
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-10 sm:py-14 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-medium tracking-wide text-[#C83E2B]">
                    Obrador de masa madre y horno de encina
                  </p>
                  <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[#18181B] leading-[1.08] [text-wrap:balance]">
                    Diseña tu pizza artesanal ingrediente a ingrediente
                  </h1>
                  <p className="text-base sm:text-lg text-[#52525B] max-w-xl leading-relaxed">
                    Combina masas de fermentación lenta, salsas de temporada y
                    quesos italianos mientras ves el resultado en vivo junto con
                    sus calorías, macros y precio exacto.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#configurador"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C83E2B] hover:bg-[#AD3221] text-white text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    <span>Empezar a configurar</span>
                    <ArrowDown className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <a
                    href="#recetas"
                    className="inline-flex items-center px-5 py-3 rounded-xl border border-[#E5E2DC] bg-white hover:bg-[#F3F1EC] text-[#18181B] text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Ver recetas de autor
                  </a>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#71717A]">
                  <span>Fermentación en frío 72 h</span>
                  <span aria-hidden="true">·</span>
                  <span>Cocción a 450 °C</span>
                  <span aria-hidden="true">·</span>
                  <span>Cálculo nutricional inmediato</span>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative h-64 sm:h-80 lg:h-full min-h-[320px] rounded-2xl overflow-hidden border border-[#E5E2DC] bg-[#E8E4DC]">
                  <img
                    src="/src/assets/images/hero_wood_oven_pizza_1795128660133.jpg"
                    alt="Pizza artesanal recién horneada sobre pala de madera frente al horno de leña"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Configurator Studio */}
        <section
          id="configurador"
          className="py-10 sm:py-14 border-t border-[#E5E2DC]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-medium tracking-wide text-[#C83E2B] mb-1.5">
                  Estudio interactivo
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#18181B]">
                  {activeRecipeName}
                </h2>
              </div>

              <AnimatePresence>
                {noticeText && (
                  <motion.p
                    initial={{opacity: 0, y: 4}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0}}
                    role="status"
                    className="text-xs font-medium text-[#18181B] bg-white border border-[#E5E2DC] px-3.5 py-2 rounded-lg shadow-xs"
                  >
                    {noticeText}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <PizzaVisualizer
                  config={config}
                  metrics={metrics}
                  isBaked={isBaked}
                  onToggleBaked={setIsBaked}
                  showSlices={showSlices}
                  onToggleSlices={() => setShowSlices((v) => !v)}
                  onAddToCart={handleAddCurrentToCart}
                  onOpenSaveModal={() => {
                    setSaveNameInput(
                      activeRecipeName === 'Pizza Artesanal Personalizada'
                        ? ''
                        : activeRecipeName,
                    );
                    setIsSaveModalOpen(true);
                  }}
                  onRandomize={handleRandomize}
                  onReset={handleReset}
                  justAdded={justAdded}
                />
              </div>

              <div className="lg:col-span-7 space-y-6">
                <ConfiguratorPanel
                  config={config}
                  onChangeSize={(sizeId: SizeId) =>
                    setConfig((prev) => ({...prev, sizeId}))
                  }
                  onChangeDough={(doughId: DoughId) =>
                    setConfig((prev) => ({...prev, doughId}))
                  }
                  onChangeSauce={(sauceId: SauceId) =>
                    setConfig((prev) => ({...prev, sauceId}))
                  }
                  onToggleCheese={handleToggleCheese}
                  onToggleTopping={handleToggleTopping}
                  onToggleDoubleTopping={handleToggleDoubleTopping}
                  onChangeBake={(bakeId: BakeId) =>
                    setConfig((prev) => ({...prev, bakeId}))
                  }
                  onChangeCut={(cutId: CutId) => {
                    setConfig((prev) => ({...prev, cutId}));
                    if (cutId !== 'sin-cortar') setShowSlices(true);
                  }}
                />

                <MaestroPizzero config={config} metrics={metrics} />
              </div>
            </div>
          </div>
        </section>

        {/* Chef Signature Presets */}
        <PresetsSection
          onLoadPreset={handleLoadPreset}
          onAddPresetToCart={(presetConfig, name) => {
            addPizzaToCart(presetConfig, name);
            showNotice(`«${name}» añadida a tu pedido`);
          }}
        />

        {/* Dough & Wood Oven Craftsmanship */}
        <CraftSection
          selectedDoughId={config.doughId}
          onSelectDough={handleSelectDoughFromCraft}
        />

        {/* Saved Custom Creations */}
        <SavedPizzasSection
          savedPizzas={savedPizzas}
          onLoadSaved={(savedConfig) => {
            setConfig(savedConfig);
            setActiveRecipeName('Creación Recuperada');
            showNotice('Combinación cargada en el configurador');
            document
              .getElementById('configurador')
              ?.scrollIntoView({behavior: 'smooth'});
          }}
          onAddSavedToCart={(savedConfig, name) => {
            addPizzaToCart(savedConfig, name);
            showNotice(`«${name}» añadida a tu pedido`);
          }}
          onDeleteSaved={(id) => {
            setSavedPizzas((prev) => prev.filter((item) => item.id !== id));
          }}
        />
      </main>

      <footer className="border-t border-[#E5E2DC] bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <p className="font-medium text-[#18181B]">
            Forno Vivo · Obrador Artesanal
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#configurador" className="hover:text-[#18181B]">
              Configurador
            </a>
            <a href="#recetas" className="hover:text-[#18181B]">
              Recetas de Autor
            </a>
            <a href="#artesania" className="hover:text-[#18181B]">
              Masa y Horno
            </a>
            <a href="#mis-pizzas" className="hover:text-[#18181B]">
              Mis Pizzas
            </a>
          </div>
        </div>
      </footer>

      {/* Save Pizza Modal */}
      <AnimatePresence>
        {isSaveModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-modal-title"
          >
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              onClick={() => setIsSaveModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{opacity: 0, scale: 0.96, y: 8}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.96, y: 8}}
              transition={{duration: 0.16}}
              className="relative z-10 w-full max-w-md bg-white border border-[#E5E2DC] rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  id="save-modal-title"
                  className="font-display text-xl font-semibold text-[#18181B]"
                >
                  Guardar tu creación
                </h3>
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  aria-label="Cerrar ventana"
                  className="p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <form onSubmit={handleSaveSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="pizza-custom-name"
                    className="block text-xs font-medium text-[#52525B] mb-1.5"
                  >
                    Nombre de tu pizza
                  </label>
                  <input
                    id="pizza-custom-name"
                    type="text"
                    required
                    autoFocus
                    maxLength={48}
                    value={saveNameInput}
                    onChange={(e) => setSaveNameInput(e.target.value)}
                    placeholder="Ej. Mi Trufa y Portobello"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E5E2DC] focus:outline-none focus:ring-2 focus:ring-[#C83E2B]"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSaveModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-[#E5E2DC] text-sm font-medium text-[#52525B] hover:text-[#18181B] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#C83E2B] hover:bg-[#AD3221] text-white text-sm font-semibold cursor-pointer"
                  >
                    Guardar receta
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Drawer */}
      <OrderDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
      />
    </div>
  );
}
