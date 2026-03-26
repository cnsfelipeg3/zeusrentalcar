import { motion } from "framer-motion";
import { Globe, CheckCircle, Zap, Shield } from "lucide-react";

const features = [
  { icon: Globe, title: "Atendimento 100% em português", emoji: "🇧🇷" },
  { icon: CheckCircle, title: "Veículos selecionados e revisados", emoji: "✅" },
  { icon: Zap, title: "Processo simples e ágil", emoji: "⚡" },
  { icon: Shield, title: "Suporte durante toda a viagem", emoji: "🛡️" },
];

const AboutSection = () => (
  <section id="quem-somos" className="py-24 relative section-divider">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider mb-4">
          Quem <span className="gold-text">Somos</span>
        </h2>
        <p className="text-muted-foreground text-lg font-light leading-relaxed">
          A Zeus Rental Car é referência em locação de veículos premium para brasileiros em Orlando.
          Oferecemos uma experiência de mobilidade de alto nível, com atendimento personalizado e
          frota selecionada para transformar sua viagem.
        </p>
        <p className="mt-4 text-xl font-semibold gold-text italic tracking-wide">
          Mobilidade premium para brasileiros em Orlando.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-6 text-center hover:gold-border-glow hover:scale-[1.02] transition-all duration-300"
          >
            <span className="text-3xl">{f.emoji}</span>
            <p className="mt-3 text-sm font-semibold uppercase tracking-wider">{f.title}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
