import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Car,
  MessageCircle,
  FileCheck,
  UserCheck,
  Sparkles,
  MapPin,
  KeyRound,
  Check,
} from "lucide-react";

/* ─── Data ─── */

type StepTag = { label: string; gold?: boolean };

type Step = {
  number: number;
  phase: "antes" | "orlando" | "durante" | "fim";
  phaseLabel: string;
  title: string;
  description: string;
  highlight?: string;
  note?: string;
  tags: StepTag[];
  icon: React.ReactNode;
  isFinal?: boolean;
  isStar?: boolean;
};

const steps: Step[] = [
  {
    number: 1,
    phase: "antes",
    phaseLabel: "Antes da viagem",
    title: "Escolha o carro ideal para sua viagem",
    description:
      "Navegue pela frota e selecione o modelo perfeito — casal, família ou grupo. Esportivos, SUVs premium, full-size ou minivan.",
    icon: <Car size={20} />,
    tags: [
      { label: "11 modelos" },
      { label: "2 a 7 passageiros" },
      { label: "SUV, esportivo, minivan" },
    ],
  },
  {
    number: 2,
    phase: "antes",
    phaseLabel: "Antes da viagem",
    title: "Fale com a gente no WhatsApp",
    description:
      "Envie suas datas, o modelo escolhido e tire todas as dúvidas. Atendimento 100% em português, sem complicação e com resposta rápida.",
    highlight: "Atendimento 100% em português",
    icon: <MessageCircle size={20} />,
    tags: [
      { label: "Português nativo", gold: true },
      { label: "Resposta rápida" },
      { label: "Sem burocracia" },
    ],
  },
  {
    number: 3,
    phase: "antes",
    phaseLabel: "Antes da viagem",
    title: "Confirme a reserva e viaje tranquilo",
    description:
      "Receba o contrato, confirme os detalhes e garanta seu veículo. Tudo resolvido antes de embarcar. Você só precisa de três documentos.",
    icon: <FileCheck size={20} />,
    tags: [
      { label: "CNH brasileira válida" },
      { label: "Passaporte" },
      { label: "Cartão de crédito" },
    ],
  },
  {
    number: 4,
    phase: "orlando",
    phaseLabel: "Chegou em Orlando",
    title: "Um representante Zeus te espera no desembarque",
    description:
      "Ao desembarcar, um representante da Zeus estará na área de desembarque com uma plaquinha com seu nome. Sem procurar balcão, sem fila, sem estresse. Ele te conduz diretamente até o estacionamento.",
    highlight: "área de desembarque com uma plaquinha com seu nome",
    note: "A entrega também pode ser feita em outro local combinado previamente — hotel, resort, Airbnb ou onde preferir.",
    isStar: true,
    icon: <UserCheck size={20} />,
    tags: [
      { label: "Plaquinha com seu nome", gold: true },
      { label: "Recepção no desembarque", gold: true },
      { label: "Local alternativo" },
    ],
  },
  {
    number: 5,
    phase: "orlando",
    phaseLabel: "Chegou em Orlando",
    title: "Seu carro: limpo, higienizado e de tanque cheio",
    description:
      "O representante te leva até o estacionamento onde o carro está pronto: lavado, higienizado e com o tanque cheio. Confira o veículo, receba as orientações e pronto — é só dirigir.",
    highlight: "lavado, higienizado e com o tanque cheio",
    icon: <Sparkles size={20} />,
    tags: [
      { label: "Lavado e higienizado", gold: true },
      { label: "Tanque cheio", gold: true },
      { label: "CarPlay configurado" },
      { label: "GPS pronto" },
    ],
  },
  {
    number: 6,
    phase: "durante",
    phaseLabel: "Durante a viagem",
    title: "Aproveite Orlando com suporte a qualquer hora",
    description:
      "Parques, outlets, restaurantes, praias — vá aonde quiser, na hora que quiser. Sem depender de Uber, sem filas. Se precisar de qualquer coisa, a Zeus está a uma mensagem de distância.",
    highlight: "Zeus está a uma mensagem de distância",
    icon: <MapPin size={20} />,
    tags: [
      { label: "Suporte durante toda a viagem", gold: true },
      { label: "Autonomia total" },
      { label: "Sem surpresas" },
    ],
  },
  {
    number: 7,
    phase: "fim",
    phaseLabel: "Hora de voltar",
    title: "Um representante te encontra para a devolução",
    description:
      "Na hora de devolver, a mesma experiência: um representante Zeus estará te esperando no aeroporto ou no local combinado. Entregue a chave, despeça-se do carro e embarque com tranquilidade. Sem burocracia, sem taxas escondidas.",
    highlight: "representante Zeus estará te esperando no aeroporto",
    note: "A devolução pode ser no aeroporto, hotel, resort ou qualquer local combinado previamente com a equipe.",
    isFinal: true,
    icon: <KeyRound size={20} />,
    tags: [
      { label: "Devolução assistida", gold: true },
      { label: "Aeroporto ou local combinado", gold: true },
      { label: "Sem taxas extras" },
    ],
  },
];

type PhaseKey = "antes" | "orlando" | "durante" | "fim";

const phases: { key: PhaseKey; label: string; icon: string; steps: number[] }[] = [
  { key: "antes", label: "Antes da viagem", icon: "✈️", steps: [0, 1, 2] },
  { key: "orlando", label: "Chegou em Orlando", icon: "🏰", steps: [3, 4] },
  { key: "durante", label: "Durante a viagem", icon: "🎢", steps: [5] },
  { key: "fim", label: "Hora de voltar", icon: "🛬", steps: [6] },
];

/* ─── Phase Navigation Pills ─── */

const PhaseNav = ({
  activePhase,
  onSelect,
}: {
  activePhase: PhaseKey;
  onSelect: (key: PhaseKey) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-14 sm:mb-20"
  >
    {phases.map((phase) => {
      const isActive = activePhase === phase.key;
      return (
        <button
          key={phase.key}
          onClick={() => onSelect(phase.key)}
          className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-semibold tracking-wide transition-all duration-400 cursor-pointer ${
            isActive
              ? "text-primary-foreground shadow-[0_0_30px_hsl(38,72%,42%,0.25)]"
              : "text-muted-foreground hover:text-foreground bg-card/60 backdrop-blur-sm border border-border hover:border-primary/30"
          }`}
        >
          {isActive && (
            <motion.div
              layoutId="activePhase"
              className="absolute inset-0 rounded-full gold-gradient"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <span className="text-sm">{phase.icon}</span>
            <span className="hidden sm:inline">{phase.label}</span>
            <span className="sm:hidden">
              {phase.label.split(" ").slice(-1)[0]}
            </span>
          </span>
        </button>
      );
    })}
  </motion.div>
);

/* ─── Step Card ─── */

const StepCard = ({ step, index }: { step: Step; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const renderDescription = () => {
    if (!step.highlight) return step.description;
    const parts = step.description.split(step.highlight);
    return (
      <>
        {parts[0]}
        <span className="text-primary font-semibold">{step.highlight}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative group"
    >
      {/* Ambient glow behind card on hover */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

      <div
        className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
          step.isFinal
            ? "bg-gradient-to-br from-card via-card to-primary/[0.08] border border-primary/30 shadow-[0_0_40px_hsl(38,72%,42%,0.12)]"
            : step.isStar
            ? "bg-gradient-to-br from-card via-card to-primary/[0.05] border border-primary/20 group-hover:border-primary/40"
            : "bg-card/80 backdrop-blur-xl border border-border group-hover:border-primary/30"
        } group-hover:shadow-[0_8px_40px_hsl(0,0%,0%,0.3)]`}
      >
        {/* Top accent line */}
        <div
          className={`h-[2px] w-full ${
            step.isFinal
              ? "gold-gradient"
              : "bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          }`}
        />

        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Icon circle */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${
              step.isFinal
                ? "gold-gradient text-primary-foreground shadow-[0_0_24px_hsl(38,72%,42%,0.35)]"
                : "bg-primary/[0.08] text-primary border border-primary/20 group-hover:bg-primary/[0.15] group-hover:shadow-[0_0_24px_hsl(38,72%,42%,0.18)]"
            }`}
          >
            {step.isFinal ? <Check size={22} /> : step.icon}
          </motion.div>

          {/* Step number + phase label */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-primary/60 text-[11px] font-bold tracking-[3px] uppercase">
              Passo {step.number < 10 ? `0${step.number}` : step.number}
            </span>
            <span className="w-1 h-1 rounded-full bg-primary/30" />
            <span className="text-muted-foreground text-[10px] uppercase tracking-[2px] font-medium">
              {step.phaseLabel}
            </span>
          </div>

          {step.isStar && (
            <span className="text-[10px] text-primary font-semibold tracking-wider uppercase mt-1 mb-1">
              ⭐ Experiência VIP
            </span>
          )}

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 leading-snug tracking-tight mt-2">
            {step.title}
          </h3>

          {/* Description */}
          <p className="text-[13px] sm:text-sm text-muted-foreground leading-[1.8] mb-5 max-w-lg">
            {renderDescription()}
          </p>

          {/* Note callout */}
          {step.note && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="relative mb-5 rounded-lg overflow-hidden w-full max-w-lg"
            >
              <div className="bg-primary/[0.04] border border-primary/10 rounded-lg px-4 py-3">
                <p className="text-xs text-muted-foreground/80 leading-relaxed italic">
                  {step.note}
                </p>
              </div>
            </motion.div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2">
            {step.tags.map((tag, i) => (
              <span
                key={i}
                className={`text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all duration-300 ${
                  tag.gold
                    ? "bg-primary/[0.1] text-primary border border-primary/20 shadow-[0_0_12px_hsl(38,72%,42%,0.08)]"
                    : "bg-muted/40 text-muted-foreground border border-border/60 group-hover:border-border"
                }`}
              >
                {tag.gold && <span className="mr-1 text-[10px]">✦</span>}
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Section ─── */

const HowItWorksSection = () => {
  const [activePhase, setActivePhase] = useState<PhaseKey>("antes");

  const currentPhase = phases.find((p) => p.key === activePhase)!;
  const currentSteps = currentPhase.steps.map((i) => steps[i]);

  return (
    <section id="como-funciona" className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 section-divider" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-14"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block text-primary text-[11px] uppercase tracking-[4px] font-semibold mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/[0.06]"
          >
            Como Funciona
          </motion.span>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1]">
            Experiência{" "}
            <span className="gold-text italic font-black">concierge</span>
            <br className="hidden sm:block" />{" "}
            <span className="text-muted-foreground font-light">do início ao fim</span>
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base mt-4 max-w-md mx-auto leading-relaxed">
            Você só precisa chegar.{" "}
            <span className="text-foreground font-medium">A Zeus cuida de todo o resto.</span>
          </p>
        </motion.div>

        {/* Phase navigation */}
        <PhaseNav activePhase={activePhase} onSelect={setActivePhase} />

        {/* Steps grid */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid gap-5 sm:gap-6"
          >
            {currentSteps.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} />
            ))}
          </motion.div>

          {/* Phase progress indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mt-10"
          >
            {phases.map((phase) => (
              <button
                key={phase.key}
                onClick={() => setActivePhase(phase.key)}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  phase.key === activePhase
                    ? "w-10 gold-gradient shadow-[0_0_12px_hsl(38,72%,42%,0.3)]"
                    : "w-3 bg-muted hover:bg-muted-foreground/30"
                }`}
              />
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-16 sm:mt-24"
        >
          <a
            href={`https://wa.me/16892981754?text=${encodeURIComponent("Olá, venho do site da Zeus e gostaria de realizar uma reserva!")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/cta relative inline-flex items-center gap-3 px-10 py-4.5 rounded-xl text-sm font-bold uppercase tracking-[2px] transition-all duration-300"
          >
            {/* Button glow */}
            <div className="absolute inset-0 rounded-xl gold-gradient opacity-90 group-hover/cta:opacity-100 transition-opacity" />
            <div className="absolute -inset-1 rounded-xl gold-gradient opacity-0 group-hover/cta:opacity-20 blur-lg transition-opacity duration-500" />
            <span className="relative z-10 flex items-center gap-3 text-primary-foreground">
              <MessageCircle size={18} />
              Quero reservar meu carro
            </span>
          </a>
          <p className="text-muted-foreground/40 text-xs mt-4 tracking-widest uppercase">
            Atendimento em português · Resposta em minutos
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
