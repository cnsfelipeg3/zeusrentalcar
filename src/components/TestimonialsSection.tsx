import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const TestimonialsSection = () => {
  const { t } = useLanguage();

  const testimonials = [
    { name: t.testimonials.t1Name, text: t.testimonials.t1Text },
    { name: t.testimonials.t2Name, text: t.testimonials.t2Text },
    { name: t.testimonials.t3Name, text: t.testimonials.t3Text },
    { name: t.testimonials.t4Name, text: t.testimonials.t4Text },
    { name: t.testimonials.t5Name, text: t.testimonials.t5Text },
    { name: t.testimonials.t6Name, text: t.testimonials.t6Text },
  ];

  return (
    <section className="py-24 relative section-divider">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-center mb-16"
        >
          {t.testimonials.title}<span className="gold-text">{t.testimonials.titleHighlight}</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((tm, i) => (
            <motion.div
              key={i}
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
              <p className="text-sm text-muted-foreground font-light leading-relaxed italic">"{tm.text}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">{tm.name[0]}</span>
                </div>
                <span className="text-sm font-semibold">{tm.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
