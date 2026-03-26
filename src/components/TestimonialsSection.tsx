import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ricardo M.",
    text: "Experiência incrível! O carro estava impecável e o atendimento em português fez toda diferença. Super recomendo a Zeus!",
  },
  {
    name: "Fernanda S.",
    text: "Alugamos um Escalade para a família e foi perfeito. Processo super simples, sem burocracia. Voltaremos com certeza!",
  },
  {
    name: "Carlos A.",
    text: "Realizei o sonho de dirigir um Corvette em Orlando. A Zeus tornou tudo fácil e seguro. Nota 10!",
  },
];

const TestimonialsSection = () => (
  <section className="py-24 relative section-divider">
    <div className="container mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-center mb-16"
      >
        Quem aluga, <span className="gold-text">recomenda</span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={16} className="text-primary fill-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-light leading-relaxed italic">"{t.text}"</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">{t.name[0]}</span>
              </div>
              <span className="text-sm font-semibold">{t.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
