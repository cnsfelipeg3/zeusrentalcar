import { motion } from "framer-motion";
import { Percent } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const DealsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider">
            {t.deals.title}<span className="gold-text">{t.deals.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground font-light mt-2">
            {t.deals.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card gold-border-glow p-8 sm:p-12 border-2 border-primary/30 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="text-center p-6 rounded-lg bg-muted/50">
              <Percent className="text-primary mx-auto mb-3" size={32} />
              <p className="text-3xl font-black gold-text">5% OFF</p>
              <p className="text-sm text-muted-foreground mt-2 font-light">{t.deals.discount5}</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-muted/50">
              <Percent className="text-primary mx-auto mb-3" size={32} />
              <p className="text-3xl font-black gold-text">10% OFF</p>
              <p className="text-sm text-muted-foreground mt-2 font-light">{t.deals.discount10}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DealsSection;
