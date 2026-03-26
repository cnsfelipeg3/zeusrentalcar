import { motion } from "framer-motion";
import { Car, CalendarCheck, MapPin } from "lucide-react";

const steps = [
  {
    icon: Car,
    number: "01",
    title: "Escolha o Carro",
    desc: "Explore nossa frota e selecione o modelo ideal para sua viagem.",
  },
  {
    icon: CalendarCheck,
    number: "02",
    title: "Reserve Antes da Viagem",
    desc: "Entre em contato, confirme datas e garanta seu veículo.",
  },
  {
    icon: MapPin,
    number: "03",
    title: "Retire no Aeroporto e Dirija",
    desc: "Chegou em Orlando? Seu carro já está esperando.",
  },
];

const HowItWorksSection = () => (
  <section id="como-funciona" className="py-24 relative section-divider">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider">
          Aluguel de carro em Orlando
        </h2>
        <p className="gold-text text-lg font-semibold italic mt-2 tracking-wide">
          Mais fácil do que você imagina
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={s.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="text-center relative"
          >
            <span className="text-6xl font-black gold-text opacity-20 absolute -top-4 left-1/2 -translate-x-1/2">
              {s.number}
            </span>
            <div className="relative z-10 mt-8">
              <div className="w-16 h-16 mx-auto rounded-full gold-gradient flex items-center justify-center mb-4">
                <s.icon className="text-primary-foreground" size={28} />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center mt-16"
      >
        <p className="text-muted-foreground italic font-light text-lg mb-6">
          "Sua viagem fica muito mais confortável com carro próprio."
        </p>
        <a
          href="https://wa.me/14075551234"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block gold-gradient text-primary-foreground px-8 py-4 rounded-md text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Reserve Agora
        </a>
      </motion.div>
    </div>
  </section>
);

export default HowItWorksSection;
