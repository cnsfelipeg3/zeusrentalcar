import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-b from-black via-background to-background" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(40,100%,48%,0.06)_0%,_transparent_70%)]" />

    {/* Decorative swoosh */}
    <svg className="absolute bottom-0 left-0 right-0 w-full opacity-10" viewBox="0 0 1440 200" fill="none">
      <path d="M0 200C240 100 480 50 720 80C960 110 1200 160 1440 120V200H0Z" fill="url(#goldGrad)" />
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1440" y2="0">
          <stop offset="0%" stopColor="hsl(40,100%,48%)" />
          <stop offset="100%" stopColor="hsl(47,100%,50%)" />
        </linearGradient>
      </defs>
    </svg>

    {/* Checkered pattern */}
    <div className="absolute top-0 right-0 w-40 h-40 opacity-[0.03]"
      style={{
        backgroundImage: "repeating-conic-gradient(hsl(0,0%,100%) 0% 25%, transparent 0% 50%)",
        backgroundSize: "20px 20px",
      }}
    />

    <div className="relative z-10 container mx-auto px-4 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight leading-tight max-w-5xl mx-auto"
      >
        Sua viagem em Orlando começa com o{" "}
        <span className="gold-text">carro certo.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-6 text-lg sm:text-xl text-muted-foreground font-light tracking-wide max-w-2xl mx-auto italic"
      >
        Conforto, espaço e praticidade para cada tipo de viagem.
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
          Explorar a Frota
        </a>
        <a
          href="https://wa.me/14075551234"
          target="_blank"
          rel="noopener noreferrer"
          className="border-2 border-primary text-primary px-8 py-4 rounded-md text-sm font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          Fale Conosco
        </a>
      </motion.div>
    </div>

    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <ChevronDown className="text-primary/50" size={32} />
    </motion.div>
  </section>
);

export default HeroSection;
