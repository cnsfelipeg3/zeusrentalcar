import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const RequirementsSection = () => {
  const { t } = useLanguage();
  const items = [t.requirements.item1, t.requirements.item2, t.requirements.item3];

  return (
    <section className="py-28 relative">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="section-heading">
            {t.requirements.title}
            <span className="gold-text">{t.requirements.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground italic font-light mt-3 text-base sm:text-lg">
            {t.requirements.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-8 sm:p-12 max-w-lg mx-auto"
        >
          <div className="space-y-6 flex flex-col items-center">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="flex items-center gap-4 text-center"
              >
                <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/10">
                  <Check className="text-primary-foreground" size={16} />
                </div>
                <span className="text-base sm:text-lg font-medium tracking-wide">{item}</span>
              </motion.div>
            ))}
          </div>
          <p className="mt-10 text-sm text-muted-foreground font-light text-center leading-relaxed">
            {t.requirements.footer}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default RequirementsSection;
