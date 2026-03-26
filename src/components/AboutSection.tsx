import { motion } from "framer-motion";
import { Globe, CheckCircle, Zap, Shield } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const icons = [Globe, CheckCircle, Zap, Shield];
const emojis = ["🇧🇷", "✅", "⚡", "🛡️"];

const AboutSection = () => {
  const { t } = useLanguage();
  const features = [t.about.feat1, t.about.feat2, t.about.feat3, t.about.feat4];

  return (
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
            {t.about.title}<span className="gold-text">{t.about.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg font-light leading-relaxed">
            {t.about.description}
          </p>
          <p className="mt-4 text-xl font-semibold gold-text italic tracking-wide">
            {t.about.tagline}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((title, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6 text-center hover:gold-border-glow hover:scale-[1.02] transition-all duration-300"
            >
              <span className="text-3xl">{emojis[i]}</span>
              <p className="mt-3 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wider leading-snug">{title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
