import { motion } from "framer-motion";
import {
  Check, X, ShieldCheck, Shield, CircleDollarSign, Baby, Users,
  CalendarX2, CalendarClock, Truck, MessageCircle, ArrowUpCircle,
  Zap,
} from "lucide-react";
import { useCurrency } from "@/i18n/CurrencyContext";
import { PLANS, PLAN_ORDER, type PlanId } from "@/data/rentalPlans";

interface PlanSelectorProps {
  selectedPlan: PlanId;
  onSelectPlan: (plan: PlanId) => void;
  dailyPrice: number;
  basicDeductible: number;
}

const planAccent: Record<PlanId, { selected: string; radio: string; badge: string; price: string }> = {
  essencial: {
    selected: "border-muted-foreground/50 bg-muted/5",
    radio: "border-muted-foreground bg-muted-foreground",
    badge: "",
    price: "text-muted-foreground",
  },
  conforto: {
    selected: "border-[#378ADD] bg-[#378ADD]/5 shadow-md shadow-[#378ADD]/10",
    radio: "border-[#378ADD] bg-[#378ADD]",
    badge: "bg-[#378ADD] text-white",
    price: "text-[#378ADD]",
  },
  premium: {
    selected: "border-primary bg-primary/5 shadow-md shadow-primary/10",
    radio: "border-primary bg-primary",
    badge: "gold-gradient text-primary-foreground",
    price: "text-primary",
  },
};

/* ── feature rows ── */
interface FeatureRow {
  label: string;
  icon: React.ElementType;
  getter: (planId: PlanId) => boolean | string;
}

const features: FeatureRow[] = [
  { label: "Quilometragem ilimitada", icon: Check, getter: () => true },
  { label: "Seguro básico + Assistência 24h", icon: Shield, getter: () => true },
  { label: "Seguro Premium (Franquia ZERO)", icon: ShieldCheck, getter: (p) => PLANS[p].insurance === "premium" },
  { label: "TAG Pedágio ilimitada (SunPass)", icon: CircleDollarSign, getter: (p) => PLANS[p].tollTag },
  { label: "2º condutor grátis", icon: Users, getter: (p) => PLANS[p].extraDriver },
  { label: "Cadeirinha infantil inclusa", icon: Baby, getter: (p) => PLANS[p].childSeat },
  { label: "Entrega no hotel/endereço", icon: Truck, getter: (p) => PLANS[p].delivery },
  { label: "Prioridade WhatsApp", icon: MessageCircle, getter: (p) => PLANS[p].priority },
  { label: "Upgrade grátis (quando disponível)", icon: ArrowUpCircle, getter: (p) => PLANS[p].upgrade },
];

const PlanSelector = ({ selectedPlan, onSelectPlan, dailyPrice, basicDeductible }: PlanSelectorProps) => {
  const { formatPrice } = useCurrency();

  return (
    <div className="space-y-3">
      {/* ── Plan header cards ── */}
      <div className="grid grid-cols-3 gap-2">
        {PLAN_ORDER.map((planId) => {
          const plan = PLANS[planId];
          const accent = planAccent[planId];
          const isSelected = selectedPlan === planId;
          const isConforto = planId === "conforto";
          const isPremium = planId === "premium";
          const badge = isConforto ? "MAIS ESCOLHIDO" : isPremium ? "MÁXIMA PROTEÇÃO" : null;

          return (
            <motion.button
              key={planId}
              onClick={() => onSelectPlan(planId)}
              whileTap={{ scale: 0.97 }}
              className={`relative text-center rounded-xl border-2 p-3 pt-4 transition-all duration-200 cursor-pointer ${
                isSelected ? accent.selected : "border-border/30 hover:border-muted-foreground/30"
              }`}
            >
              {/* Badge */}
              {badge && (
                <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-[0.12em] ${accent.badge} flex items-center gap-1 whitespace-nowrap`}>
                  {isConforto ? <Zap size={8} /> : <ShieldCheck size={8} />}
                  {badge}
                </div>
              )}

              {/* Radio */}
              <div className={`mx-auto w-4 h-4 rounded-full border-2 flex items-center justify-center mb-2 transition-colors ${
                isSelected ? accent.radio : "border-muted-foreground/40"
              }`}>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>

              {/* Name */}
              <p className="text-xs font-bold text-foreground leading-tight">{plan.name}</p>

              {/* Price */}
              <p className={`text-sm font-extrabold mt-1 ${accent.price}`}>
                {plan.dailyExtra === 0 ? "Incluso" : `+${formatPrice(plan.dailyExtra)}/dia`}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* ── Feature comparison table ── */}
      <div className="rounded-xl border border-border/30 overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_repeat(3,72px)] items-center text-[10px] font-bold px-3 py-2 border-b border-border/20 bg-muted/10">
          <span></span>
          {PLAN_ORDER.map((planId) => (
            <div key={planId} className="text-center text-foreground/70 leading-tight">
              {PLANS[planId].name.replace("Zeus ", "")}
            </div>
          ))}
        </div>
        {features.map((feat, i) => (
          <div
            key={feat.label}
            className={`grid grid-cols-[1fr_repeat(3,72px)] items-center text-[11px] px-3 py-1.5 ${
              i % 2 === 0 ? "bg-muted/5" : ""
            } ${i !== features.length - 1 ? "border-b border-border/15" : ""}`}
          >
            <span className="text-muted-foreground pr-2">{feat.label}</span>
            {PLAN_ORDER.map((planId) => {
              const included = feat.getter(planId);
              return (
                <div key={planId} className="flex justify-center">
                  {included ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <X size={14} className="text-destructive/40" />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Cancellation row */}
        <div className="grid grid-cols-[1fr_repeat(3,72px)] items-center text-[11px] px-3 py-1.5 border-t border-border/15 bg-muted/5">
          <span className="text-muted-foreground flex items-center gap-1">
            <CalendarX2 size={11} /> Cancelamento
          </span>
          {PLAN_ORDER.map((planId) => (
            <div key={planId} className="text-center text-[10px] font-semibold text-foreground leading-tight">
              {PLANS[planId].cancellation}
            </div>
          ))}
        </div>

        {/* Reschedule row */}
        <div className="grid grid-cols-[1fr_repeat(3,72px)] items-center text-[11px] px-3 py-1.5 border-t border-border/15">
          <span className="text-muted-foreground flex items-center gap-1">
            <CalendarClock size={11} /> Remarcação
          </span>
          {PLAN_ORDER.map((planId) => {
            const plan = PLANS[planId];
            return (
              <div key={planId} className="text-center text-[10px] font-semibold text-foreground leading-tight">
                {plan.reschedule === "none" ? <X size={14} className="mx-auto text-destructive/40" /> : plan.reschedule === "once_75" ? "1x" : <Check size={14} className="mx-auto text-emerald-500" />}
              </div>
            );
          })}
        </div>

        {/* Insurance / deposit row */}
        <div className="grid grid-cols-[1fr_repeat(3,72px)] items-center text-[11px] px-3 py-2 border-t border-border/20 bg-muted/10">
          <span className="text-muted-foreground flex items-center gap-1">
            <Shield size={11} /> Caução / Franquia
          </span>
          {PLAN_ORDER.map((planId) => {
            const plan = PLANS[planId];
            return (
              <div key={planId} className="text-center">
                {plan.insurance === "premium" ? (
                  <span className="text-[9px] font-bold text-emerald-500">ZERO</span>
                ) : (
                  <span className="text-[9px] font-bold text-amber-500">{formatPrice(plan.deposit)}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlanSelector;
