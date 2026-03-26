import { motion } from "framer-motion";
import { Check } from "lucide-react";

const items = ["CNH brasileira válida", "Passaporte", "Cartão de crédito"];

const RequirementsSection = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider">
          O que você precisa para{" "}
          <span className="gold-text">dirigir nos EUA?</span>
        </h2>
        <p className="text-muted-foreground italic font-light mt-2 text-lg">
          É mais simples do que você imagina
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card p-8 sm:p-12 max-w-lg mx-auto"
      >
        <div className="space-y-5">
          {items.map((item, i) => (
            <div key={item} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
                <Check className="text-primary-foreground" size={16} />
              </div>
              <span className="text-lg font-medium">{item}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground font-light text-center leading-relaxed">
          Com esses documentos, você já pode dirigir em Orlando e alugar seu carro normalmente.
        </p>
      </motion.div>
    </div>
  </section>
);

export default RequirementsSection;
