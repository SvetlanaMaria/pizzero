import {useMemo} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  BookmarkPlus,
  Flame,
  RotateCcw,
  Scissors,
  ShoppingBag,
  Shuffle,
} from 'lucide-react';
import {
  CHEESES,
  DOUGHS,
  PizzaConfig,
  PizzaMetrics,
  SAUCES,
  SIZES,
  TOPPINGS,
  ToppingOption,
  formatEuro,
} from '../data/pizzaData';

interface PizzaVisualizerProps {
  config: PizzaConfig;
  metrics: PizzaMetrics;
  isBaked: boolean;
  onToggleBaked: (baked: boolean) => void;
  showSlices: boolean;
  onToggleSlices: () => void;
  onAddToCart: () => void;
  onOpenSaveModal: () => void;
  onRandomize: () => void;
  onReset: () => void;
  justAdded: boolean;
}

interface Coord {
  x: number;
  y: number;
  rot: number;
  scale: number;
}

function getOrganicPositions(seed: number, count: number, maxRadius = 112): Coord[] {
  const coords: Coord[] = [];
  const goldenAngle = 2.39996323;
  for (let i = 0; i < count; i++) {
    const r = Math.sqrt((i + 0.65) / (count + 0.4)) * maxRadius;
    const theta = i * goldenAngle + seed * 1.37;
    const x = 200 + r * Math.cos(theta);
    const y = 200 + r * Math.sin(theta);
    const rot = ((seed * 53 + i * 97) % 360) - 180;
    const scale = 0.88 + ((seed + i * 19) % 24) / 100;
    coords.push({x, y, rot, scale});
  }
  return coords;
}

function renderToppingPiece(type: ToppingOption['visualType'], isBaked: boolean) {
  switch (type) {
    case 'pepperoni':
      return (
        <g>
          <circle
            cx="0"
            cy="0"
            r="14"
            fill={isBaked ? '#96281B' : '#B83728'}
            stroke={isBaked ? '#5E160E' : '#8A251B'}
            strokeWidth="1.8"
          />
          <circle cx="-4" cy="-3" r="1.7" fill="#E8A99A" opacity="0.65" />
          <circle cx="4" cy="2" r="1.4" fill="#E8A99A" opacity="0.6" />
          <circle cx="-1" cy="5" r="1.5" fill="#E8A99A" opacity="0.55" />
          <circle cx="5" cy="-5" r="1.2" fill="#E8A99A" opacity="0.55" />
        </g>
      );
    case 'jamon':
      return (
        <g>
          <path
            d="M-16,-4 C-8,-10 4,-7 14,-2 C18,1 13,9 5,7 C-4,5 -12,8 -17,3 Z"
            fill={isBaked ? '#A84245' : '#BA5255'}
            stroke="#7A2A2D"
            strokeWidth="1"
          />
          <path
            d="M-11,-1 C-4,-4 3,-2 9,1"
            stroke="#F4D7D0"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
      );
    case 'guanciale':
      return (
        <g>
          <rect
            x="-9"
            y="-5"
            width="18"
            height="10"
            rx="2"
            fill={isBaked ? '#B86259' : '#CE7970'}
            stroke="#853E37"
            strokeWidth="1"
          />
          <rect x="-7" y="-2" width="14" height="3.2" rx="1" fill="#F5E5DD" opacity="0.8" />
        </g>
      );
    case 'pollo':
      return (
        <g>
          <path
            d="M-11,-3 C-5,-7 7,-5 12,0 C9,6 -3,7 -12,2 Z"
            fill={isBaked ? '#D4AC77' : '#E3C396'}
            stroke="#A87E4B"
            strokeWidth="1"
          />
          <line x1="-6" y1="0" x2="6" y2="1" stroke="#A87E4B" strokeWidth="1" opacity="0.55" />
        </g>
      );
    case 'champinon':
      return (
        <g>
          <path
            d="M-12,0 C-12,-9 12,-9 12,0 C12,3 6,2 4,3 L3,11 L-3,11 L-4,3 C-6,2 -12,3 -12,0 Z"
            fill={isBaked ? '#7D6352' : '#9B8170'}
            stroke="#4F3C30"
            strokeWidth="1"
          />
          <path
            d="M-8,-1 C-5,-5 5,-5 8,-1"
            stroke="#D6C4B6"
            strokeWidth="1.4"
            fill="none"
            opacity="0.6"
          />
        </g>
      );
    case 'cebolla':
      return (
        <g>
          <circle
            cx="0"
            cy="0"
            r="12"
            fill="none"
            stroke={isBaked ? '#6E3253' : '#8A486C'}
            strokeWidth="3.2"
          />
          <circle
            cx="0"
            cy="0"
            r="7.5"
            fill="none"
            stroke="#C79CB3"
            strokeWidth="1.3"
            opacity="0.7"
          />
        </g>
      );
    case 'alcachofa':
      return (
        <g>
          <path
            d="M0,-12 L10,6 C6,10 -6,10 -10,6 Z"
            fill={isBaked ? '#8F9C59' : '#A8B572'}
            stroke="#596331"
            strokeWidth="1.1"
          />
          <path d="M0,-10 L0,7 M-4,-2 L-6,6 M4,-2 L6,6" stroke="#596331" strokeWidth="1" opacity="0.6" />
        </g>
      );
    case 'aceituna':
      return (
        <g>
          <circle cx="0" cy="0" r="8" fill="#3B2133" />
          <circle cx="0" cy="0" r="3" fill="#B83227" opacity="0.35" />
          <ellipse cx="-2.5" cy="-2.5" rx="2" ry="1.2" fill="#FFFFFF" opacity="0.25" />
        </g>
      );
    case 'cherry':
      return (
        <g>
          <circle
            cx="0"
            cy="0"
            r="10"
            fill={isBaked ? '#C83728' : '#E04838'}
            stroke="#8B1F14"
            strokeWidth="1.1"
          />
          <circle cx="0" cy="0" r="6.5" fill="#EA6B5D" opacity="0.6" />
          <circle cx="-2.5" cy="-2" r="1" fill="#FDE6A6" />
          <circle cx="2.5" cy="1.5" r="1" fill="#FDE6A6" />
          <circle cx="-1" cy="3" r="0.9" fill="#FDE6A6" />
        </g>
      );
    case 'pimiento':
      return (
        <path
          d="M-13,-3 C-5,-7 6,-6 14,-1 C12,5 2,4 -11,4 Z"
          fill={isBaked ? '#C24227' : '#DC5539'}
          stroke="#802512"
          strokeWidth="1"
        />
      );
    case 'albahaca':
      return (
        <g>
          <path
            d="M0,-12 C8,-7 9,5 0,11 C-9,5 -8,-7 0,-12 Z"
            fill={isBaked ? '#2E5B24' : '#3F7A32'}
            stroke="#22451A"
            strokeWidth="1"
          />
          <path d="M0,-9 L0,9 M0,-3 L4,-5 M0,1 L-4,-1" stroke="#76AE65" strokeWidth="1" opacity="0.7" />
        </g>
      );
    case 'rucula':
      return (
        <path
          d="M0,-13 C4,-9 2,-6 6,-3 C2,-1 5,4 1,7 C3,10 0,13 0,13 C0,13 -3,10 -1,7 C-5,4 -2,-1 -6,-3 C-2,-6 -4,-9 0,-13 Z"
          fill="#4A7A35"
          stroke="#2E511F"
          strokeWidth="0.9"
        />
      );
    case 'chile':
      return (
        <g>
          <circle cx="0" cy="0" r="6.5" fill="#C92218" stroke="#7E120C" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="#F7D896" opacity="0.85" />
        </g>
      );
    case 'pinones':
      return (
        <ellipse
          cx="0"
          cy="0"
          rx="5.5"
          ry="3"
          fill={isBaked ? '#D9BA82' : '#EAD5A7'}
          stroke="#9E7E48"
          strokeWidth="0.9"
        />
      );
    case 'miel':
      return (
        <path
          d="M-12,-4 Q-4,4 4,-3 T14,2"
          fill="none"
          stroke="#E5A228"
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.85"
        />
      );
    default:
      return <circle cx="0" cy="0" r="7" fill="#666" />;
  }
}

export function PizzaVisualizer({
  config,
  metrics,
  isBaked,
  onToggleBaked,
  showSlices,
  onToggleSlices,
  onAddToCart,
  onOpenSaveModal,
  onRandomize,
  onReset,
  justAdded,
}: PizzaVisualizerProps) {
  const size = SIZES.find((s) => s.id === config.sizeId) ?? SIZES[1];
  const dough = DOUGHS.find((d) => d.id === config.doughId) ?? DOUGHS[0];
  const sauce = SAUCES.find((s) => s.id === config.sauceId) ?? SAUCES[0];
  const hasBurrata = config.cheeseIds.includes('burrata');
  const hasFior = config.cheeseIds.includes('fior-di-latte');
  const hasVegan = config.cheeseIds.includes('vegana');
  const hasGorgonzola = config.cheeseIds.includes('gorgonzola');
  const hasCabra = config.cheeseIds.includes('cabra');
  const hasParmigiano = config.cheeseIds.includes('parmigiano');

  const sizeScale =
    config.sizeId === 'mediana' ? 0.87 : config.sizeId === 'grande' ? 0.95 : 1.03;

  const charSpots = useMemo(() => {
    const spots: {cx: number; cy: number; r: number; rot: number}[] = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.08;
      const radius = 152 + ((i * 7) % 10);
      spots.push({
        cx: 200 + radius * Math.cos(angle),
        cy: 200 + radius * Math.sin(angle),
        r: 4 + (i % 5) * 1.4,
        rot: (i * 45) % 180,
      });
    }
    return spots;
  }, []);

  const cheeseBlobs = useMemo(() => getOrganicPositions(7, 14, 108), []);
  const gorgonzolaBlobs = useMemo(() => getOrganicPositions(19, 9, 104), []);
  const cabraMedallions = useMemo(() => getOrganicPositions(23, 7, 98), []);
  const parmigianoShards = useMemo(() => getOrganicPositions(31, 16, 114), []);

  const toppingLayers = useMemo(() => {
    return config.toppings
      .map((sel, index) => {
        const topping = TOPPINGS.find((t) => t.id === sel.id);
        if (!topping) return null;
        const baseCount =
          topping.visualType === 'pinones'
            ? 18
            : topping.visualType === 'miel'
              ? 8
              : topping.visualType === 'albahaca' || topping.visualType === 'rucula'
                ? 9
                : 11;
        const count = sel.double ? Math.round(baseCount * 1.75) : baseCount;
        const maxR = hasBurrata ? 116 : 114;
        const coords = getOrganicPositions(index * 11 + topping.name.length, count, maxR).filter(
          (c) => {
            if (!hasBurrata) return true;
            const distFromCenter = Math.hypot(c.x - 200, c.y - 200);
            return distFromCenter > 42;
          },
        );
        return {topping, coords};
      })
      .filter(Boolean) as {topping: ToppingOption; coords: Coord[]}[];
  }, [config.toppings, hasBurrata]);

  const crustColor = isBaked ? dough.crustColorBaked : dough.crustColorRaw;
  const charOpacity = isBaked
    ? dough.charIntensity * (config.bakeId === 'crujiente' ? 0.95 : config.bakeId === 'suave' ? 0.4 : 0.72)
    : 0.08;

  return (
    <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Top stage controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="inline-flex items-center p-1 bg-[#F3F1EC] rounded-lg border border-[#E5E2DC]">
          <button
            type="button"
            onClick={() => onToggleBaked(false)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              !isBaked
                ? 'bg-white text-[#18181B] shadow-xs'
                : 'text-[#52525B] hover:text-[#18181B]'
            }`}
          >
            Preparación
          </button>
          <button
            type="button"
            onClick={() => onToggleBaked(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isBaked
                ? 'bg-[#C83E2B] text-white shadow-xs'
                : 'text-[#52525B] hover:text-[#18181B]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Horneada {metrics.ovenTempC} °C</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleSlices}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            showSlices
              ? 'bg-[#18181B] text-white border-[#18181B]'
              : 'bg-white text-[#52525B] border-[#E5E2DC] hover:text-[#18181B]'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{showSlices ? 'Ocultar corte' : 'Ver porciones'}</span>
        </button>
      </div>

      {/* Live Pizza Stage */}
      <div className="relative flex items-center justify-center rounded-xl bg-[#F3F1EC] border border-[#E5E2DC]/80 py-5 px-4 overflow-hidden">
        {/* Subtle studio radial backdrop */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.85) 0%, rgba(235,231,222,0.4) 70%)',
          }}
        />

        <motion.svg
          viewBox="0 0 400 415"
          className="relative w-full max-w-[350px] sm:max-w-[385px] h-auto drop-shadow-md select-none"
          role="img"
          aria-label={`Vista previa de pizza ${size.name} con masa ${dough.name}`}
          animate={{scale: sizeScale}}
          transition={{type: 'spring', stiffness: 220, damping: 24}}
        >
          <defs>
            <radialGradient id="peelWood" cx="45%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#DFC6A2" />
              <stop offset="70%" stopColor="#CAA77B" />
              <stop offset="100%" stopColor="#B18A5B" />
            </radialGradient>
            <radialGradient id="crustGrad" cx="45%" cy="40%" r="60%">
              <stop offset="72%" stopColor={crustColor} />
              <stop offset="92%" stopColor={isBaked ? '#A8743F' : '#DFCFAF'} />
              <stop offset="100%" stopColor={isBaked ? '#7E5229' : '#C9B796'} />
            </radialGradient>
            <radialGradient id="burrataGrad" cx="38%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="75%" stopColor="#F4EFE3" />
              <stop offset="100%" stopColor="#DDD3BF" />
            </radialGradient>
          </defs>

          {/* Wooden Peel Board + Handle */}
          <rect x="184" y="346" width="32" height="62" rx="8" fill="#B58D5E" />
          <circle
            cx="200"
            cy="200"
            r="186"
            fill="url(#peelWood)"
            stroke="#9C7549"
            strokeWidth="2"
          />
          <circle
            cx="200"
            cy="200"
            r="177"
            fill="none"
            stroke="#DFC7A7"
            strokeWidth="1"
            opacity="0.55"
          />

          {/* Pizza Base Shadow */}
          <circle cx="202" cy="204" r="168" fill="rgba(24,24,27,0.16)" />

          {/* Dough / Crust */}
          <motion.circle
            cx="200"
            cy="200"
            r="168"
            fill={dough.id === 'carbon' ? crustColor : 'url(#crustGrad)'}
            stroke={isBaked ? '#6A4320' : '#D1C0A1'}
            strokeWidth="1.5"
            animate={{fill: dough.id === 'carbon' ? crustColor : crustColor}}
            transition={{duration: 0.35}}
          />

          {/* Inner Rim Contour */}
          <circle
            cx="200"
            cy="200"
            r="142"
            fill={isBaked ? '#E7CFA4' : '#F4E8D2'}
            opacity={dough.id === 'carbon' ? 0.16 : 0.45}
          />

          {/* Char Leopard Spots (Cornicione) */}
          <g opacity={charOpacity}>
            {charSpots.map((spot, idx) => (
              <ellipse
                key={idx}
                cx={spot.cx}
                cy={spot.cy}
                rx={spot.r}
                ry={spot.r * 0.65}
                transform={`rotate(${spot.rot} ${spot.cx} ${spot.cy})`}
                fill="#291D14"
              />
            ))}
          </g>

          {/* Sauce Layer */}
          <AnimatePresence>
            {sauce.id !== 'sin-salsa' ? (
              <motion.g
                key={sauce.id}
                initial={{scale: 0.85, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.25}}
                style={{transformOrigin: '200px 200px'}}
              >
                <circle cx="200" cy="200" r="136" fill={sauce.color} />
                <circle
                  cx="200"
                  cy="200"
                  r="116"
                  fill="none"
                  stroke={sauce.accentColor}
                  strokeWidth="8"
                  strokeDasharray="32 18"
                  opacity="0.35"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="75"
                  fill="none"
                  stroke={sauce.accentColor}
                  strokeWidth="6"
                  strokeDasharray="24 14"
                  opacity="0.28"
                />
              </motion.g>
            ) : (
              <motion.circle
                key="olive-oil"
                cx="200"
                cy="200"
                r="134"
                fill="#E8D282"
                opacity="0.24"
                initial={{opacity: 0}}
                animate={{opacity: 0.24}}
              />
            )}
          </AnimatePresence>

          {/* Cheese Layer: Fior di Latte / Vegan Mozzarella */}
          <AnimatePresence>
            {(hasFior || hasVegan) && (
              <motion.g
                key={hasVegan ? 'vegana' : 'fior'}
                initial={{opacity: 0, scale: 0.92}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.25}}
                style={{transformOrigin: '200px 200px'}}
              >
                {cheeseBlobs.map((blob, i) => (
                  <ellipse
                    key={i}
                    cx={blob.x}
                    cy={blob.y}
                    rx={isBaked ? 26 * blob.scale : 21 * blob.scale}
                    ry={isBaked ? 20 * blob.scale : 16 * blob.scale}
                    transform={`rotate(${blob.rot} ${blob.x} ${blob.y})`}
                    fill={hasVegan ? '#F5ECD2' : '#FAF3DF'}
                    stroke={isBaked ? '#E7C88B' : '#EAE0C8'}
                    strokeWidth={isBaked ? '1.8' : '0.8'}
                    opacity="0.94"
                  />
                ))}
              </motion.g>
            )}
          </AnimatePresence>

          {/* Cheese Layer: Gorgonzola */}
          <AnimatePresence>
            {hasGorgonzola && (
              <motion.g
                key="gorgonzola"
                initial={{opacity: 0, scale: 0.85}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0}}
              >
                {gorgonzolaBlobs.map((b, i) => (
                  <g key={i} transform={`translate(${b.x}, ${b.y}) rotate(${b.rot})`}>
                    <ellipse cx="0" cy="0" rx="13" ry="9" fill="#EAE3CE" />
                    <path
                      d="M-5,-2 L2,1 M-1,3 L5,-1"
                      stroke="#5D746D"
                      strokeWidth="1.5"
                      opacity="0.7"
                    />
                  </g>
                ))}
              </motion.g>
            )}
          </AnimatePresence>

          {/* Cheese Layer: Goat Cheese Medallions */}
          <AnimatePresence>
            {hasCabra && (
              <motion.g
                key="cabra"
                initial={{opacity: 0, scale: 0.85}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0}}
              >
                {cabraMedallions.map((b, i) => (
                  <g key={i} transform={`translate(${b.x}, ${b.y})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r="13"
                      fill="#FAF6EB"
                      stroke={isBaked ? '#C88D44' : '#DFD5BF'}
                      strokeWidth="2"
                    />
                    {isBaked && <circle cx="0" cy="0" r="8" fill="#E8BE7A" opacity="0.4" />}
                  </g>
                ))}
              </motion.g>
            )}
          </AnimatePresence>

          {/* Toppings */}
          <AnimatePresence>
            {toppingLayers.map(({topping, coords}) => (
              <g key={topping.id}>
                {coords.map((c, idx) => (
                  <motion.g
                    key={`${topping.id}-${idx}`}
                    initial={{opacity: 0, scale: 0.4, y: -14}}
                    animate={{opacity: 1, scale: c.scale, y: 0}}
                    exit={{opacity: 0, scale: 0.4}}
                    transition={{
                      type: 'spring',
                      stiffness: 340,
                      damping: 22,
                      delay: Math.min(idx * 0.015, 0.16),
                    }}
                  >
                    <g transform={`translate(${c.x}, ${c.y}) rotate(${c.rot})`}>
                      {renderToppingPiece(topping.visualType, isBaked)}
                    </g>
                  </motion.g>
                ))}
              </g>
            ))}
          </AnimatePresence>

          {/* Parmigiano Shavings (Always on top of toppings) */}
          <AnimatePresence>
            {hasParmigiano && (
              <motion.g
                key="parmigiano"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
              >
                {parmigianoShards.map((b, i) => (
                  <polygon
                    key={i}
                    points="-7,-2 7,-4 4,4 -5,3"
                    transform={`translate(${b.x}, ${b.y}) rotate(${b.rot})`}
                    fill="#F3E5BD"
                    stroke="#D4BE85"
                    strokeWidth="0.6"
                    opacity="0.92"
                  />
                ))}
              </motion.g>
            )}
          </AnimatePresence>

          {/* Fresh Whole Central Burrata */}
          <AnimatePresence>
            {hasBurrata && (
              <motion.g
                key="burrata"
                initial={{scale: 0.4, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                exit={{scale: 0.4, opacity: 0}}
                transition={{type: 'spring', stiffness: 280, damping: 20}}
                style={{transformOrigin: '200px 200px'}}
              >
                <circle cx="202" cy="204" r="37" fill="rgba(24,24,27,0.18)" />
                <circle
                  cx="200"
                  cy="200"
                  r="36"
                  fill="url(#burrataGrad)"
                  stroke="#E0D6C3"
                  strokeWidth="1.4"
                />
                <path
                  d="M187,188 C195,193 205,193 213,188 M192,182 C197,186 203,186 208,182"
                  stroke="#D9CEB8"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="200" cy="200" r="4" fill="#EFE7D6" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Oven Steam Shimmer when Baked */}
          {isBaked && (
            <g opacity="0.45" pointerEvents="none">
              <motion.path
                d="M150,150 Q145,130 155,112"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                animate={{y: [-2, -10, -2], opacity: [0.15, 0.55, 0.15]}}
                transition={{repeat: Infinity, duration: 2.8, ease: 'easeInOut'}}
              />
              <motion.path
                d="M210,135 Q216,115 206,96"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                animate={{y: [-3, -12, -3], opacity: [0.2, 0.5, 0.2]}}
                transition={{repeat: Infinity, duration: 3.2, ease: 'easeInOut', delay: 0.6}}
              />
              <motion.path
                d="M252,168 Q247,148 256,130"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.2"
                strokeLinecap="round"
                animate={{y: [-2, -9, -2], opacity: [0.15, 0.45, 0.15]}}
                transition={{repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 1.1}}
              />
            </g>
          )}

          {/* Cut / Slice Overlay */}
          <AnimatePresence>
            {showSlices && config.cutId !== 'sin-cortar' && (
              <motion.g
                key={config.cutId}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                stroke="#18181B"
                strokeWidth="1.6"
                strokeDasharray="6 5"
                opacity="0.65"
                pointerEvents="none"
              >
                {config.cutId === '8-porciones' && (
                  <>
                    <line x1="200" y1="32" x2="200" y2="368" />
                    <line x1="32" y1="200" x2="368" y2="200" />
                    <line x1="81" y1="81" x2="319" y2="319" />
                    <line x1="319" y1="81" x2="81" y2="319" />
                  </>
                )}
                {config.cutId === '6-porciones' && (
                  <>
                    <line x1="200" y1="32" x2="200" y2="368" />
                    <line x1="54" y1="116" x2="346" y2="284" />
                    <line x1="346" y1="116" x2="54" y2="284" />
                  </>
                )}
                {config.cutId === 'cuadrado' && (
                  <>
                    <line x1="144" y1="42" x2="144" y2="358" />
                    <line x1="256" y1="42" x2="256" y2="358" />
                    <line x1="42" y1="144" x2="358" y2="144" />
                    <line x1="42" y1="256" x2="358" y2="256" />
                  </>
                )}
              </motion.g>
            )}
          </AnimatePresence>
        </motion.svg>
      </div>

      {/* Live 4-Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-[#E5E2DC]">
        <div>
          <p className="text-xs text-[#71717A]">Precio total</p>
          <p className="font-mono tabular-nums text-xl font-semibold text-[#18181B] mt-0.5">
            {formatEuro(metrics.price)}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#71717A]">Calorías</p>
          <p className="font-mono tabular-nums text-xl font-semibold text-[#18181B] mt-0.5">
            {metrics.calories}{' '}
            <span className="text-xs font-normal text-[#71717A]">kcal</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-[#71717A]">Por porción</p>
          <p className="font-mono tabular-nums text-xl font-semibold text-[#18181B] mt-0.5">
            {metrics.caloriesPerSlice}{' '}
            <span className="text-xs font-normal text-[#71717A]">kcal</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-[#71717A]">Horno · Peso</p>
          <p className="font-mono tabular-nums text-base font-semibold text-[#18181B] mt-1">
            {metrics.bakeSeconds} s · {metrics.weightGrams} g
          </p>
        </div>
      </div>

      {/* Macros & Allergens (Zero-pill clean inline text) */}
      <div className="mt-4 pt-4 border-t border-[#E5E2DC] space-y-2 text-xs text-[#52525B]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono tabular-nums">
            <span>Proteínas: {metrics.protein} g</span>
            <span aria-hidden="true">·</span>
            <span>Carbohidratos: {metrics.carbs} g</span>
            <span aria-hidden="true">·</span>
            <span>Grasas: {metrics.fat} g</span>
          </div>
          <span className="font-medium text-[#18181B]">{metrics.dietaryLabel}</span>
        </div>

        <p className="text-[#71717A]">
          Alérgenos:{' '}
          <span className="text-[#52525B]">
            {metrics.allergens.length > 0
              ? metrics.allergens.join(', ')
              : 'Sin alérgenos declarados'}
          </span>
        </p>
      </div>

      {/* Primary Action & Utilities */}
      <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <button
          type="button"
          onClick={onAddToCart}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#C83E2B] hover:bg-[#AD3221] active:scale-[0.99] text-white text-sm font-semibold transition-all whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C83E2B] focus-visible:ring-offset-2"
        >
          <ShoppingBag className="w-4 h-4" aria-hidden="true" />
          <span>{justAdded ? 'Añadida al pedido' : `Añadir al pedido · ${formatEuro(metrics.price)}`}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSaveModal}
            title="Guardar esta combinación"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl border border-[#E5E2DC] bg-white hover:bg-[#F8F7F4] text-[#18181B] text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
          >
            <BookmarkPlus className="w-4 h-4" aria-hidden="true" />
            <span>Guardar</span>
          </button>

          <button
            type="button"
            onClick={onRandomize}
            title="Combinación aleatoria del maestro pizzero"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl border border-[#E5E2DC] bg-white hover:bg-[#F8F7F4] text-[#18181B] text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
          >
            <Shuffle className="w-4 h-4" aria-hidden="true" />
            <span>Sorpresa</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            title="Reiniciar configuración"
            aria-label="Reiniciar configuración"
            className="inline-flex items-center justify-center p-3 rounded-xl border border-[#E5E2DC] bg-white hover:bg-[#F8F7F4] text-[#52525B] hover:text-[#18181B] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
