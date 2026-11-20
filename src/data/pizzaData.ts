export type SizeId = 'mediana' | 'grande' | 'familiar';
export type DoughId =
  | 'napoletana'
  | 'espelta'
  | 'carbon'
  | 'sin-gluten'
  | 'romana';
export type SauceId =
  | 'san-marzano'
  | 'trufa'
  | 'pesto'
  | 'bianca'
  | 'barbacoa'
  | 'sin-salsa';
export type CheeseId =
  | 'fior-di-latte'
  | 'burrata'
  | 'gorgonzola'
  | 'parmigiano'
  | 'cabra'
  | 'vegana';
export type ToppingCategory = 'huerta' | 'carnes' | 'final';
export type BakeId = 'clasica' | 'crujiente' | 'suave';
export type CutId = '8-porciones' | '6-porciones' | 'cuadrado' | 'sin-cortar';

export interface PizzaSize {
  id: SizeId;
  name: string;
  diameterCm: number;
  slicesDefault: number;
  multiplier: number;
  basePrice: number;
  description: string;
}

export interface DoughOption {
  id: DoughId;
  name: string;
  subtitle: string;
  hydration: number;
  fermentationHours: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  weightGrams: number;
  priceDelta: number;
  bakeSeconds: number;
  ovenTempC: number;
  crustColorRaw: string;
  crustColorBaked: string;
  charIntensity: number;
  allergens: string[];
  glutenFree: boolean;
  digestibilityNote: string;
}

export interface SauceOption {
  id: SauceId;
  name: string;
  origin: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  weightGrams: number;
  price: number;
  color: string;
  accentColor: string;
  allergens: string[];
  vegan: boolean;
}

export interface CheeseOption {
  id: CheeseId;
  name: string;
  origin: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  weightGrams: number;
  price: number;
  color: string;
  isWholeCenter?: boolean;
  allergens: string[];
  vegan: boolean;
}

export interface ToppingOption {
  id: string;
  name: string;
  category: ToppingCategory;
  note: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  weightGrams: number;
  price: number;
  allergens: string[];
  vegan: boolean;
  vegetarian: boolean;
  visualType:
    | 'pepperoni'
    | 'jamon'
    | 'guanciale'
    | 'pollo'
    | 'champinon'
    | 'cebolla'
    | 'alcachofa'
    | 'aceituna'
    | 'cherry'
    | 'pimiento'
    | 'rucula'
    | 'albahaca'
    | 'chile'
    | 'pinones'
    | 'miel';
  swatchColor: string;
}

export interface SelectedTopping {
  id: string;
  double: boolean;
}

export interface PizzaConfig {
  sizeId: SizeId;
  doughId: DoughId;
  sauceId: SauceId;
  cheeseIds: CheeseId[];
  toppings: SelectedTopping[];
  bakeId: BakeId;
  cutId: CutId;
}

export interface SignaturePreset {
  id: string;
  name: string;
  kicker: string;
  description: string;
  image: string;
  config: PizzaConfig;
}

export interface SavedPizza {
  id: string;
  name: string;
  createdAt: string;
  config: PizzaConfig;
}

export interface CartItem {
  id: string;
  name: string;
  config: PizzaConfig;
  quantity: number;
}

export const SIZES: PizzaSize[] = [
  {
    id: 'mediana',
    name: 'Mediana',
    diameterCm: 30,
    slicesDefault: 6,
    multiplier: 1,
    basePrice: 9.5,
    description: 'Ideal para 1 persona',
  },
  {
    id: 'grande',
    name: 'Grande',
    diameterCm: 36,
    slicesDefault: 8,
    multiplier: 1.35,
    basePrice: 12.5,
    description: 'Para compartir entre 2',
  },
  {
    id: 'familiar',
    name: 'Familiar',
    diameterCm: 42,
    slicesDefault: 10,
    multiplier: 1.7,
    basePrice: 15.9,
    description: 'Mesa para 3 o 4 personas',
  },
];

export const DOUGHS: DoughOption[] = [
  {
    id: 'napoletana',
    name: 'Napoletana Clásica 72h',
    subtitle: 'Harina Tipo 00 · Borde aireado y alveolado',
    hydration: 68,
    fermentationHours: 72,
    calories: 560,
    protein: 19,
    carbs: 112,
    fat: 3,
    weightGrams: 260,
    priceDelta: 0,
    bakeSeconds: 90,
    ovenTempC: 450,
    crustColorRaw: '#F2E5CE',
    crustColorBaked: '#D9A76A',
    charIntensity: 0.85,
    allergens: ['Gluten'],
    glutenFree: false,
    digestibilityNote: 'Fermentación lenta en frío de 72 horas para una digestión ligera.',
  },
  {
    id: 'espelta',
    name: 'Integral de Espelta',
    subtitle: 'Molida a la piedra · Notas tostadas de cereal',
    hydration: 72,
    fermentationHours: 48,
    calories: 525,
    protein: 22,
    carbs: 98,
    fat: 5,
    weightGrams: 265,
    priceDelta: 1.6,
    bakeSeconds: 105,
    ovenTempC: 430,
    crustColorRaw: '#D9C3A3',
    crustColorBaked: '#B6834D',
    charIntensity: 0.75,
    allergens: ['Gluten'],
    glutenFree: false,
    digestibilityNote: 'Rica en fibra natural y minerales de grano entero ecológico.',
  },
  {
    id: 'romana',
    name: 'Romana Scrocchiarella',
    subtitle: 'Estirada fina · Extra crujiente de borde a centro',
    hydration: 58,
    fermentationHours: 36,
    calories: 495,
    protein: 17,
    carbs: 96,
    fat: 4,
    weightGrams: 220,
    priceDelta: 0.9,
    bakeSeconds: 130,
    ovenTempC: 390,
    crustColorRaw: '#F4E9D5',
    crustColorBaked: '#CFA063',
    charIntensity: 0.45,
    allergens: ['Gluten'],
    glutenFree: false,
    digestibilityNote: 'Textura firme que sostiene ingredientes jugosos sin doblarse.',
  },
  {
    id: 'carbon',
    name: 'Carbón Vegetal Activo',
    subtitle: 'Masa negra de sémola · Aroma sutil a leña',
    hydration: 66,
    fermentationHours: 48,
    calories: 540,
    protein: 18,
    carbs: 106,
    fat: 4,
    weightGrams: 255,
    priceDelta: 2.2,
    bakeSeconds: 95,
    ovenTempC: 445,
    crustColorRaw: '#4A4947',
    crustColorBaked: '#292826',
    charIntensity: 0.3,
    allergens: ['Gluten'],
    glutenFree: false,
    digestibilityNote: 'Carbón activo de coco con propiedades digestivas suaves.',
  },
  {
    id: 'sin-gluten',
    name: 'Masa Madre Sin Gluten',
    subtitle: 'Trigo sarraceno, arroz y yuca · Horneado separado',
    hydration: 74,
    fermentationHours: 24,
    calories: 510,
    protein: 11,
    carbs: 104,
    fat: 6,
    weightGrams: 250,
    priceDelta: 2.8,
    bakeSeconds: 120,
    ovenTempC: 400,
    crustColorRaw: '#EDE2CE',
    crustColorBaked: '#CCA26D',
    charIntensity: 0.4,
    allergens: [],
    glutenFree: true,
    digestibilityNote: 'Preparada en obrador libre de trazas de trigo.',
  },
];

export const SAUCES: SauceOption[] = [
  {
    id: 'san-marzano',
    name: 'Tomate San Marzano DOP',
    origin: 'Triturado a mano · Albahaca y sal marina',
    calories: 48,
    protein: 2,
    carbs: 8,
    fat: 1,
    weightGrams: 90,
    price: 0,
    color: '#B83227',
    accentColor: '#912219',
    allergens: [],
    vegan: true,
  },
  {
    id: 'trufa',
    name: 'Crema de Trufa Negra',
    origin: 'Tuber melanosporum · Mascarpone ligero',
    calories: 165,
    protein: 4,
    carbs: 5,
    fat: 14,
    weightGrams: 75,
    price: 2.6,
    color: '#D8CDBF',
    accentColor: '#5B4E42',
    allergens: ['Lácteos'],
    vegan: false,
  },
  {
    id: 'pesto',
    name: 'Pesto Genovese',
    origin: 'Albahaca fresca, piñones y aceite virgen extra',
    calories: 210,
    protein: 4,
    carbs: 3,
    fat: 20,
    weightGrams: 65,
    price: 1.8,
    color: '#4E7334',
    accentColor: '#365222',
    allergens: ['Frutos secos', 'Lácteos'],
    vegan: false,
  },
  {
    id: 'bianca',
    name: 'Bianca de Ajo Asado',
    origin: 'Nata fresca reducida, ajo confitado y tomillo',
    calories: 145,
    protein: 3,
    carbs: 6,
    fat: 12,
    weightGrams: 70,
    price: 1.4,
    color: '#EFE7D6',
    accentColor: '#CBBFA6',
    allergens: ['Lácteos'],
    vegan: false,
  },
  {
    id: 'barbacoa',
    name: 'Barbacoa de Roble',
    origin: 'Reducción lenta con melaza, chipotle y tomate',
    calories: 112,
    protein: 1,
    carbs: 24,
    fat: 1,
    weightGrams: 80,
    price: 1.2,
    color: '#63281D',
    accentColor: '#421810',
    allergens: ['Mostaza'],
    vegan: true,
  },
  {
    id: 'sin-salsa',
    name: 'Focaccia Blanca (Sin salsa)',
    origin: 'Solo aceite de oliva virgen extra y flor de sal',
    calories: 65,
    protein: 0,
    carbs: 0,
    fat: 7,
    weightGrams: 10,
    price: 0,
    color: 'transparent',
    accentColor: '#D6B85A',
    allergens: [],
    vegan: true,
  },
];

export const CHEESES: CheeseOption[] = [
  {
    id: 'fior-di-latte',
    name: 'Mozzarella Fior di Latte',
    origin: 'Campania · Fundido elástico y lácteo suave',
    calories: 230,
    protein: 17,
    carbs: 2,
    fat: 17,
    weightGrams: 95,
    price: 0,
    color: '#FAF4E4',
    allergens: ['Lácteos'],
    vegan: false,
  },
  {
    id: 'burrata',
    name: 'Burrata Fresca Entera',
    origin: 'Puglia · Servida entera tras salir del horno',
    calories: 295,
    protein: 15,
    carbs: 3,
    fat: 25,
    weightGrams: 125,
    price: 3.9,
    color: '#FFFDF8',
    isWholeCenter: true,
    allergens: ['Lácteos'],
    vegan: false,
  },
  {
    id: 'gorgonzola',
    name: 'Gorgonzola Dolce DOP',
    origin: 'Piamonte · Cremoso con vetas azules suaves',
    calories: 185,
    protein: 11,
    carbs: 1,
    fat: 15,
    weightGrams: 55,
    price: 2.1,
    color: '#EDE7D4',
    allergens: ['Lácteos'],
    vegan: false,
  },
  {
    id: 'parmigiano',
    name: 'Parmigiano Reggiano 24m',
    origin: 'Emilia-Romaña · Lascas curadas umami',
    calories: 140,
    protein: 12,
    carbs: 0,
    fat: 10,
    weightGrams: 35,
    price: 1.9,
    color: '#EBD9A7',
    allergens: ['Lácteos'],
    vegan: false,
  },
  {
    id: 'cabra',
    name: 'Rulo de Cabra Artesanal',
    origin: 'Medallones gratinados con toque ácido',
    calories: 175,
    protein: 11,
    carbs: 1,
    fat: 14,
    weightGrams: 60,
    price: 2.2,
    color: '#F5EFE2',
    allergens: ['Lácteos'],
    vegan: false,
  },
  {
    id: 'vegana',
    name: 'Mozzarella de Anacardos',
    origin: '100% vegetal · Fermentada con probióticos',
    calories: 190,
    protein: 6,
    carbs: 7,
    fat: 15,
    weightGrams: 85,
    price: 2.4,
    color: '#F4EDD8',
    allergens: ['Frutos secos'],
    vegan: true,
  },
];

export const TOPPINGS: ToppingOption[] = [
  // Curados y Carnes
  {
    id: 'pepperoni',
    name: 'Pepperoni Crujiente',
    category: 'carnes',
    note: 'Rodajas finas ligeramente picantes que se abarquillan al horno',
    calories: 175,
    protein: 9,
    carbs: 1,
    fat: 15,
    weightGrams: 45,
    price: 2.2,
    allergens: [],
    vegan: false,
    vegetarian: false,
    visualType: 'pepperoni',
    swatchColor: '#A93226',
  },
  {
    id: 'jamon-iberico',
    name: 'Jamón Ibérico de Bellota',
    category: 'carnes',
    note: 'Cortado a cuchillo y añadido tras el horneado',
    calories: 135,
    protein: 14,
    carbs: 0,
    fat: 9,
    weightGrams: 45,
    price: 4.5,
    allergens: [],
    vegan: false,
    vegetarian: false,
    visualType: 'jamon',
    swatchColor: '#9E4244',
  },
  {
    id: 'guanciale',
    name: 'Guanciale Curado',
    category: 'carnes',
    note: 'Papada italiana curada con pimienta negra',
    calories: 215,
    protein: 6,
    carbs: 0,
    fat: 21,
    weightGrams: 40,
    price: 2.8,
    allergens: [],
    vegan: false,
    vegetarian: false,
    visualType: 'guanciale',
    swatchColor: '#C47D75',
  },
  {
    id: 'pollo-braseado',
    name: 'Pollo Braseado al Romero',
    category: 'carnes',
    note: 'Pechuga marinada deshilachada al horno de leña',
    calories: 95,
    protein: 17,
    carbs: 1,
    fat: 3,
    weightGrams: 60,
    price: 2.4,
    allergens: [],
    vegan: false,
    vegetarian: false,
    visualType: 'pollo',
    swatchColor: '#D6B88C',
  },
  // Huerta
  {
    id: 'champinon',
    name: 'Champiñón Portobello',
    category: 'huerta',
    note: 'Laminado fresco y asado con tomillo limonero',
    calories: 22,
    protein: 2,
    carbs: 3,
    fat: 0,
    weightGrams: 65,
    price: 1.4,
    allergens: [],
    vegan: true,
    vegetarian: true,
    visualType: 'champinon',
    swatchColor: '#8C7462',
  },
  {
    id: 'cebolla',
    name: 'Cebolla Roja Caramelizada',
    category: 'huerta',
    note: 'Pochada lentamente con vinagre balsámico de Módena',
    calories: 58,
    protein: 1,
    carbs: 12,
    fat: 1,
    weightGrams: 50,
    price: 1.3,
    allergens: [],
    vegan: true,
    vegetarian: true,
    visualType: 'cebolla',
    swatchColor: '#7A3E5D',
  },
  {
    id: 'alcachofa',
    name: 'Corazones de Alcachofa',
    category: 'huerta',
    note: 'Braseados a la brasa con limón y hierbas',
    calories: 38,
    protein: 2,
    carbs: 6,
    fat: 1,
    weightGrams: 60,
    price: 2.1,
    allergens: [],
    vegan: true,
    vegetarian: true,
    visualType: 'alcachofa',
    swatchColor: '#8D9B5E',
  },
  {
    id: 'aceituna',
    name: 'Aceitunas Kalamata',
    category: 'huerta',
    note: 'Deshuesadas, sabor intenso y salino mediterráneo',
    calories: 65,
    protein: 1,
    carbs: 2,
    fat: 6,
    weightGrams: 35,
    price: 1.4,
    allergens: [],
    vegan: true,
    vegetarian: true,
    visualType: 'aceituna',
    swatchColor: '#4A2B3D',
  },
  {
    id: 'cherry',
    name: 'Tomates Cherry Confitados',
    category: 'huerta',
    note: 'Dulces y jugosos, ligeramente ampollados por la llama',
    calories: 24,
    protein: 1,
    carbs: 5,
    fat: 0,
    weightGrams: 60,
    price: 1.5,
    allergens: [],
    vegan: true,
    vegetarian: true,
    visualType: 'cherry',
    swatchColor: '#D94336',
  },
  {
    id: 'pimiento',
    name: 'Pimiento Rojo Asado',
    category: 'huerta',
    note: 'Asado directamente sobre las brasas de encina',
    calories: 26,
    protein: 1,
    carbs: 5,
    fat: 0,
    weightGrams: 55,
    price: 1.3,
    allergens: [],
    vegan: true,
    vegetarian: true,
    visualType: 'pimiento',
    swatchColor: '#C84B2F',
  },
  // Toque final
  {
    id: 'albahaca',
    name: 'Albahaca Fresca Viva',
    category: 'final',
    note: 'Hojas enteras seleccionadas al momento de servir',
    calories: 4,
    protein: 0,
    carbs: 1,
    fat: 0,
    weightGrams: 10,
    price: 0.7,
    allergens: [],
    vegan: true,
    vegetarian: true,
    visualType: 'albahaca',
    swatchColor: '#3F6E31',
  },
  {
    id: 'rucula',
    name: 'Rúcula Salvaje',
    category: 'final',
    note: 'Toque fresco y ligeramente picante en crudo',
    calories: 8,
    protein: 1,
    carbs: 1,
    fat: 0,
    weightGrams: 25,
    price: 1.1,
    allergens: [],
    vegan: true,
    vegetarian: true,
    visualType: 'rucula',
    swatchColor: '#4E7E39',
  },
  {
    id: 'chile',
    name: 'Guindilla Calabresa y Aceite',
    category: 'final',
    note: 'Rodajas frescas y aceite infusionado de Calabria',
    calories: 55,
    protein: 0,
    carbs: 1,
    fat: 6,
    weightGrams: 12,
    price: 1.1,
    allergens: [],
    vegan: true,
    vegetarian: true,
    visualType: 'chile',
    swatchColor: '#C8281D',
  },
  {
    id: 'pinones',
    name: 'Piñones Tostados',
    category: 'final',
    note: 'Tostados al minuto para aportar textura crujiente',
    calories: 115,
    protein: 3,
    carbs: 2,
    fat: 11,
    weightGrams: 18,
    price: 2.0,
    allergens: ['Frutos secos'],
    vegan: true,
    vegetarian: true,
    visualType: 'pinones',
    swatchColor: '#E5CE9E',
  },
  {
    id: 'miel',
    name: 'Miel Picante de Romero',
    category: 'final',
    note: 'Hilo dorado artesanal perfecto para contrastes salados',
    calories: 64,
    protein: 0,
    carbs: 17,
    fat: 0,
    weightGrams: 20,
    price: 1.5,
    allergens: [],
    vegan: false,
    vegetarian: true,
    visualType: 'miel',
    swatchColor: '#D99B26',
  },
];

export const BAKE_LEVELS: {
  id: BakeId;
  name: string;
  description: string;
  timeDeltaSec: number;
}[] = [
  {
    id: 'suave',
    name: 'Punto Tierno',
    description: 'Borde dorado suave, centro muy jugoso',
    timeDeltaSec: -10,
  },
  {
    id: 'clasica',
    name: 'Clásica Napoletana',
    description: 'Leopardado característico a 450 °C',
    timeDeltaSec: 0,
  },
  {
    id: 'crujiente',
    name: 'Bien Tostada',
    description: 'Mayor tiempo en piedra para base extra firme',
    timeDeltaSec: 20,
  },
];

export const CUT_STYLES: {
  id: CutId;
  name: string;
  slicesCount: number;
}[] = [
  {id: '8-porciones', name: '8 porciones clásicas', slicesCount: 8},
  {id: '6-porciones', name: '6 porciones amplias', slicesCount: 6},
  {id: 'cuadrado', name: 'Corte romano (cuadrados)', slicesCount: 9},
  {id: 'sin-cortar', name: 'Entera sin cortar', slicesCount: 1},
];

export const DEFAULT_PIZZA_CONFIG: PizzaConfig = {
  sizeId: 'grande',
  doughId: 'napoletana',
  sauceId: 'san-marzano',
  cheeseIds: ['fior-di-latte'],
  toppings: [
    {id: 'pepperoni', double: false},
    {id: 'albahaca', double: false},
  ],
  bakeId: 'clasica',
  cutId: '8-porciones',
};

export const SIGNATURE_PRESETS: SignaturePreset[] = [
  {
    id: 'diavola-brava',
    name: 'Diavola Brava',
    kicker: 'Picante · Clásica a la leña',
    description:
      'Masa madre de 72 h, tomate San Marzano DOP, fior di latte, doble pepperoni crujiente, guindilla calabresa y albahaca viva.',
    image: '/src/assets/images/preset_diavola_brava_1795128660014.jpg',
    config: {
      sizeId: 'grande',
      doughId: 'napoletana',
      sauceId: 'san-marzano',
      cheeseIds: ['fior-di-latte'],
      toppings: [
        {id: 'pepperoni', double: true},
        {id: 'chile', double: false},
        {id: 'albahaca', double: false},
      ],
      bakeId: 'clasica',
      cutId: '8-porciones',
    },
  },
  {
    id: 'tartufo-bianco',
    name: 'Tartufo Bianco',
    kicker: 'Aromática · Sin tomate',
    description:
      'Crema de trufa negra Tuber melanosporum, portobello asado al tomillo, fior di latte y lascas de Parmigiano Reggiano 24 meses.',
    image: '/src/assets/images/preset_tartufo_bianco_1795128659485.jpg',
    config: {
      sizeId: 'grande',
      doughId: 'napoletana',
      sauceId: 'trufa',
      cheeseIds: ['fior-di-latte', 'parmigiano'],
      toppings: [{id: 'champinon', double: true}],
      bakeId: 'clasica',
      cutId: '8-porciones',
    },
  },
  {
    id: 'iberica-burrata',
    name: 'Ibérica & Burrata',
    kicker: 'De autor · Acabado en fresco',
    description:
      'Burrata fresca entera servida al salir del horno sobre tomate San Marzano, jamón ibérico de bellota, cherry confitados y rúcula.',
    image: '/src/assets/images/preset_iberica_burrata_1795128659041.jpg',
    config: {
      sizeId: 'grande',
      doughId: 'napoletana',
      sauceId: 'san-marzano',
      cheeseIds: ['fior-di-latte', 'burrata'],
      toppings: [
        {id: 'jamon-iberico', double: false},
        {id: 'cherry', double: false},
        {id: 'rucula', double: false},
      ],
      bakeId: 'clasica',
      cutId: '6-porciones',
    },
  },
  {
    id: 'huerta-genovese',
    name: 'Huerta Genovese',
    kicker: 'Vegetariana · Masa de espelta',
    description:
      'Masa integral de espelta ecológica con pesto genovese, corazones de alcachofa braseados, aceitunas Kalamata, cebolla caramelizada y piñones.',
    image: '/src/assets/images/preset_huerta_genovese_1795128658613.jpg',
    config: {
      sizeId: 'grande',
      doughId: 'espelta',
      sauceId: 'pesto',
      cheeseIds: ['fior-di-latte'],
      toppings: [
        {id: 'alcachofa', double: false},
        {id: 'aceituna', double: false},
        {id: 'cebolla', double: false},
        {id: 'pinones', double: false},
      ],
      bakeId: 'crujiente',
      cutId: '8-porciones',
    },
  },
];

export interface PizzaMetrics {
  price: number;
  calories: number;
  caloriesPerSlice: number;
  slicesCount: number;
  protein: number;
  carbs: number;
  fat: number;
  weightGrams: number;
  bakeSeconds: number;
  ovenTempC: number;
  allergens: string[];
  dietaryLabel: string;
}

export function calculatePizzaMetrics(config: PizzaConfig): PizzaMetrics {
  const size = SIZES.find((s) => s.id === config.sizeId) ?? SIZES[1];
  const dough = DOUGHS.find((d) => d.id === config.doughId) ?? DOUGHS[0];
  const sauce = SAUCES.find((s) => s.id === config.sauceId) ?? SAUCES[0];
  const bake = BAKE_LEVELS.find((b) => b.id === config.bakeId) ?? BAKE_LEVELS[1];
  const cut = CUT_STYLES.find((c) => c.id === config.cutId) ?? CUT_STYLES[0];

  const cheeses = config.cheeseIds
    .map((id) => CHEESES.find((c) => c.id === id))
    .filter((c): c is CheeseOption => Boolean(c));

  const m = size.multiplier;

  let price = size.basePrice + dough.priceDelta + sauce.price;
  let calories = dough.calories * m + sauce.calories * m;
  let protein = dough.protein * m + sauce.protein * m;
  let carbs = dough.carbs * m + sauce.carbs * m;
  let fat = dough.fat * m + sauce.fat * m;
  let weightGrams = dough.weightGrams * m + sauce.weightGrams * m;

  const allergenSet = new Set<string>(dough.allergens);
  sauce.allergens.forEach((a) => allergenSet.add(a));

  let isVegan = sauce.vegan;
  let isVegetarian = true;

  cheeses.forEach((cheese) => {
    price += cheese.price * (size.id === 'familiar' ? 1.25 : 1);
    calories += cheese.calories * m;
    protein += cheese.protein * m;
    carbs += cheese.carbs * m;
    fat += cheese.fat * m;
    weightGrams += cheese.weightGrams * m;
    cheese.allergens.forEach((a) => allergenSet.add(a));
    if (!cheese.vegan) isVegan = false;
  });

  config.toppings.forEach((sel) => {
    const t = TOPPINGS.find((item) => item.id === sel.id);
    if (!t) return;
    const qty = sel.double ? 1.8 : 1;
    const sizePriceFactor = size.id === 'familiar' ? 1.2 : 1;
    price += t.price * qty * sizePriceFactor;
    calories += t.calories * qty * m;
    protein += t.protein * qty * m;
    carbs += t.carbs * qty * m;
    fat += t.fat * qty * m;
    weightGrams += t.weightGrams * qty * m;
    t.allergens.forEach((a) => allergenSet.add(a));
    if (!t.vegan) isVegan = false;
    if (!t.vegetarian) isVegetarian = false;
  });

  const roundedCalories = Math.round(calories);
  const slicesCount = cut.slicesCount;
  const caloriesPerSlice = Math.round(roundedCalories / slicesCount);

  let dietaryLabel = 'Tradicional';
  if (isVegan && dough.glutenFree) {
    dietaryLabel = 'Vegana · Sin gluten';
  } else if (isVegan) {
    dietaryLabel = '100% Vegana';
  } else if (isVegetarian && dough.glutenFree) {
    dietaryLabel = 'Vegetariana · Sin gluten';
  } else if (isVegetarian) {
    dietaryLabel = 'Vegetariana';
  } else if (dough.glutenFree) {
    dietaryLabel = 'Sin gluten';
  }

  return {
    price: Math.round(price * 100) / 100,
    calories: roundedCalories,
    caloriesPerSlice,
    slicesCount,
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    weightGrams: Math.round(weightGrams),
    bakeSeconds: Math.max(60, dough.bakeSeconds + bake.timeDeltaSec),
    ovenTempC: dough.ovenTempC,
    allergens: Array.from(allergenSet),
    dietaryLabel,
  };
}

export function formatEuro(value: number): string {
  return value.toFixed(2).replace('.', ',') + ' €';
}

export function describePizzaSummary(config: PizzaConfig): string {
  const size = SIZES.find((s) => s.id === config.sizeId);
  const dough = DOUGHS.find((d) => d.id === config.doughId);
  const sauce = SAUCES.find((s) => s.id === config.sauceId);
  const cheeseNames = config.cheeseIds
    .map((id) => CHEESES.find((c) => c.id === id)?.name)
    .filter(Boolean);
  const toppingNames = config.toppings
    .map((sel) => {
      const t = TOPPINGS.find((item) => item.id === sel.id);
      if (!t) return null;
      return sel.double ? `${t.name} (×2)` : t.name;
    })
    .filter(Boolean);

  const parts = [
    `${size?.name ?? 'Grande'} (${size?.diameterCm ?? 36} cm)`,
    dough?.name,
    sauce?.name,
    cheeseNames.length > 0 ? cheeseNames.join(', ') : 'Sin queso',
  ];

  if (toppingNames.length > 0) {
    parts.push(toppingNames.join(', '));
  }

  return parts.filter(Boolean).join(' · ');
}

export function generateChefSurprise(): PizzaConfig {
  const randomItem = <T,>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

  const dough = randomItem(DOUGHS);
  const sauce = randomItem(SAUCES.filter((s) => s.id !== 'sin-salsa'));
  const primaryCheese = randomItem(CHEESES.filter((c) => c.id !== 'burrata'));
  const includeExtraCheese = Math.random() > 0.55;
  const secondaryCheese = randomItem(
    CHEESES.filter((c) => c.id !== primaryCheese.id && c.id !== 'vegana'),
  );

  const shuffledToppings = [...TOPPINGS].sort(() => Math.random() - 0.5);
  const count = 3 + Math.floor(Math.random() * 2);
  const pickedToppings = shuffledToppings.slice(0, count).map((t, idx) => ({
    id: t.id,
    double: idx === 0 && Math.random() > 0.65,
  }));

  return {
    sizeId: randomItem(['mediana', 'grande', 'familiar'] as SizeId[]),
    doughId: dough.id,
    sauceId: sauce.id,
    cheeseIds: includeExtraCheese
      ? [primaryCheese.id, secondaryCheese.id]
      : [primaryCheese.id],
    toppings: pickedToppings,
    bakeId: randomItem(['clasica', 'crujiente'] as BakeId[]),
    cutId: randomItem(['8-porciones', '6-porciones'] as CutId[]),
  };
}
