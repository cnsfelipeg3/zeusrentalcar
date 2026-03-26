import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, Smartphone, Settings } from "lucide-react";

import corvetteImg from "@/assets/fleet/corvette.jpg";
import mustangImg from "@/assets/fleet/mustang.jpg";
import escaladeImg from "@/assets/fleet/escalade.jpg";
import bmwX5Img from "@/assets/fleet/bmw-x5.jpg";
import suburbanImg from "@/assets/fleet/suburban.jpg";
import durangoImg from "@/assets/fleet/durango.jpg";
import sorentoImg from "@/assets/fleet/sorento.jpg";
import sportageImg from "@/assets/fleet/sportage.jpg";
import outlanderImg from "@/assets/fleet/outlander.jpg";
import tiguanImg from "@/assets/fleet/tiguan.jpg";
import pacificaImg from "@/assets/fleet/pacifica.jpg";

interface Vehicle {
  name: string;
  category: string;
  categoryTag: string;
  passengers: number;
  luggage?: number;
  subtitle: string;
  features: string[];
  image: string;
}

const vehicles: Vehicle[] = [
  {
    name: "Corvette Stingray C8",
    category: "Super Esportivo",
    categoryTag: "Super Esportivo",
    passengers: 2,
    subtitle: "Performance e estilo em cada detalhe",
    features: ["Motor V8", "Conversível", "Piloto automático", "Painel digital", "CarPlay"],
    image: corvetteImg,
  },
  {
    name: "Mustang Conversível",
    category: "Esportivo",
    categoryTag: "Esportivo",
    passengers: 4,
    subtitle: "Dirija Orlando com exclusividade",
    features: ["Conversível", "Piloto automático", "Teto Solar Panorâmico", "Painel digital", "CarPlay"],
    image: mustangImg,
  },
  {
    name: "Cadillac Escalade",
    category: "SUV Full Size",
    categoryTag: "SUV Premium",
    passengers: 7,
    luggage: 5,
    subtitle: "Luxo com máxima sofisticação",
    features: ["Interior em couro de alto padrão", "Teto Solar Panorâmico", "Câmbio automático", "CarPlay"],
    image: escaladeImg,
  },
  {
    name: "BMW X5 M Sport",
    category: "SUV Premium",
    categoryTag: "SUV Premium",
    passengers: 5,
    subtitle: "SUV premium com praticidade",
    features: ["Interior em couro premium", "Teto Solar Panorâmico", "Câmbio automático", "CarPlay"],
    image: bmwX5Img,
  },
  {
    name: "Chevrolet Suburban",
    category: "SUV Full Size",
    categoryTag: "SUV Full Size",
    passengers: 7,
    luggage: 5,
    subtitle: "Grande ideal para famílias e grupos",
    features: ["Espaço interno amplo", "Teto Solar Panorâmico", "Câmbio automático", "CarPlay"],
    image: suburbanImg,
  },
  {
    name: "Dodge Durango",
    category: "SUV",
    categoryTag: "SUV",
    passengers: 7,
    subtitle: "Espaçoso com conforto e desempenho",
    features: ["Interior em couro premium", "Teto Solar", "Câmbio automático", "CarPlay"],
    image: durangoImg,
  },
  {
    name: "Kia Sorento",
    category: "SUV",
    categoryTag: "SUV",
    passengers: 6,
    subtitle: "Equilibrado com conforto e economia",
    features: ["Espaço interno versátil", "Teto Solar Panorâmico", "Câmbio automático", "CarPlay"],
    image: sorentoImg,
  },
  {
    name: "Kia Sportage",
    category: "SUV",
    categoryTag: "SUV",
    passengers: 5,
    subtitle: "Praticidade e economia",
    features: ["Teto Solar Panorâmico", "Espaço interno versátil", "Câmbio automático", "CarPlay"],
    image: sportageImg,
  },
  {
    name: "Mitsubishi Outlander",
    category: "SUV",
    categoryTag: "SUV",
    passengers: 7,
    subtitle: "Praticidade e economia",
    features: ["Teto Solar Panorâmico", "Espaço interno versátil", "Câmbio automático", "CarPlay"],
    image: outlanderImg,
  },
  {
    name: "Volkswagen Tiguan",
    category: "SUV",
    categoryTag: "SUV",
    passengers: 7,
    subtitle: "Versátil com ótimo espaço interno",
    features: ["Amplo espaço interno", "Câmbio automático", "CarPlay"],
    image: tiguanImg,
  },
  {
    name: "Chrysler Pacifica",
    category: "Minivan",
    categoryTag: "Minivan",
    passengers: 7,
    subtitle: "Ideal para grupos grandes",
    features: ["Máximo espaço interno", "Câmbio automático", "CarPlay"],
    image: pacificaImg,
  },
];

const categories = ["Todos", "Super Esportivo", "Esportivo", "SUV Premium", "SUV Full Size", "SUV", "Minivan"];
const passengerFilters = ["Todos", "2", "4-5", "6-7"];

const matchPassenger = (p: number, filter: string) => {
  if (filter === "Todos") return true;
  if (filter === "2") return p === 2;
  if (filter === "4-5") return p >= 4 && p <= 5;
  if (filter === "6-7") return p >= 6 && p <= 7;
  return true;
};

const FleetSection = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activePassengers, setActivePassengers] = useState("Todos");

  const filtered = vehicles.filter((v) => {
    const catMatch = activeCategory === "Todos" || v.categoryTag === activeCategory;
    const pasMatch = matchPassenger(v.passengers, activePassengers);
    return catMatch && pasMatch;
  });

  const whatsappMsg = (name: string) =>
    `https://wa.me/14075551234?text=${encodeURIComponent(`Olá! Tenho interesse no ${name}. Gostaria de saber sobre disponibilidade e valores.`)}`;

  return (
    <section id="frota" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-2">
            Frota Zeus Rental Car
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider">
            Encontre o modelo perfeito<br />
            <span className="gold-text">para sua viagem</span>
          </h2>
        </motion.div>

        {/* Filters */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? "gold-gradient text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider self-center mr-2">Passageiros:</span>
            {passengerFilters.map((pf) => (
              <button
                key={pf}
                onClick={() => setActivePassengers(pf)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activePassengers === pf
                    ? "gold-gradient text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {pf}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((v) => (
              <motion.div
                key={v.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="glass-card overflow-hidden group hover:gold-border-glow hover:scale-[1.02] transition-all duration-300"
              >
                {/* Car image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={v.image}
                    alt={v.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="gold-gradient text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      {v.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-black uppercase tracking-wider">{v.name}</h3>
                  <p className="text-sm text-muted-foreground italic font-light mt-1">{v.subtitle}</p>

                  {/* Specs */}
                  <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-primary" /> {v.passengers}
                    </span>
                    {v.luggage && (
                      <span className="flex items-center gap-1">
                        <Briefcase size={14} className="text-primary" /> {v.luggage}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Settings size={14} className="text-primary" /> Auto
                    </span>
                    <span className="flex items-center gap-1">
                      <Smartphone size={14} className="text-primary" /> CarPlay
                    </span>
                  </div>

                  {/* Features */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {v.features.slice(0, 4).map((feat) => (
                      <span
                        key={feat}
                        className="text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded bg-muted text-muted-foreground"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>

                  <a
                    href={whatsappMsg(v.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 block w-full text-center gold-gradient text-primary-foreground py-3 rounded-md text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                  >
                    Reservar
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground mt-12 text-lg">
            Nenhum veículo encontrado com os filtros selecionados.
          </p>
        )}
      </div>
    </section>
  );
};

export default FleetSection;
