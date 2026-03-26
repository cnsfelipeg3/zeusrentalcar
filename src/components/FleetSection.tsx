import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, Smartphone, Settings } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

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
  categoryKey: string;
  passengers: number;
  luggage?: number;
  image: string;
}

const vehicles: Vehicle[] = [
  { name: "Corvette Stingray C8", categoryKey: "superSport", passengers: 2, image: corvetteImg },
  { name: "Mustang Conversível", categoryKey: "sport", passengers: 4, image: mustangImg },
  { name: "Cadillac Escalade", categoryKey: "suvPremium", passengers: 7, luggage: 5, image: escaladeImg },
  { name: "BMW X5 M Sport", categoryKey: "suvPremium", passengers: 5, image: bmwX5Img },
  { name: "Chevrolet Suburban", categoryKey: "suvFullSize", passengers: 7, luggage: 5, image: suburbanImg },
  { name: "Dodge Durango", categoryKey: "suv", passengers: 7, image: durangoImg },
  { name: "Kia Sorento", categoryKey: "suv", passengers: 6, image: sorentoImg },
  { name: "Kia Sportage", categoryKey: "suv", passengers: 5, image: sportageImg },
  { name: "Mitsubishi Outlander", categoryKey: "suv", passengers: 7, image: outlanderImg },
  { name: "Volkswagen Tiguan", categoryKey: "suv", passengers: 7, image: tiguanImg },
  { name: "Chrysler Pacifica", categoryKey: "minivan", passengers: 7, image: pacificaImg },
];

const categoryKeys = ["all", "superSport", "sport", "suvPremium", "suvFullSize", "suv", "minivan"] as const;
const passengerFilters = ["all", "2", "4-5", "6-7"];

const matchPassenger = (p: number, filter: string) => {
  if (filter === "all") return true;
  if (filter === "2") return p === 2;
  if (filter === "4-5") return p >= 4 && p <= 5;
  if (filter === "6-7") return p >= 6 && p <= 7;
  return true;
};

const FleetSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePassengers, setActivePassengers] = useState("all");
  const { t } = useLanguage();

  const categoryLabels: Record<string, string> = {
    all: t.fleet.all,
    superSport: t.fleet.superSport,
    sport: t.fleet.sport,
    suvPremium: t.fleet.suvPremium,
    suvFullSize: t.fleet.suvFullSize,
    suv: t.fleet.suv,
    minivan: t.fleet.minivan,
  };

  const passengerLabels: Record<string, string> = {
    all: t.fleet.all,
    "2": "2",
    "4-5": "4-5",
    "6-7": "6-7",
  };

  const filtered = vehicles.filter((v) => {
    const catMatch = activeCategory === "all" || v.categoryKey === activeCategory;
    const pasMatch = matchPassenger(v.passengers, activePassengers);
    return catMatch && pasMatch;
  });

  const whatsappMsg = (name: string) =>
    `https://wa.me/14075551234?text=${encodeURIComponent(t.fleet.whatsappMsg(name))}`;

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
            {t.fleet.sectionTag}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider">
            {t.fleet.title}<br />
            <span className="gold-text">{t.fleet.titleHighlight}</span>
          </h2>
        </motion.div>

        {/* Filters */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categoryKeys.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? "gold-gradient text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider self-center mr-2">{t.fleet.passengers}</span>
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
                {passengerLabels[pf]}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((v) => {
              const vehicleT = t.vehicles[v.name];
              return (
                <motion.div
                  key={v.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card overflow-hidden group hover:gold-border-glow hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="gold-gradient text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        {categoryLabels[v.categoryKey]}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-black uppercase tracking-wider">{v.name}</h3>
                    <p className="text-sm text-muted-foreground italic font-light mt-1">
                      {vehicleT?.subtitle}
                    </p>

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

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {vehicleT?.features.slice(0, 4).map((feat) => (
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
                      {t.fleet.book}
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground mt-12 text-lg">
            {t.fleet.noResults}
          </p>
        )}
      </div>
    </section>
  );
};

export default FleetSection;
