import { motion } from "framer-motion";
import { Star, MessageCircle, Rocket, Headphones } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const icons = [Star, MessageCircle, Rocket, Headphones];

const WhyZeusSection = () => {
  const { t } = useLanguage();

  const benefits = [
    { title: t.whyZeus.benefit1Title, desc: t.whyZeus.benefit1Desc },
    { title: t.whyZeus.benefit2Title, desc: t.whyZeus.benefit2Desc },
    { title: t.whyZeus.benefit3Title, desc: t.whyZeus.benefit3Desc },
    { title: t.whyZeus.benefit4Title, desc: t.whyZeus.benefit4Desc },
  ];

  return (
    <section id="por-que" className="py-24 relative section-divider">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-center mb-16"
        >
          {t.whyZeus.title}<span className="gold-text">{t.whyZeus.titleHighlight}</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {benefits.map((b, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 hover:gold-border-glow hover:scale-[1.02] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="text-primary-foreground" size={22} />
                </div>
                <h3 className="text-base font-bold uppercase tracking-wider mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyZeusSection;
