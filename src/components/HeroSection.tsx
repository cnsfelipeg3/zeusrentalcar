import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import zeusLogo from "@/assets/zeus-logo.png";
import { useLanguage } from "@/i18n/LanguageContext";
import SearchBar from "@/components/SearchBar";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-0">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(40,100%,48%,0.06)_0%,_transparent_70%)]" />

      {/* Remove checkered pattern on mobile */}
      <div className="absolute top-0 right-0 w-40 h-40 opacity-[0.03] hidden md:block"
        style={{
          backgroundImage: "repeating-conic-gradient(hsl(0,0%,100%) 0% 25%, transparent 0% 50%)",
          backgroundSize: "20px 20px",
        }}
      />

      <svg className="absolute bottom-0 left-0 right-0 w-full opacity-10" viewBox="0 0 1440 200" fill="none">
        <path d="M0 200C240 100 480 50 720 80C960 110 1200 160 1440 120V200H0Z" fill="url(#goldGrad)" />
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1440" y2="0">
            <stop offset="0%" stopColor="hsl(40,100%,48%)" />
            <stop offset="100%" stopColor="hsl(47,100%,50%)" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.img
          src={zeusLogo}
          alt="Zeus Rental Car"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="h-28 sm:h-40 lg:h-48 w-auto mx-auto mb-4 sm:mb-8 mt-[-7rem] sm:mt-[-3rem]"
        />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-tight max-w-5xl mx-auto lg:text-6xl"
        >
          {t.hero.title}
          <span className="gold-text">{t.hero.titleHighlight}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 text-[11px] sm:text-xl text-muted-foreground font-light tracking-wide max-w-2xl mx-auto italic whitespace-nowrap"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#frota"
            className="gold-gradient text-primary-foreground px-8 py-4 rounded-md text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            {t.hero.exploreFleet}
          </a>
          <a
            href={`https://wa.me/16892981754?text=${encodeURIComponent("Olá, venho do site da Zeus e gostaria de realizar uma reserva!")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-primary text-primary px-8 py-4 rounded-md text-sm font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            {t.hero.contactUs}
          </a>
        </motion.div>

        <SearchBar />
      </div>

      <motion.a
        href="#frota"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="absolute bottom-16 sm:bottom-8 left-1/2 -translate-x-1/2 cursor-pointer opacity-30 hover:opacity-60 transition-opacity duration-300"
      >
        <ChevronDown className="text-primary/50" size={24} />
      </motion.a>
    </section>
  );
};

export default HeroSection;
