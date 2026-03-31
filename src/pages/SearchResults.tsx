import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Briefcase, CalendarIcon, MapPin, Clock, ArrowLeft, Check } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppBubble from "@/components/WhatsAppBubble";
import { vehiclePrices } from "@/data/vehicles";

// Re-import covers and vehicle data from FleetSection
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

interface SearchVehicle {
  name: string;
  categoryKey: string;
  passengers: number;
  luggage?: number;
  coverImage: string;
  preparing?: boolean;
}

const categoryLabels: Record<string, string> = {
  superSport: "Super Esportivo",
  sport: "Esportivo",
  suvPremium: "SUV Premium",
  suvFullSize: "SUV Full Size",
  suv: "SUV",
  suvCompact: "SUV Compacto",
  minivan: "Minivan",
};

const vehicles: SearchVehicle[] = [
  { name: "Corvette Stingray C8", categoryKey: "superSport", passengers: 2, luggage: 1, coverImage: corvetteCover },
  { name: "Mustang Conversível", categoryKey: "sport", passengers: 4, luggage: 2, coverImage: mustangCover },
  { name: "Cadillac Escalade", categoryKey: "suvPremium", passengers: 7, luggage: 5, coverImage: escaladeCover },
  { name: "BMW X5 M Sport", categoryKey: "suvPremium", passengers: 5, luggage: 3, coverImage: bmwX5Cover },
  { name: "Chevrolet Suburban", categoryKey: "suvFullSize", passengers: 7, luggage: 5, coverImage: suburbanCover },
  { name: "Dodge Durango", categoryKey: "suv", passengers: 7, luggage: 4, coverImage: durangoCover },
  { name: "Kia Sorento", categoryKey: "suv", passengers: 6, luggage: 3, coverImage: sorentoCover },
  { name: "Kia Sportage", categoryKey: "suv", passengers: 5, luggage: 3, coverImage: sportageCover },
  { name: "Mitsubishi Outlander", categoryKey: "suv", passengers: 7, luggage: 3, coverImage: outlanderCover },
  { name: "Volkswagen Tiguan", categoryKey: "suv", passengers: 7, luggage: 3, coverImage: tiguanCover },
  { name: "Chrysler Pacifica", categoryKey: "minivan", passengers: 7, luggage: 5, coverImage: pacificaCover },
  { name: "Lexus NX", categoryKey: "suvPremium", passengers: 5, luggage: 3, coverImage: lexusNxCover, preparing: true },
  { name: "Audi Q7", categoryKey: "suvPremium", passengers: 7, luggage: 4, coverImage: audiQ7Cover, preparing: true },
  { name: "Volvo XC60", categoryKey: "suvPremium", passengers: 5, luggage: 3, coverImage: volvoXc60Cover, preparing: true },
  { name: "MUSTANG CONVERSÍVEL", categoryKey: "sport", passengers: 4, luggage: 2, coverImage: mustangWhiteCover, preparing: true },
  { name: "VOLKSWAGEN TIGUAN", categoryKey: "suv", passengers: 7, luggage: 3, coverImage: tiguanWhiteCover, preparing: true },
  { name: "Nissan Kicks", categoryKey: "suvCompact", passengers: 5, luggage: 2, coverImage: nissanKicksCover, preparing: true },
  { name: "Volkswagen Atlas", categoryKey: "suvFullSize", passengers: 7, luggage: 5, coverImage: vwAtlasCover, preparing: true },
  { name: "Mercedes-Benz GLA", categoryKey: "suvPremium", passengers: 5, luggage: 3, coverImage: mercedesGlaCover, preparing: true },
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();

  const pickupDateStr = searchParams.get("pickupDate");
  const returnDateStr = searchParams.get("returnDate");
  const pickupTime = searchParams.get("pickupTime") || "10:00";
  const pickupLocation = searchParams.get("pickupLocation") || "";
  const returnLocation = searchParams.get("returnLocation") || pickupLocation;

  const pickupDate = pickupDateStr ? new Date(pickupDateStr) : null;
  const returnDate = returnDateStr ? new Date(returnDateStr) : null;

  const days = pickupDate && returnDate
    ? Math.max(1, Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  const whatsappMsg = (name: string) => {
    const dateInfo = pickupDate
      ? `\nRetirada: ${format(pickupDate, "dd/MM/yyyy", { locale: pt })} às ${pickupTime}\nLocal: ${pickupLocation}`
      : "";
    const returnInfo = returnDate
      ? `\nDevolução: ${format(returnDate, "dd/MM/yyyy", { locale: pt })}\nLocal devolução: ${returnLocation}`
      : "";
    return `https://wa.me/16892981754?text=${encodeURIComponent(
      `Olá! Tenho interesse no ${name}.${dateInfo}${returnInfo}\n\nGostaria de mais informações!`
    )}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back + Search Summary */}
          <div className="mb-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm mb-6"
            >
              <ArrowLeft size={16} />
              Voltar à página inicial
            </Link>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-wider mb-4">
              Veículos <span className="gold-text">Disponíveis</span>
            </h1>

            {/* Search criteria summary */}
            {(pickupDate || pickupLocation) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 rounded-xl inline-flex flex-wrap gap-4 text-sm"
              >
                {pickupDate && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <CalendarIcon size={14} className="text-primary" />
                    {format(pickupDate, "dd MMM yyyy", { locale: pt })}
                    {returnDate && ` → ${format(returnDate, "dd MMM yyyy", { locale: pt })}`}
                    <span className="text-primary font-semibold ml-1">({days} {days === 1 ? "dia" : "dias"})</span>
                  </span>
                )}
                {pickupTime && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock size={14} className="text-primary" />
                    {pickupTime}
                  </span>
                )}
                {pickupLocation && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin size={14} className="text-primary" />
                    {pickupLocation}
                  </span>
                )}
              </motion.div>
            )}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v, i) => {
              const dailyPrice = vehiclePrices[v.name] || 99;
              const totalPrice = dailyPrice * days;

              return (
                <motion.div
                  key={v.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={v.coverImage}
                      alt={v.name}
                      className="w-full h-full object-cover object-[center_40%] transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

                    {/* Availability badge */}
                    <div className="absolute top-3 left-3">
                      <span className="flex items-center gap-1 bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md backdrop-blur-sm">
                        <Check size={10} />
                        Disponível
                      </span>
                    </div>

                    {v.preparing && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-primary/90 text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md backdrop-blur-sm">
                          Em preparação
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-wider text-foreground">{v.name}</h3>
                        <p className="text-xs text-primary font-medium uppercase tracking-widest">
                          {categoryLabels[v.categoryKey] || v.categoryKey}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Users size={13} className="text-primary" /> {v.passengers} pass.
                      </span>
                      {v.luggage && (
                        <span className="flex items-center gap-1">
                          <Briefcase size={13} className="text-primary" /> {v.luggage} malas
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="border-t border-border/40 pt-4 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">A partir de</p>
                        <p className="text-2xl font-black text-foreground">
                          <span className="text-sm font-medium text-muted-foreground">US$ </span>
                          {dailyPrice}
                          <span className="text-sm font-medium text-muted-foreground"> /dia</span>
                        </p>
                        {days > 1 && (
                          <p className="text-xs text-primary font-semibold mt-0.5">
                            Total: US$ {totalPrice} ({days} dias)
                          </p>
                        )}
                      </div>

                      <a
                        href={whatsappMsg(v.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gold-gradient text-primary-foreground px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity whitespace-nowrap"
                      >
                        Reservar
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppBubble />
    </div>
  );
};

export default SearchResults;
