import hatchImg from "@/assets/car-hatch.jpg";
import sedanImg from "@/assets/car-sedan.jpg";
import pickupImg from "@/assets/car-pickup.jpg";
import suvImg from "@/assets/car-suv.jpg";
import evImg from "@/assets/car-ev.jpg";
import { slugify } from "./format";

export type Fuel = "Flex" | "Gasolina" | "Diesel" | "Elétrico" | "Híbrido";
export type Gearbox = "Manual" | "Automático" | "CVT";
export type Category = "SUV" | "Hatch" | "Sedan" | "Picape" | "Elétrico" | "Utilitário";
export type VehicleStatus = "rascunho" | "pendente" | "ativo" | "pausado" | "expirado" | "rejeitado";

export interface Seller {
  id: string;
  name: string;
  type: "particular" | "loja";
  city: string;
  state: string;
  rating: number;
  reviews: number;
  responseHours: number;
  verified?: boolean;
  logo?: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  price: number;
  km: number;
  fuel: Fuel;
  gearbox: Gearbox;
  color: string;
  doors: number;
  power: number;
  category: Category;
  city: string;
  state: string;
  description: string;
  images: string[];
  features: string[];
  seller: Seller;
  views: number;
  createdAt: string;
  highlighted?: boolean;
  isNew?: boolean;
  status: VehicleStatus;
}

export const BRANDS = ["Volkswagen", "Chevrolet", "Fiat", "Toyota", "Honda", "Hyundai", "Jeep", "Renault", "Ford", "BYD", "Nissan"];
export const STATES = ["SP", "RJ", "MG", "RS", "PR", "SC", "BA", "PE", "CE", "GO", "DF"];
export const CITIES: Record<string, string[]> = {
  SP: ["São Paulo", "Campinas", "Santos", "Ribeirão Preto"],
  RJ: ["Rio de Janeiro", "Niterói", "Petrópolis"],
  MG: ["Belo Horizonte", "Uberlândia", "Juiz de Fora"],
  RS: ["Porto Alegre", "Caxias do Sul"],
  PR: ["Curitiba", "Londrina"],
  SC: ["Florianópolis", "Joinville"],
  BA: ["Salvador"],
  PE: ["Recife"],
  CE: ["Fortaleza"],
  GO: ["Goiânia"],
  DF: ["Brasília"],
};
export const CATEGORIES: Category[] = ["SUV", "Hatch", "Sedan", "Picape", "Elétrico", "Utilitário"];
export const FUELS: Fuel[] = ["Flex", "Gasolina", "Diesel", "Elétrico", "Híbrido"];
export const GEARBOXES: Gearbox[] = ["Manual", "Automático", "CVT"];
export const COLORS = ["Branco", "Preto", "Prata", "Cinza", "Vermelho", "Azul"];

const IMG_BY_CAT: Record<Category, string> = {
  Hatch: hatchImg,
  Sedan: sedanImg,
  Picape: pickupImg,
  SUV: suvImg,
  Elétrico: evImg,
  Utilitário: pickupImg,
};

const SELLERS: Seller[] = [
  { id: "s1", name: "Premium Motors", type: "loja", city: "São Paulo", state: "SP", rating: 4.8, reviews: 312, responseHours: 2, verified: true },
  { id: "s2", name: "AutoBR Veículos", type: "loja", city: "Belo Horizonte", state: "MG", rating: 4.6, reviews: 187, responseHours: 4, verified: true },
  { id: "s3", name: "Carlos Mendes", type: "particular", city: "Campinas", state: "SP", rating: 4.9, reviews: 12, responseHours: 6 },
  { id: "s4", name: "Garagem do Rio", type: "loja", city: "Rio de Janeiro", state: "RJ", rating: 4.4, reviews: 95, responseHours: 3, verified: true },
  { id: "s5", name: "Mariana Souza", type: "particular", city: "Curitiba", state: "PR", rating: 4.7, reviews: 5, responseHours: 12 },
  { id: "s6", name: "EletroCar Brasil", type: "loja", city: "Brasília", state: "DF", rating: 4.9, reviews: 64, responseHours: 1, verified: true },
];

const FEATURES_POOL = [
  "Ar-condicionado", "Direção elétrica", "Vidros elétricos", "Travas elétricas",
  "Airbag duplo", "ABS", "Câmera de ré", "Sensor de estacionamento",
  "Multimídia", "CarPlay", "Android Auto", "Bancos em couro",
  "Rodas de liga leve", "Teto solar", "Controle de tração", "Piloto automático",
];

function seed(n: number) {
  // Deterministic pseudo-random
  let x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], n: number): T {
  return arr[Math.floor(seed(n) * arr.length)]!;
}

const MODELS: Record<string, { model: string; version: string; cat: Category }[]> = {
  Volkswagen: [
    { model: "Polo", version: "1.0 TSI Comfortline", cat: "Hatch" },
    { model: "T-Cross", version: "200 TSI Highline", cat: "SUV" },
    { model: "Nivus", version: "200 TSI Highline", cat: "SUV" },
    { model: "Virtus", version: "1.0 TSI Highline", cat: "Sedan" },
  ],
  Chevrolet: [
    { model: "Onix", version: "1.0 Turbo LTZ", cat: "Hatch" },
    { model: "Tracker", version: "1.2 Turbo Premier", cat: "SUV" },
    { model: "S10", version: "2.8 LTZ 4x4", cat: "Picape" },
  ],
  Fiat: [
    { model: "Pulse", version: "1.0 Turbo Impetus", cat: "SUV" },
    { model: "Toro", version: "Volcano 2.0 Diesel", cat: "Picape" },
    { model: "Argo", version: "1.3 Drive", cat: "Hatch" },
  ],
  Toyota: [
    { model: "Corolla", version: "2.0 XEi Flex", cat: "Sedan" },
    { model: "Hilux", version: "SRX 2.8 Diesel 4x4", cat: "Picape" },
    { model: "Corolla Cross", version: "2.0 XRE Híbrido", cat: "SUV" },
  ],
  Honda: [
    { model: "Civic", version: "1.5 Touring Turbo", cat: "Sedan" },
    { model: "HR-V", version: "1.5 EXL Turbo", cat: "SUV" },
    { model: "City", version: "1.5 EXL", cat: "Sedan" },
  ],
  Hyundai: [
    { model: "Creta", version: "1.0 Turbo Limited", cat: "SUV" },
    { model: "HB20", version: "1.0 Comfort Plus", cat: "Hatch" },
  ],
  Jeep: [
    { model: "Renegade", version: "1.3 Turbo Longitude", cat: "SUV" },
    { model: "Compass", version: "Limited T270", cat: "SUV" },
  ],
  Renault: [
    { model: "Kwid", version: "1.0 Outsider", cat: "Hatch" },
    { model: "Duster", version: "1.6 Iconic", cat: "SUV" },
  ],
  Ford: [{ model: "Ranger", version: "XLT 3.2 Diesel 4x4", cat: "Picape" }],
  BYD: [
    { model: "Dolphin", version: "Mini GS", cat: "Elétrico" },
    { model: "Yuan Plus", version: "EV Top", cat: "SUV" },
  ],
  Nissan: [{ model: "Kicks", version: "1.6 Advance", cat: "SUV" }],
};

function buildVehicles(count = 48): Vehicle[] {
  const out: Vehicle[] = [];
  const brandList = Object.keys(MODELS);
  for (let i = 0; i < count; i++) {
    const brand = brandList[i % brandList.length]!;
    const variants = MODELS[brand]!;
    const v = variants[i % variants.length]!;
    const year = 2018 + Math.floor(seed(i + 1) * 7); // 2018-2024
    const km = Math.floor(seed(i + 2) * 90000) + 5000;
    const basePrice = { Hatch: 75000, Sedan: 110000, SUV: 135000, Picape: 195000, Elétrico: 165000, Utilitário: 120000 }[v.cat];
    const price = Math.round((basePrice - (2024 - year) * 8000 + seed(i + 3) * 20000) / 500) * 500;
    const seller = SELLERS[i % SELLERS.length]!;
    const id = `v${i + 1}`;
    out.push({
      id,
      brand,
      model: v.model,
      version: v.version,
      year,
      price: Math.max(35000, price),
      km,
      fuel: v.cat === "Elétrico" ? "Elétrico" : pick(["Flex", "Flex", "Gasolina", "Diesel", "Híbrido"], i + 4),
      gearbox: pick(GEARBOXES, i + 5),
      color: pick(COLORS, i + 6),
      doors: 4,
      power: 80 + Math.floor(seed(i + 7) * 200),
      category: v.cat,
      city: seller.city,
      state: seller.state,
      description: `${brand} ${v.model} ${v.version} ${year}, em excelente estado de conservação. Único dono, todas as revisões em concessionária, IPVA pago. Aceita troca e financiamento.`,
      images: [IMG_BY_CAT[v.cat], IMG_BY_CAT[v.cat], IMG_BY_CAT[v.cat]],
      features: FEATURES_POOL.filter((_, k) => seed(i * 17 + k) > 0.45),
      seller,
      views: Math.floor(seed(i + 8) * 1200) + 80,
      createdAt: new Date(Date.now() - Math.floor(seed(i + 9) * 60) * 86400000).toISOString(),
      highlighted: seed(i + 10) > 0.78,
      isNew: seed(i + 11) > 0.85,
      status: "ativo",
    });
  }
  return out;
}

export const VEHICLES: Vehicle[] = buildVehicles();

export const vehicleSlug = (v: Vehicle) =>
  `${slugify(v.brand)}-${slugify(v.model)}-${v.year}-${v.id}`;

export function findVehicleBySlug(slug: string): Vehicle | undefined {
  const id = slug.split("-").pop();
  return VEHICLES.find((v) => v.id === id);
}

export function similarVehicles(v: Vehicle, n = 4): Vehicle[] {
  return VEHICLES.filter(
    (x) => x.id !== v.id && x.category === v.category && Math.abs(x.price - v.price) < 40000,
  ).slice(0, n);
}

// Mock leads/messages/reviews
export interface MockLead {
  id: string;
  vehicleId: string;
  buyerName: string;
  type: "mensagem" | "ligacao" | "interesse";
  status: "novo" | "em_contato" | "convertido" | "perdido";
  createdAt: string;
  preview: string;
}

export const MOCK_LEADS: MockLead[] = [
  { id: "l1", vehicleId: "v1", buyerName: "Ana Paula", type: "mensagem", status: "novo", createdAt: "2024-12-10", preview: "Oi! Ainda está disponível? Aceita troca em um Onix 2020?" },
  { id: "l2", vehicleId: "v2", buyerName: "Roberto Lima", type: "ligacao", status: "em_contato", createdAt: "2024-12-09", preview: "Solicitou ligação para 14h." },
  { id: "l3", vehicleId: "v1", buyerName: "Marcelo Reis", type: "interesse", status: "convertido", createdAt: "2024-12-05", preview: "Negócio fechado." },
  { id: "l4", vehicleId: "v3", buyerName: "Júlia Castro", type: "mensagem", status: "novo", createdAt: "2024-12-11", preview: "Pode me enviar mais fotos do interior?" },
];

export const MOCK_KPIS = {
  totalUsers: 28412,
  newUsers30d: 1342,
  totalAds: 7831,
  activeAds: 6920,
  pendingAds: 412,
  rejectedAds: 88,
};

export interface MockMessage { text: string; mine: boolean; time: string; }
export interface MockConversation {
  id: string;
  with: string;
  vehicle: string;
  preview: string;
  time: string;
  unread: boolean;
  messages: MockMessage[];
}

export const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: "c1", with: "Ana Paula", vehicle: "Toyota Corolla 2022", preview: "Aceita troca em um Onix 2020?",
    time: "14:22", unread: true,
    messages: [
      { text: "Olá! O carro ainda está disponível?", mine: false, time: "14:10" },
      { text: "Sim! Disponível para visita.", mine: true, time: "14:15" },
      { text: "Aceita troca em um Onix 2020?", mine: false, time: "14:22" },
    ],
  },
  {
    id: "c2", with: "Roberto Lima", vehicle: "VW T-Cross 2023", preview: "Posso agendar test drive sábado?",
    time: "10:48", unread: true,
    messages: [
      { text: "Boa tarde, posso agendar test drive sábado?", mine: false, time: "10:48" },
    ],
  },
  {
    id: "c3", with: "Júlia Castro", vehicle: "Fiat Pulse 2022", preview: "Obrigada pelas fotos!",
    time: "Ontem", unread: false,
    messages: [
      { text: "Pode enviar mais fotos do interior?", mine: false, time: "Ontem" },
      { text: "Acabei de enviar por aqui.", mine: true, time: "Ontem" },
      { text: "Obrigada pelas fotos!", mine: false, time: "Ontem" },
    ],
  },
];