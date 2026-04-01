import { motion } from "framer-motion";
import { Percent } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const DealsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-28 relative">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="section-heading">
            {t.deals.title}<span className="gold-text">{t.deals.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground font-light mt-3 text-base sm:text-lg">
            {t.deals.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card gold-border-glow p-8 sm:p-14 border-2 border-primary/25 relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/8 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary/4 rounded-full blur-[80px]" />

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="text-center p-6 sm:p-8 rounded-2xl bg-muted/40 border border-border/20">
              <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center mx-auto mb-4">
                <Percent className="text-primary-foreground" size={24} />
              </div>
              <p className="text-3xl sm:text-4xl font-black gold-text">5% OFF</p>
              <p className="text-sm text-muted-foreground mt-3 font-light leading-relaxed">{t.deals.discount5}</p>
            </div>
            <div className="text-center p-6 sm:p-8 rounded-2xl bg-muted/40 border border-border/20">
              <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center mx-auto mb-4">
                <Percent className="text-primary-foreground" size={24} />
              </div>
              <p className="text-3xl sm:text-4xl font-black gold-text">10% OFF</p>
              <p className="text-sm text-muted-foreground mt-3 font-light leading-relaxed">{t.deals.discount10}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DealsSection;
