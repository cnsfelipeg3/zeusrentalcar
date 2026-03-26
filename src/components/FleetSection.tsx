import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, Smartphone, Settings } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import VehicleModal from "./VehicleModal";

// Main images (used as card thumbnail = front photo)
import corvetteFront from "@/assets/fleet/corvette-front.jpg";
import corvetteDashboard from "@/assets/fleet/corvette-dashboard.jpg";
import corvetteInterior from "@/assets/fleet/corvette-interior.jpg";
import corvetteRear from "@/assets/fleet/corvette-rear.jpg";

import mustangFront from "@/assets/fleet/mustang-front.jpg";
import mustangDashboard from "@/assets/fleet/mustang-dashboard.jpg";
import mustangInterior from "@/assets/fleet/mustang-interior.jpg";
import mustangRear from "@/assets/fleet/mustang-rear.jpg";

import escaladeFront from "@/assets/fleet/escalade-front.jpg";
import escaladeDashboard from "@/assets/fleet/escalade-dashboard.jpg";
import escaladeInterior from "@/assets/fleet/escalade-interior.jpg";
import escaladeRear from "@/assets/fleet/escalade-rear.jpg";

import bmwX5Front from "@/assets/fleet/bmw-x5-front.jpg";
import bmwX5Dashboard from "@/assets/fleet/bmw-x5-dashboard.jpg";
import bmwX5Interior from "@/assets/fleet/bmw-x5-interior.jpg";
import bmwX5Rear from "@/assets/fleet/bmw-x5-rear.jpg";

import suburbanFront from "@/assets/fleet/suburban-front.jpg";
import suburbanDashboard from "@/assets/fleet/suburban-dashboard.jpg";
import suburbanInterior from "@/assets/fleet/suburban-interior.jpg";
import suburbanRear from "@/assets/fleet/suburban-rear.jpg";

import durangoFront from "@/assets/fleet/durango-front.jpg";
import durangoDashboard from "@/assets/fleet/durango-dashboard.jpg";
import durangoInterior from "@/assets/fleet/durango-interior.jpg";
import durangoRear from "@/assets/fleet/durango-rear.jpg";

import sorentoFront from "@/assets/fleet/sorento-front.jpg";
import sorentoDashboard from "@/assets/fleet/sorento-dashboard.jpg";
import sorentoInterior from "@/assets/fleet/sorento-interior.jpg";
import sorentoRear from "@/assets/fleet/sorento-rear.jpg";

import sportageFront from "@/assets/fleet/sportage-front.jpg";
import sportageDashboard from "@/assets/fleet/sportage-dashboard.jpg";
import sportageInterior from "@/assets/fleet/sportage-interior.jpg";
import sportageRear from "@/assets/fleet/sportage-rear.jpg";

import outlanderFront from "@/assets/fleet/outlander-front.jpg";
import outlanderDashboard from "@/assets/fleet/outlander-dashboard.jpg";
import outlanderInterior from "@/assets/fleet/outlander-interior.jpg";
import outlanderRear from "@/assets/fleet/outlander-rear.jpg";

import tiguanFront from "@/assets/fleet/tiguan-front.jpg";
import tiguanDashboard from "@/assets/fleet/tiguan-dashboard.jpg";
import tiguanInterior from "@/assets/fleet/tiguan-interior.jpg";
import tiguanRear from "@/assets/fleet/tiguan-rear.jpg";

import pacificaFront from "@/assets/fleet/pacifica-front.jpg";
import pacificaDashboard from "@/assets/fleet/pacifica-dashboard.jpg";
import pacificaInterior from "@/assets/fleet/pacifica-interior.jpg";
import pacificaRear from "@/assets/fleet/pacifica-rear.jpg";

interface Vehicle {
  name: string;
  categoryKey: string;
  passengers: number;
  luggage?: number;
  images: string[];
}

const vehicles: Vehicle[] = [
  { name: "Corvette Stingray C8", categoryKey: "superSport", passengers: 2, images: [corvetteFront, corvetteDashboard, corvetteInterior, corvetteRear] },
  { name: "Mustang Conversível", categoryKey: "sport", passengers: 4, images: [mustangFront, mustangDashboard, mustangInterior, mustangRear] },
  { name: "Cadillac Escalade", categoryKey: "suvPremium", passengers: 7, luggage: 5, images: [escaladeFront, escaladeDashboard, escaladeInterior, escaladeRear] },
  { name: "BMW X5 M Sport", categoryKey: "suvPremium", passengers: 5, images: [bmwX5Front, bmwX5Dashboard, bmwX5Interior, bmwX5Rear] },
  { name: "Chevrolet Suburban", categoryKey: "suvFullSize", passengers: 7, luggage: 5, images: [suburbanFront, suburbanDashboard, suburbanInterior, suburbanRear] },
  { name: "Dodge Durango", categoryKey: "suv", passengers: 7, images: [durangoFront, durangoDashboard, durangoInterior, durangoRear] },
  { name: "Kia Sorento", categoryKey: "suv", passengers: 6, images: [sorentoFront, sorentoDashboard, sorentoInterior, sorentoRear] },
  { name: "Kia Sportage", categoryKey: "suv", passengers: 5, images: [sportageFront, sportageDashboard, sportageInterior, sportageRear] },
  { name: "Mitsubishi Outlander", categoryKey: "suv", passengers: 7, images: [outlanderFront, outlanderDashboard, outlanderInterior, outlanderRear] },
  { name: "Volkswagen Tiguan", categoryKey: "suv", passengers: 7, images: [tiguanFront, tiguanDashboard, tiguanInterior, tiguanRear] },
  { name: "Chrysler Pacifica", categoryKey: "minivan", passengers: 7, images: [pacificaFront, pacificaDashboard, pacificaInterior, pacificaRear] },
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
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
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
                  className="glass-card overflow-hidden group hover:gold-border-glow hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedVehicle(v)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={v.images[0]}
                      alt={v.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="gold-gradient text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        {categoryLabels[v.categoryKey]}
                      </span>
                    </div>
                    {/* Photo count badge */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
                      📷 {v.images.length} fotos
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

                    <button
                      className="mt-5 block w-full text-center gold-gradient text-primary-foreground py-3 rounded-md text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                      {t.fleet.book}
                    </button>
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

      {/* Vehicle Detail Modal */}
      <AnimatePresence>
        {selectedVehicle && (
          <VehicleModal
            vehicle={selectedVehicle}
            categoryLabel={categoryLabels[selectedVehicle.categoryKey]}
            onClose={() => setSelectedVehicle(null)}
            whatsappUrl={whatsappMsg(selectedVehicle.name)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default FleetSection;
