// One product, four trades. What changes between a barbershop, a
// workshop, a store and a food place is the wording, not the shape —
// so the wording lives here and nowhere else. A fifth trade is one
// more entry in this file, not a new branch in every screen.
//
// Identifiers are English; the copy is Spanish because the shop owner
// reading it is Mexican.

export type Trade = "barbershop" | "workshop" | "store" | "food";
export type EntryKind = "sale" | "appointment" | "job" | "order";

export type Vocabulary = {
  business: string;
  accent: string;
  kind: EntryKind;
  action: string;          // the big button
  oneThing: string;        // "un corte"
  todayHeading: string;
  whoServed: string;
  sampleDescription: string;
  sampleAmount: string;
};

export const TRADES: Record<Trade, Vocabulary> = {
  barbershop: {
    business: "Barbería",
    accent: "#2F4BE0",
    kind: "sale",
    action: "Cobrar un corte",
    oneThing: "un corte",
    todayHeading: "Cortes de hoy",
    whoServed: "Barbero",
    sampleDescription: "Corte y barba",
    sampleAmount: "250",
  },
  workshop: {
    business: "Taller",
    accent: "#D95606",
    kind: "job",
    action: "Abrir una orden",
    oneThing: "una orden",
    todayHeading: "Órdenes de hoy",
    whoServed: "Mecánico",
    sampleDescription: "Cambio de balatas",
    sampleAmount: "1800",
  },
  store: {
    business: "Tienda",
    accent: "#12784A",
    kind: "sale",
    action: "Cobrar una venta",
    oneThing: "una venta",
    todayHeading: "Ventas de hoy",
    whoServed: "Quién atendió",
    sampleDescription: "3 productos",
    sampleAmount: "340",
  },
  food: {
    business: "Negocio de comida",
    accent: "#CE1B2B",
    kind: "order",
    action: "Tomar un pedido",
    oneThing: "un pedido",
    todayHeading: "Pedidos de hoy",
    whoServed: "Quién atendió",
    sampleDescription: "2 tacos de pastor",
    sampleAmount: "190",
  },
};

export const TRADE_LIST = Object.entries(TRADES).map(([key, v]) => ({
  key: key as Trade,
  label: v.business,
}));

export function isTrade(value: unknown): value is Trade {
  return typeof value === "string" && value in TRADES;
}

export function money(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function clockTime(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}
