import { motion } from "framer-motion";
import { Car, CalendarCheck, MapPin } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const icons = [Car, CalendarCheck, MapPin];
const numbers = ["01", "02", "03"];

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    { title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc },
    { title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc },
    { title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc },
  ];

  return (
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
            {t.howItWorks.title}
          </h2>
          <p className="gold-text text-lg font-semibold italic mt-2 tracking-wide">
            {t.howItWorks.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center relative"
              >
                <span className="text-6xl font-black gold-text opacity-20 absolute -top-4 left-1/2 -translate-x-1/2">
                  {numbers[i]}
                </span>
                <div className="relative z-10 mt-8">
                  <div className="w-16 h-16 mx-auto rounded-full gold-gradient flex items-center justify-center mb-4">
                    <Icon className="text-primary-foreground" size={28} />
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-wider mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground italic font-light text-lg mb-6">
            {t.howItWorks.quote}
          </p>
          <a
            href={`https://wa.me/16892981754?text=${encodeURIComponent("Olá, venho do site da Zeus e gostaria de realizar uma reserva!")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block gold-gradient text-primary-foreground px-8 py-4 rounded-md text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            {t.howItWorks.bookNow}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
