// El producto es uno solo. Lo que cambia entre giros es el vocabulario.
// Aquí vive esa diferencia, y en ningún otro lado: si mañana entra un
// quinto giro, se agrega una entrada y la aplicación entera lo habla.

export type Giro = "barberia" | "taller" | "tienda" | "comida";
export type TipoApunte = "venta" | "cita" | "orden" | "pedido";

export type Vocabulario = {
  negocio: string;
  acento: string;
  tipo: TipoApunte;
  accion: string;      // el botón grande
  unaCosa: string;     // "un corte"
  deHoy: string;       // encabezado de la lista
  quienAtendio: string;
  ejemploConcepto: string;
  ejemploMonto: string;
};

export const GIROS: Record<Giro, Vocabulario> = {
  barberia: {
    negocio: "Barbería",
    acento: "#2F4BE0",
    tipo: "venta",
    accion: "Cobrar un corte",
    unaCosa: "un corte",
    deHoy: "Cortes de hoy",
    quienAtendio: "Barbero",
    ejemploConcepto: "Corte y barba",
    ejemploMonto: "250",
  },
  taller: {
    negocio: "Taller",
    acento: "#D95606",
    tipo: "orden",
    accion: "Abrir una orden",
    unaCosa: "una orden",
    deHoy: "Órdenes de hoy",
    quienAtendio: "Mecánico",
    ejemploConcepto: "Cambio de balatas",
    ejemploMonto: "1800",
  },
  tienda: {
    negocio: "Tienda",
    acento: "#12784A",
    tipo: "venta",
    accion: "Cobrar una venta",
    unaCosa: "una venta",
    deHoy: "Ventas de hoy",
    quienAtendio: "Quién atendió",
    ejemploConcepto: "3 productos",
    ejemploMonto: "340",
  },
  comida: {
    negocio: "Negocio de comida",
    acento: "#CE1B2B",
    tipo: "pedido",
    accion: "Tomar un pedido",
    unaCosa: "un pedido",
    deHoy: "Pedidos de hoy",
    quienAtendio: "Quién atendió",
    ejemploConcepto: "2 tacos de pastor",
    ejemploMonto: "190",
  },
};

export const LISTA_GIROS = Object.entries(GIROS).map(([clave, v]) => ({
  clave: clave as Giro,
  nombre: v.negocio,
}));

export function esGiro(valor: unknown): valor is Giro {
  return typeof valor === "string" && valor in GIROS;
}

export function pesos(monto: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: monto % 1 === 0 ? 0 : 2,
  }).format(monto);
}

export function hora(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}
