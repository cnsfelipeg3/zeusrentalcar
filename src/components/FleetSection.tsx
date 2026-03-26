import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, Smartphone, Settings, SlidersHorizontal, UserRound, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import VehicleModal from "./VehicleModal";

// Cover images (cinematic)
import corvetteCover from "@/assets/fleet/covers/corvette-cover.jpg";
import mustangCover from "@/assets/fleet/covers/mustang-cover.jpg";
import escaladeCover from "@/assets/fleet/covers/escalade-cover.jpg";
import bmwX5Cover from "@/assets/fleet/covers/bmw-x5-cover.jpg";
import suburbanCover from "@/assets/fleet/covers/suburban-cover.jpg";
import durangoCover from "@/assets/fleet/covers/durango-cover.jpg";
import sorentoCover from "@/assets/fleet/covers/sorento-cover.jpg";
import sportageCover from "@/assets/fleet/covers/sportage-cover.jpg";
import outlanderCover from "@/assets/fleet/covers/outlander-cover.jpg";
import tiguanCover from "@/assets/fleet/covers/tiguan-cover.jpg";
import pacificaCover from "@/assets/fleet/covers/pacifica-cover.jpg";
import lexusNxCover from "@/assets/fleet/covers/lexus-nx-cover.jpg";
import audiQ7Cover from "@/assets/fleet/covers/audi-q7-cover.jpg";
import volvoXc60Cover from "@/assets/fleet/covers/volvo-xc60-cover.jpg";
import mustangWhiteCover from "@/assets/fleet/covers/mustang-white-cover.jpg";
import tiguanWhiteCover from "@/assets/fleet/covers/tiguan-white-cover.jpg";
import nissanKicksCover from "@/assets/fleet/covers/nissan-kicks-cover.jpg";
import vwAtlasCover from "@/assets/fleet/covers/vw-atlas-cover.jpg";
import mercedesGlaCover from "@/assets/fleet/covers/mercedes-gla-cover.jpg";

export interface Vehicle {
  name: string;
  categoryKey: string;
  passengers: number;
  luggage?: number;
  coverImage: string;
  galleryImages: string[];
  galleryThumbs: string[];
}

const galleryImageMap = import.meta.glob("../assets/fleet/*.{jpg,jpeg,png}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const galleryThumbMap = import.meta.glob("../assets/fleet/thumbs/*.{jpg,jpeg,png}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const galleryViews = ["front", "dashboard", "interior", "rear"] as const;

const buildGallery = (slug: string) => {
  const images = galleryViews.map((view) => galleryImageMap[`../assets/fleet/${slug}-${view}.jpg`]);
  const thumbs = galleryViews.map(
    (view, index) =>
      galleryThumbMap[`../assets/fleet/thumbs/${slug}-${view}-thumb.jpg`] ?? images[index]
  );

  return { images, thumbs };
};

const buildSingleGallery = (slug: string) => {
  const img = galleryImageMap[`../assets/fleet/${slug}-front.jpg`];
  const thumb = galleryThumbMap[`../assets/fleet/thumbs/${slug}-front-thumb.jpg`] ?? img;
  return { images: [img], thumbs: [thumb] };
};

const corvetteGallery = buildGallery("corvette");
const mustangGallery = buildGallery("mustang");
const escaladeGallery = buildGallery("escalade");
const bmwX5Gallery = buildGallery("bmw-x5");
const suburbanGallery = buildGallery("suburban");
const durangoGallery = buildGallery("durango");
const sorentoGallery = buildGallery("sorento");
const sportageGallery = buildGallery("sportage");
const outlanderGallery = buildGallery("outlander");
const tiguanGallery = buildGallery("tiguan");
const pacificaGallery = buildGallery("pacifica");
const lexusNxGallery = buildSingleGallery("lexus-nx");
const audiQ7Gallery = buildSingleGallery("audi-q7");
const volvoXc60Gallery = buildSingleGallery("volvo-xc60");
const mustangWhiteGallery = buildSingleGallery("mustang-white");
const tiguanWhiteGallery = buildSingleGallery("tiguan-white");
const nissanKicksGallery = buildSingleGallery("nissan-kicks");
const vwAtlasGallery = buildSingleGallery("vw-atlas");
const mercedesGlaGallery = buildSingleGallery("mercedes-gla");

const vehicles: Vehicle[] = [
  { name: "Corvette Stingray C8", categoryKey: "superSport", passengers: 2, coverImage: corvetteCover, galleryImages: corvetteGallery.images, galleryThumbs: corvetteGallery.thumbs },
  { name: "Mustang Conversível", categoryKey: "sport", passengers: 4, coverImage: mustangCover, galleryImages: mustangGallery.images, galleryThumbs: mustangGallery.thumbs },
  { name: "Cadillac Escalade", categoryKey: "suvPremium", passengers: 7, luggage: 5, coverImage: escaladeCover, galleryImages: escaladeGallery.images, galleryThumbs: escaladeGallery.thumbs },
  { name: "BMW X5 M Sport", categoryKey: "suvPremium", passengers: 5, coverImage: bmwX5Cover, galleryImages: bmwX5Gallery.images, galleryThumbs: bmwX5Gallery.thumbs },
  { name: "Chevrolet Suburban", categoryKey: "suvFullSize", passengers: 7, luggage: 5, coverImage: suburbanCover, galleryImages: suburbanGallery.images, galleryThumbs: suburbanGallery.thumbs },
  { name: "Dodge Durango", categoryKey: "suv", passengers: 7, coverImage: durangoCover, galleryImages: durangoGallery.images, galleryThumbs: durangoGallery.thumbs },
  { name: "Kia Sorento", categoryKey: "suv", passengers: 6, coverImage: sorentoCover, galleryImages: sorentoGallery.images, galleryThumbs: sorentoGallery.thumbs },
  { name: "Kia Sportage", categoryKey: "suv", passengers: 5, coverImage: sportageCover, galleryImages: sportageGallery.images, galleryThumbs: sportageGallery.thumbs },
  { name: "Mitsubishi Outlander", categoryKey: "suv", passengers: 7, coverImage: outlanderCover, galleryImages: outlanderGallery.images, galleryThumbs: outlanderGallery.thumbs },
  { name: "Volkswagen Tiguan", categoryKey: "suv", passengers: 7, coverImage: tiguanCover, galleryImages: tiguanGallery.images, galleryThumbs: tiguanGallery.thumbs },
  { name: "Chrysler Pacifica", categoryKey: "minivan", passengers: 7, coverImage: pacificaCover, galleryImages: pacificaGallery.images, galleryThumbs: pacificaGallery.thumbs },
  { name: "Lexus NX", categoryKey: "suvPremium", passengers: 5, coverImage: lexusNxCover, galleryImages: lexusNxGallery.images, galleryThumbs: lexusNxGallery.thumbs },
  { name: "Audi Q7", categoryKey: "suvPremium", passengers: 7, coverImage: audiQ7Cover, galleryImages: audiQ7Gallery.images, galleryThumbs: audiQ7Gallery.thumbs },
  { name: "Volvo XC60", categoryKey: "suvPremium", passengers: 5, coverImage: volvoXc60Cover, galleryImages: volvoXc60Gallery.images, galleryThumbs: volvoXc60Gallery.thumbs },
  { name: "Mustang Conversível Branco", categoryKey: "sport", passengers: 4, coverImage: mustangWhiteCover, galleryImages: mustangWhiteGallery.images, galleryThumbs: mustangWhiteGallery.thumbs },
  { name: "Volkswagen Tiguan Branco", categoryKey: "suv", passengers: 7, coverImage: tiguanWhiteCover, galleryImages: tiguanWhiteGallery.images, galleryThumbs: tiguanWhiteGallery.thumbs },
  { name: "Nissan Kicks", categoryKey: "suvCompact", passengers: 5, coverImage: nissanKicksCover, galleryImages: nissanKicksGallery.images, galleryThumbs: nissanKicksGallery.thumbs },
  { name: "Volkswagen Atlas", categoryKey: "suvFullSize", passengers: 7, coverImage: vwAtlasCover, galleryImages: vwAtlasGallery.images, galleryThumbs: vwAtlasGallery.thumbs },
  { name: "Mercedes-Benz GLA", categoryKey: "suvPremium", passengers: 5, coverImage: mercedesGlaCover, galleryImages: mercedesGlaGallery.images, galleryThumbs: mercedesGlaGallery.thumbs },
];

const categoryKeys = ["all", "superSport", "sport", "suvPremium", "suvFullSize", "suv", "suvCompact", "minivan"] as const;
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
  const [openFilter, setOpenFilter] = useState<"category" | "passengers" | null>(null);
  const { t } = useLanguage();

  const categoryLabels: Record<string, string> = {
    all: t.fleet.all,
    superSport: t.fleet.superSport,
    sport: t.fleet.sport,
    suvPremium: t.fleet.suvPremium,
    suvFullSize: t.fleet.suvFullSize,
    suv: t.fleet.suv,
    minivan: t.fleet.minivan,
    suvCompact: t.fleet.suvCompact,
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
    `https://wa.me/16892981754?text=${encodeURIComponent(t.fleet.whatsappMsg(name))}`;

  const activeCount = filtered.length;
  const isPortuguese = t.fleet.sectionTag.includes("Frota");

  const toggleFilter = (filter: "category" | "passengers") => {
    setOpenFilter((prev) => (prev === filter ? null : filter));
  };

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

        <div className="mb-12 max-w-md mx-auto space-y-3">
          <div className="rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden">
            <button
              onClick={() => toggleFilter("category")}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal size={16} className="text-primary" />
                <span className="text-sm font-semibold uppercase tracking-[0.15em] text-foreground">
                  {isPortuguese ? "Categoria" : "Category"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {activeCategory !== "all" && (
                  <span className="text-xs text-primary font-medium">{categoryLabels[activeCategory]}</span>
                )}
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform duration-300 ${openFilter === "category" ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            <AnimatePresence>
              {openFilter === "category" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border/40 px-3 py-2">
                    {categoryKeys.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setOpenFilter(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-colors ${
                          activeCategory === cat
                            ? "text-primary font-semibold bg-primary/5"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        }`}
                      >
                        <span className="tracking-wide">{categoryLabels[cat]}</span>
                        {activeCategory === cat && <Check size={16} className="text-primary" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden">
            <button
              onClick={() => toggleFilter("passengers")}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <UserRound size={16} className="text-primary" />
                <span className="text-sm font-semibold uppercase tracking-[0.15em] text-foreground">
                  {t.fleet.passengers.replace(":", "")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {activePassengers !== "all" && (
                  <span className="text-xs text-primary font-medium">{activePassengers} pass.</span>
                )}
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform duration-300 ${openFilter === "passengers" ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            <AnimatePresence>
              {openFilter === "passengers" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border/40 px-3 py-2">
                    {passengerFilters.map((pf) => (
                      <button
                        key={pf}
                        onClick={() => {
                          setActivePassengers(pf);
                          setOpenFilter(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-colors ${
                          activePassengers === pf
                            ? "text-primary font-semibold bg-primary/5"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        }`}
                      >
                        <span className="tracking-wide">{passengerLabels[pf]}</span>
                        {activePassengers === pf && <Check size={16} className="text-primary" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-xs text-muted-foreground/70 tracking-wide pt-1">
            {activeCount} {activeCount === 1 ? "veículo" : "veículos"}
          </p>
        </div>

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
                  className="group relative overflow-hidden rounded-xl cursor-pointer hover:scale-[1.02] transition-all duration-300"
                  onClick={() => setSelectedVehicle(v)}
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={v.coverImage}
                      alt={v.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                      width={1280}
                      height={720}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-xl font-black uppercase tracking-wider text-white">{v.name}</h3>
                      <p className="text-sm text-white/60 italic font-light mt-1">{vehicleT?.subtitle}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-white/50">
                        <span className="flex items-center gap-1">
                          <Users size={13} className="text-primary" /> {v.passengers}
                        </span>
                        {v.luggage && (
                          <span className="flex items-center gap-1">
                            <Briefcase size={13} className="text-primary" /> {v.luggage}
                          </span>
                        )}
                      </div>
                    </div>
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

      <AnimatePresence>
        {selectedVehicle && (
          <VehicleModal
            vehicle={{
              name: selectedVehicle.name,
              categoryKey: selectedVehicle.categoryKey,
              passengers: selectedVehicle.passengers,
              luggage: selectedVehicle.luggage,
              images: selectedVehicle.galleryImages,
              thumbnails: selectedVehicle.galleryThumbs,
            }}
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
