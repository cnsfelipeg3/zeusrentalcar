import { motion } from "framer-motion";
import { Star, MessageCircle, Rocket, Headphones } from "lucide-react";

const benefits = [
  {
    icon: Star,
    title: "Veículos selecionados",
    desc: "Cada carro da nossa frota é escolhido a dedo para garantir qualidade e conforto.",
  },
  {
    icon: MessageCircle,
    title: "Atendimento em português",
    desc: "Fale com quem entende você. Sem barreiras, sem complicação.",
  },
  {
    icon: Rocket,
    title: "Processo simples e ágil",
    desc: "Reserve online, retire no aeroporto. Sem burocracia.",
  },
  {
    icon: Headphones,
    title: "Suporte durante toda a viagem",
    desc: "Estamos disponíveis do início ao fim da sua experiência.",
  },
];

const WhyZeusSection = () => (
  <section id="por-que" className="py-24 relative section-divider">
    <div className="container mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-center mb-16"
      >
        Por que escolher a <span className="gold-text">Zeus?</span>
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-8 hover:gold-border-glow hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <b.icon className="text-primary-foreground" size={22} />
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider mb-2">{b.title}</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyZeusSection;
