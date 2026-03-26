import { motion } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";

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
    tags: [
      { label: "Devolução assistida", gold: true },
      { label: "Aeroporto ou local combinado", gold: true },
      { label: "Sem taxas extras" },
    ],
  },
];

const phaseConfig = {
  antes: { bg: "bg-white/5", text: "text-muted-foreground" },
  orlando: { bg: "bg-primary/12", text: "text-primary" },
  durante: { bg: "bg-secondary/10", text: "text-secondary" },
  fim: { bg: "bg-primary/18", text: "text-primary" },
};

// Group steps by phase for dividers
const phases = [
  { key: "antes" as const, label: "Antes da viagem", steps: [0, 1, 2] },
  { key: "orlando" as const, label: "Chegou em Orlando", steps: [3, 4] },
  { key: "durante" as const, label: "Durante a viagem", steps: [5] },
  { key: "fim" as const, label: "Hora de voltar", steps: [6] },
];

const StepCard = ({ step, index }: { step: Step; index: number }) => {
  const config = phaseConfig[step.phase];

  // Highlight text in description
  const renderDescription = () => {
    if (!step.highlight) return step.description;
    const parts = step.description.split(step.highlight);
    return (
      <>
        {parts[0]}
        <span className="text-primary font-medium">{step.highlight}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex items-start gap-4 sm:gap-6 group"
    >
      {/* Timeline line + circle */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Circle */}
        <motion.div
          className={`relative z-10 w-[46px] h-[46px] sm:w-[50px] sm:h-[50px] rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            step.isFinal
              ? "gold-gradient text-primary-foreground shadow-[0_0_24px_hsl(38,72%,42%,0.3)]"
              : "border-2 border-primary/40 bg-background text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-[0_0_24px_hsl(38,72%,42%,0.3)]"
          }`}
        >
          {step.isFinal ? <Check size={20} /> : `0${step.number}`}
        </motion.div>
        {/* Vertical line (except last) */}
        {!step.isFinal && (
          <div className="w-[2px] flex-1 min-h-[24px] bg-gradient-to-b from-primary/60 to-primary/20" />
        )}
      </div>

      {/* Card */}
      <div
        className={`flex-1 rounded-xl p-5 sm:p-6 mb-4 transition-all duration-300 ${
          step.isFinal
            ? "bg-card border border-primary/40 shadow-[0_0_20px_hsl(38,72%,42%,0.1)]"
            : "bg-card border border-border group-hover:border-primary/40 group-hover:translate-x-1"
        }`}
      >
        {/* Phase badge */}
        <span
          className={`inline-block text-[10px] uppercase tracking-[2px] font-semibold px-3 py-1 rounded-full mb-3 ${config.bg} ${config.text}`}
        >
          {step.phaseLabel}
        </span>

        {step.isStar && (
          <span className="ml-2 text-xs text-primary">⭐ Experiência VIP</span>
        )}

        {/* Title */}
        <h3 className="text-[15px] sm:text-base font-bold text-foreground mb-2 leading-snug">
          {step.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-muted-foreground leading-[1.65] mb-3">
          {renderDescription()}
        </p>

        {/* Special note */}
        {step.note && (
          <div className="border-l-2 border-primary bg-primary/[0.06] rounded-r-md px-3 py-2.5 mb-3">
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              {step.note}
            </p>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {step.tags.map((tag, i) => (
            <span
              key={i}
              className={`text-[11px] px-2.5 py-1 rounded-full border ${
                tag.gold
                  ? "bg-primary/[0.08] text-primary border-primary/20"
                  : "bg-muted/50 text-muted-foreground border-border"
              }`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="py-20 sm:py-28 relative section-divider">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 sm:mb-20"
        >
          <span className="text-primary text-[11px] uppercase tracking-[3px] font-semibold block mb-3">
            Como Funciona
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-wide">
            Experiência{" "}
            <span className="gold-text italic">concierge</span>{" "}
            do início ao fim
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-3 max-w-lg mx-auto">
            Você só precisa chegar. A Zeus cuida de todo o resto.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-[672px] mx-auto">
          {phases.map((phase, pi) => (
            <div key={phase.key}>
              {/* Phase divider */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-center gap-4 mb-6 pl-[62px] sm:pl-[74px]"
              >
                <span className="text-primary text-xs font-bold uppercase tracking-[2px] whitespace-nowrap">
                  {phase.label}
                </span>
                <div className="flex-1 h-px bg-primary/20" />
              </motion.div>

              {/* Steps in this phase */}
              {phase.steps.map((stepIdx) => (
                <StepCard
                  key={stepIdx}
                  step={steps[stepIdx]}
                  index={stepIdx}
                />
              ))}
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16 sm:mt-20"
        >
          <a
            href={`https://wa.me/16892981754?text=${encodeURIComponent("Olá, venho do site da Zeus e gostaria de realizar uma reserva!")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 gold-gradient text-primary-foreground px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-widest hover:opacity-90 hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_30px_hsl(38,72%,42%,0.3)]"
          >
            <MessageCircle size={18} />
            Quero reservar meu carro
          </a>
          <p className="text-muted-foreground/50 text-xs mt-3 tracking-wide">
            Atendimento em português · Resposta em minutos
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
