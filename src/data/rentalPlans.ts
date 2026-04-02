export type PlanId = "essencial" | "conforto" | "premium";

export interface RentalPlan {
  id: PlanId;
  name: string;
  dailyExtra: number;
  insurance: "basic" | "premium";
  deposit: number;
  deductibleMultiplier: number;
  tollTag: boolean;
  childSeat: boolean;
  extraDriver: boolean;
  cancellation: string;
  cancellationLabel: string;
  reschedule: string;
  rescheduleLabel: string;
  delivery: boolean;
  priority: boolean;
  upgrade: boolean;
}

export const PLANS: Record<PlanId, RentalPlan> = {
  essencial: {
    id: "essencial",
    name: "Zeus Essencial",
    dailyExtra: 0,
    insurance: "basic",
    deposit: 550,
    deductibleMultiplier: 11,
    tollTag: false,
    childSeat: false,
    extraDriver: false,
    cancellation: "0%",
    cancellationLabel: "Sem reembolso",
    reschedule: "none",
    rescheduleLabel: "Nao permitida",
    delivery: false,
    priority: false,
    upgrade: false,
  },
  conforto: {
    id: "conforto",
    name: "Zeus Conforto",
    dailyExtra: 29,
    insurance: "premium",
    deposit: 0,
    deductibleMultiplier: 0,
    tollTag: true,
    childSeat: false,
    extraDriver: true,
    cancellation: "50%",
    cancellationLabel: "50% reembolso ate 48h",
    reschedule: "once_75",
    rescheduleLabel: "1x com taxa de US$ 75",
    delivery: false,
    priority: false,
    upgrade: false,
  },
  premium: {
    id: "premium",
    name: "Zeus Premium",
    dailyExtra: 49,
    insurance: "premium",
    deposit: 0,
    deductibleMultiplier: 0,
    tollTag: true,
    childSeat: true,
    extraDriver: true,
    cancellation: "100%",
    cancellationLabel: "100% reembolso ate 24h",
    reschedule: "unlimited_free",
    rescheduleLabel: "Ilimitada sem taxa",
    delivery: true,
    priority: true,
    upgrade: true,
  },
};

export const PLAN_ORDER: PlanId[] = ["essencial", "conforto", "premium"];

// Items included in ALL plans
export const BASE_INCLUDES = [
  "Quilometragem ilimitada",
  "Seguro basico",
  "Assistencia 24h",
  
  "Limpeza completa",
];
