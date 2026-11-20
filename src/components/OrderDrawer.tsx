import {FormEvent, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X} from 'lucide-react';
import {
  CartItem,
  calculatePizzaMetrics,
  describePizzaSummary,
  formatEuro,
} from '../data/pizzaData';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export function OrderDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: OrderDrawerProps) {
  const [deliveryMode, setDeliveryMode] = useState<'envio' | 'recogida'>('envio');
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    total: number;
    etaMinutes: number;
    mode: 'envio' | 'recogida';
  } | null>(null);

  const subtotal = items.reduce((acc, item) => {
    const m = calculatePizzaMetrics(item.config);
    return acc + m.price * item.quantity;
  }, 0);

  const totalCalories = items.reduce((acc, item) => {
    const m = calculatePizzaMetrics(item.config);
    return acc + m.calories * item.quantity;
  }, 0);

  const deliveryFee =
    deliveryMode === 'envio' && subtotal > 0 && subtotal < 25 ? 2.5 : 0;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'FORNO10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoApplied(false);
      setPromoError('Código no válido. Prueba con FORNO10');
    }
  };

  const handleSubmitOrder = (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    const randomNum = 2040 + Math.floor(Math.random() * 899);
    setConfirmedOrder({
      orderNumber: `FV-${randomNum}`,
      total,
      etaMinutes: deliveryMode === 'envio' ? 28 : 14,
      mode: deliveryMode,
    });
    onClearCart();
  };

  const handleCloseDrawer = () => {
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Resumen de tu pedido"
        >
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            onClick={handleCloseDrawer}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          <motion.aside
            initial={{x: '100%'}}
            animate={{x: 0}}
            exit={{x: '100%'}}
            transition={{type: 'spring', stiffness: 320, damping: 32}}
            className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E5E2DC]"
          >
            <div className="px-6 py-4 border-b border-[#E5E2DC] flex items-center justify-between gap-4">
              <h2 className="font-display text-xl font-semibold text-[#18181B]">
                Tu pedido artesanal
              </h2>
              <button
                type="button"
                onClick={handleCloseDrawer}
                aria-label="Cerrar pedido"
                className="p-2 rounded-lg text-[#52525B] hover:text-[#18181B] hover:bg-[#F3F1EC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {confirmedOrder ? (
                <div className="py-10 text-center space-y-4">
                  <CheckCircle2
                    className="w-12 h-12 text-[#3F6212] mx-auto"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-[#71717A]">
                      Pedido #{confirmedOrder.orderNumber} confirmado
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-[#18181B] mt-1">
                      ¡Al horno de leña!
                    </h3>
                    <p className="text-sm text-[#52525B] mt-2 leading-relaxed">
                      Hemos recibido tu orden en el obrador.{' '}
                      {confirmedOrder.mode === 'envio'
                        ? `Llegará a tu domicilio en aproximadamente ${confirmedOrder.etaMinutes} minutos.`
                        : `Estará lista para recoger en barra en ${confirmedOrder.etaMinutes} minutos.`}
                    </p>
                  </div>

                  <div className="bg-[#F8F7F4] border border-[#E5E2DC] rounded-xl p-4 text-left text-sm space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#52525B]">Cliente</span>
                      <span className="font-medium text-[#18181B]">
                        {customerName || 'Invitado'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#52525B]">Importe confirmado</span>
                      <span className="font-mono tabular-nums font-semibold text-[#18181B]">
                        {formatEuro(confirmedOrder.total)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseDrawer}
                    className="w-full py-3 rounded-xl bg-[#18181B] text-white text-sm font-semibold hover:bg-[#27272A] transition-colors cursor-pointer"
                  >
                    Seguir diseñando pizzas
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag
                    className="w-10 h-10 text-[#A1A1AA] mx-auto"
                    aria-hidden="true"
                  />
                  <p className="text-base font-medium text-[#18181B]">
                    Tu cesta está vacía
                  </p>
                  <p className="text-sm text-[#71717A]">
                    Personaliza una pizza en el configurador o elige una receta
                    de autor para comenzar.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Delivery mode segmented toggle */}
                  <div className="grid grid-cols-2 p-1 bg-[#F3F1EC] rounded-lg border border-[#E5E2DC]">
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('envio')}
                      className={`py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        deliveryMode === 'envio'
                          ? 'bg-white text-[#18181B] shadow-xs'
                          : 'text-[#52525B] hover:text-[#18181B]'
                      }`}
                    >
                      Envío a domicilio
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('recogida')}
                      className={`py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        deliveryMode === 'recogida'
                          ? 'bg-white text-[#18181B] shadow-xs'
                          : 'text-[#52525B] hover:text-[#18181B]'
                      }`}
                    >
                      Recoger en obrador
                    </button>
                  </div>

                  {/* Itemized pizzas */}
                  <ul className="divide-y divide-[#E5E2DC]">
                    {items.map((item) => {
                      const m = calculatePizzaMetrics(item.config);
                      return (
                        <li key={item.id} className="py-4 first:pt-0 space-y-2.5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-sm font-semibold text-[#18181B]">
                                {item.name}
                              </h3>
                              <p className="text-xs text-[#52525B] mt-0.5 leading-relaxed">
                                {describePizzaSummary(item.config)}
                              </p>
                              <p className="text-xs font-mono tabular-nums text-[#71717A] mt-1">
                                {m.calories} kcal/ud · {m.weightGrams} g
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              aria-label={`Quitar ${item.name}`}
                              className="p-1.5 text-[#71717A] hover:text-[#C83E2B] transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="inline-flex items-center border border-[#E5E2DC] rounded-lg">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                aria-label="Reducir cantidad"
                                className="p-1.5 text-[#52525B] hover:text-[#18181B] cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                              <span className="px-3 text-xs font-mono tabular-nums font-semibold text-[#18181B]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                aria-label="Aumentar cantidad"
                                className="p-1.5 text-[#52525B] hover:text-[#18181B] cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                            </div>

                            <span className="font-mono tabular-nums text-sm font-semibold text-[#18181B]">
                              {formatEuro(m.price * item.quantity)}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Promo Code */}
                  <div className="pt-2 border-t border-[#E5E2DC]">
                    <label
                      htmlFor="promo-code"
                      className="block text-xs font-medium text-[#52525B] mb-1.5"
                    >
                      Código promocional (prueba <span className="font-mono">FORNO10</span>)
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="promo-code"
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="FORNO10"
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-[#E5E2DC] focus:outline-none focus:ring-2 focus:ring-[#C83E2B]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-4 py-2 rounded-lg border border-[#E5E2DC] bg-[#F8F7F4] hover:bg-[#EFECE6] text-xs font-semibold text-[#18181B] transition-colors cursor-pointer"
                      >
                        Aplicar
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-xs text-[#C83E2B] mt-1">{promoError}</p>
                    )}
                    {promoApplied && (
                      <p className="text-xs text-[#3F6212] mt-1">
                        Descuento del 10% aplicado correctamente.
                      </p>
                    )}
                  </div>

                  {/* Checkout Form */}
                  <form
                    id="checkout-form"
                    onSubmit={handleSubmitOrder}
                    className="space-y-3 pt-4 border-t border-[#E5E2DC]"
                  >
                    <p className="text-xs font-semibold text-[#18181B]">
                      Datos de entrega y confirmación
                    </p>
                    <div>
                      <label htmlFor="cust-name" className="sr-only">
                        Nombre completo
                      </label>
                      <input
                        id="cust-name"
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#E5E2DC] focus:outline-none focus:ring-2 focus:ring-[#C83E2B]"
                      />
                    </div>
                    <div>
                      <label htmlFor="cust-phone" className="sr-only">
                        Teléfono
                      </label>
                      <input
                        id="cust-phone"
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Teléfono de contacto"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#E5E2DC] focus:outline-none focus:ring-2 focus:ring-[#C83E2B]"
                      />
                    </div>
                    {deliveryMode === 'envio' && (
                      <div>
                        <label htmlFor="cust-address" className="sr-only">
                          Dirección de entrega
                        </label>
                        <input
                          id="cust-address"
                          type="text"
                          required
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="Calle, número y piso"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-[#E5E2DC] focus:outline-none focus:ring-2 focus:ring-[#C83E2B]"
                        />
                      </div>
                    )}
                  </form>
                </div>
              )}
            </div>

            {items.length > 0 && !confirmedOrder && (
              <div className="px-6 py-4 border-t border-[#E5E2DC] bg-[#FAF9F6] space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[#52525B]">
                    <span>Subtotal ({totalCalories} kcal totales)</span>
                    <span className="font-mono tabular-nums">
                      {formatEuro(subtotal)}
                    </span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-[#3F6212]">
                      <span>Descuento FORNO10 (-10%)</span>
                      <span className="font-mono tabular-nums">
                        -{formatEuro(discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#52525B]">
                    <span>
                      {deliveryMode === 'envio'
                        ? 'Envío (gratis desde 25,00 €)'
                        : 'Recogida en barra'}
                    </span>
                    <span className="font-mono tabular-nums">
                      {deliveryFee === 0 ? 'Gratis' : formatEuro(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-[#18181B] pt-2 border-t border-[#E5E2DC]">
                    <span>Total</span>
                    <span className="font-mono tabular-nums">
                      {formatEuro(total)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  className="w-full py-3 rounded-xl bg-[#C83E2B] hover:bg-[#AD3221] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Confirmar pedido · {formatEuro(total)}
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
