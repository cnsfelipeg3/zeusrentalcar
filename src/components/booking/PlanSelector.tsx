import { motion } from "framer-motion";
import {
  Check, X, ShieldCheck, Shield, CircleDollarSign, Baby, Users,
  CalendarX2, CalendarClock, Truck, MessageCircle, ArrowUpCircle,
  Zap,
} from "lucide-react";
import { useCurrency } from "@/i18n/CurrencyContext";
import { PLANS, PLAN_ORDER, BASE_INCLUDES, type PlanId } from "@/data/rentalPlans";

interface PlanSelectorProps {
  selectedPlan: PlanId;
  onSelectPlan: (plan: PlanId) => void;
  dailyPrice: number;
  basicDeductible: number;
}

const planColors: Record<PlanId, {
  border: string;
  borderSelected: string;
  bg: string;
  badgeBg: string;
  badgeText: string;
  accent: string;
}> = {
  essencial: {
    border: "border-border/30",
    borderSelected: "border-muted-foreground/50 bg-muted/10",
    bg: "",
    badgeBg: "",
    badgeText: "",
    accent: "text-muted-foreground",
  },
  conforto: {
    border: "border-[#378ADD]/30",
    borderSelected: "border-[#378ADD]/60 bg-[#378ADD]/5 ring-2 ring-[#378ADD]/20 shadow-lg shadow-[#378ADD]/10",
    bg: "",
    badgeBg: "bg-[#378ADD]/15",
    badgeText: "text-[#378ADD]",
    accent: "text-[#378ADD]",
  },
  premium: {
    border: "border-primary/30",
    borderSelected: "border-primary/50 bg-primary/5 ring-2 ring-primary/20 shadow-lg shadow-primary/10",
    bg: "",
    badgeBg: "bg-primary/15",
    badgeText: "text-primary",
    accent: "text-primary",
  },
};

const PlanSelector = ({ selectedPlan, onSelectPlan, dailyPrice, basicDeductible }: PlanSelectorProps) => {
  const { formatPrice } = useCurrency();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {PLAN_ORDER.map((planId) => {
        const plan = PLANS[planId];
        const colors = planColors[planId];
        const isSelected = selectedPlan === planId;
        const isConforto = planId === "conforto";
        const isPremium = planId === "premium";
        const badge = isConforto ? "MAIS ESCOLHIDO" : isPremium ? "MAXIMA PROTECAO" : null;

        const included: { label: string; icon: typeof Check }[] = [];
        const excluded: { label: string }[] = [];

        // Base includes for all
        included.push({ label: "Quilometragem ilimitada", icon: Check });
        included.push({ label: "Seguro basico + Assistencia 24h", icon: Shield });
        included.push({ label: "GPS integrado", icon: Check });

        if (plan.insurance === "premium") {
          included.push({ label: "Seguro Premium (Franquia ZERO)", icon: ShieldCheck });
        }
        if (plan.tollTag) {
          included.push({ label: "TAG Pedagio ilimitada (SunPass)", icon: CircleDollarSign });
        } else {
          excluded.push({ label: "TAG Pedagio" });
        }
        if (plan.extraDriver) {
          included.push({ label: "2o motorista gratis", icon: Users });
        }
        if (plan.childSeat) {
          included.push({ label: "Cadeirinha infantil inclusa", icon: Baby });
        } else if (planId === "essencial") {
          excluded.push({ label: "Cadeirinha infantil" });
        }
        if (plan.delivery) {
          included.push({ label: "Entrega no hotel/endereco", icon: Truck });
        }
        if (plan.priority) {
          included.push({ label: "Prioridade WhatsApp", icon: MessageCircle });
        }
        if (plan.upgrade) {
          included.push({ label: "Upgrade gratis (quando disponivel)", icon: ArrowUpCircle });
        }

        return (
          <motion.button
            key={planId}
            onClick={() => onSelectPlan(planId)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`relative text-left rounded-xl border-2 p-4 transition-all duration-300 ${
              isSelected ? colors.borderSelected : `${colors.border} hover:border-muted-foreground/30`
            } ${isConforto ? "lg:scale-[1.02] lg:z-10" : ""}`}
          >
            {/* Badge */}
            {badge && (
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-[0.15em] ${
                isConforto ? "bg-[#378ADD] text-white" : "gold-gradient text-primary-foreground"
              } flex items-center gap-1`}>
                {isConforto ? <Zap size={9} /> : <ShieldCheck size={9} />}
                {badge}
              </div>
            )}

            {/* Radio indicator */}
            <div className="flex items-start gap-3 mb-3 mt-1">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                isSelected
                  ? planId === "conforto" ? "border-[#378ADD] bg-[#378ADD]" : planId === "premium" ? "border-primary bg-primary" : "border-muted-foreground bg-muted-foreground"
                  : "border-muted-foreground/40"
              }`}>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-foreground">{plan.name}</h3>
                <p className={`text-lg font-bold ${colors.accent}`}>
                  {plan.dailyExtra === 0 ? "Incluso" : `+${formatPrice(plan.dailyExtra)}/dia`}
                </p>
              </div>
            </div>

            {/* Included items */}
            <ul className="space-y-1 mb-3">
              {included.map((item) => (
                <li key={item.label} className="flex items-start gap-1.5 text-[10px]">
                  <Check size={10} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{item.label}</span>
                </li>
              ))}
              {excluded.map((item) => (
                <li key={item.label} className="flex items-start gap-1.5 text-[10px]">
                  <X size={10} className="text-destructive/60 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground/50 line-through">{item.label}</span>
                </li>
              ))}
            </ul>

            {/* Cancellation & reschedule */}
            <div className="space-y-1 mb-3 text-[10px]">
              <div className="flex items-center gap-1.5">
                <CalendarX2 size={10} className={plan.cancellation === "0%" ? "text-destructive/60" : "text-emerald-400"} />
                <span className="text-muted-foreground">Cancel.: <strong className="text-foreground">{plan.cancellationLabel}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarClock size={10} className={plan.reschedule === "none" ? "text-destructive/60" : "text-emerald-400"} />
                <span className="text-muted-foreground">Remarc.: <strong className="text-foreground">{plan.rescheduleLabel}</strong></span>
              </div>
            </div>

            {/* Insurance info */}
            <div className={`rounded-lg p-2 text-[10px] ${
              plan.insurance === "premium"
                ? "bg-emerald-500/8 border border-emerald-500/15"
                : "bg-amber-500/8 border border-amber-500/15"
            }`}>
              {plan.insurance === "premium" ? (
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={10} /> Caucao ZERO · Franquia ZERO
                </p>
              ) : (
                <p className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <Shield size={10} /> Caucao {formatPrice(plan.deposit)} · Franquia {formatPrice(basicDeductible)}
                </p>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default PlanSelector;
