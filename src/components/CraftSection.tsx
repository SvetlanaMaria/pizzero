import {DOUGHS, DoughId} from '../data/pizzaData';

interface CraftSectionProps {
  selectedDoughId: DoughId;
  onSelectDough: (doughId: DoughId) => void;
}

export function CraftSection({
  selectedDoughId,
  onSelectDough,
}: CraftSectionProps) {
  return (
    <section
      id="artesania"
      className="py-16 sm:py-20 border-t border-[#E5E2DC] bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#C83E2B] mb-2">
                Obrador y técnica
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#18181B] [text-wrap:balance]">
                El secreto está en el tiempo, el agua y la leña de encina
              </h2>
              <p className="text-base text-[#52525B] mt-3 leading-relaxed">
                Cada bola de masa madura en cámaras controladas a 4 °C antes de
                estirarse a mano sin rodillo. Así conservamos el gas natural de
                la fermentación y conseguimos un borde ligero y fácil de digerir.
              </p>
            </div>

            <div className="space-y-4 pt-2 border-t border-[#E5E2DC]">
              <div>
                <h3 className="text-sm font-semibold text-[#18181B]">
                  01. Fermentación en frío hasta 72 horas
                </h3>
                <p className="text-sm text-[#52525B] mt-1">
                  Las enzimas descomponen los azúcares complejos del cereal,
                  reduciendo la pesadez tras la comida.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#18181B]">
                  02. Cocción rápida sobre piedra volcánica
                </h3>
                <p className="text-sm text-[#52525B] mt-1">
                  Entre 90 y 130 segundos a 390–450 °C sellan la humedad de los
                  ingredientes frescos sin resecar la salsa.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#18181B]">
                  03. Cálculo nutricional transparente
                </h3>
                <p className="text-sm text-[#52525B] mt-1">
                  Cada gramo de harina, queso y topping está pesado y calibrado
                  por tamaño para ofrecer cifras reales en tiempo real.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-[#E5E2DC] rounded-2xl overflow-hidden bg-[#FAF9F6]">
              <div className="px-5 py-4 border-b border-[#E5E2DC] flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#18181B]">
                    Comparativa técnica de masas (tamaño Mediana)
                  </h3>
                  <p className="text-xs text-[#71717A] mt-0.5">
                    Pulsa cualquier fila para probarla en el configurador
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E2DC] text-xs font-medium text-[#71717A]">
                      <th className="py-3 px-5">Masa</th>
                      <th className="py-3 px-3 text-right">Hidratación</th>
                      <th className="py-3 px-3 text-right">Maduración</th>
                      <th className="py-3 px-3 text-right">Horno</th>
                      <th className="py-3 px-5 text-right">Calorías</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2DC] text-sm">
                    {DOUGHS.map((dough) => {
                      const active = dough.id === selectedDoughId;
                      return (
                        <tr
                          key={dough.id}
                          onClick={() => onSelectDough(dough.id)}
                          className={`transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#C83E2B]/[0.06]'
                              : 'hover:bg-[#F3F1EC]'
                          }`}
                        >
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2.5">
                              <span
                                aria-hidden="true"
                                className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                                style={{backgroundColor: dough.crustColorBaked}}
                              />
                              <div>
                                <p className="font-medium text-[#18181B]">
                                  {dough.name}
                                </p>
                                <p className="text-xs text-[#71717A]">
                                  {dough.digestibilityNote}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono tabular-nums text-[#52525B]">
                            {dough.hydration}%
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono tabular-nums text-[#52525B]">
                            {dough.fermentationHours} h
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono tabular-nums text-[#52525B]">
                            {dough.ovenTempC} °C
                          </td>
                          <td className="py-3.5 px-5 text-right font-mono tabular-nums font-medium text-[#18181B]">
                            {dough.calories} kcal
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
