import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Users, Briefcase, Settings, Smartphone, MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface VehicleModalProps {
  vehicle: {
    name: string;
    categoryKey: string;
    passengers: number;
    luggage?: number;
    images: string[];
  };
  categoryLabel: string;
  onClose: () => void;
  whatsappUrl: string;
}

const VehicleModal = ({ vehicle, categoryLabel, onClose, whatsappUrl }: VehicleModalProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const { t } = useLanguage();
  const vehicleT = t.vehicles[vehicle.name];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % vehicle.images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border border-white/10 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image Gallery */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-t-xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={vehicle.images[currentImage]}
              alt={`${vehicle.name} - ${currentImage + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <ChevronRight size={22} />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {vehicle.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentImage ? "bg-primary scale-125" : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-2 p-3 sm:p-4 overflow-x-auto">
          {vehicle.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`flex-shrink-0 w-16 h-11 sm:w-20 sm:h-14 rounded-md overflow-hidden border-2 transition-all ${
                i === currentImage ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-5 pb-6 pt-1 sm:px-8 sm:pb-8 sm:pt-2 space-y-5 sm:space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-wider leading-tight">{vehicle.name}</h2>
            <p className="text-muted-foreground italic font-light mt-1.5 text-base sm:text-lg">{vehicleT?.subtitle}</p>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Users size={16} className="text-primary" /> {vehicle.passengers} {t.fleet.passengers.replace(":", "")}
            </span>
            {vehicle.luggage && (
              <span className="flex items-center gap-2">
                <Briefcase size={16} className="text-primary" /> {vehicle.luggage}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Settings size={16} className="text-primary" /> Auto
            </span>
            <span className="flex items-center gap-2">
              <Smartphone size={16} className="text-primary" /> CarPlay
            </span>
          </div>

          {/* Features */}
          <div className="rounded-xl border border-border/60 bg-muted/30 px-4 sm:px-5 py-2">
            <div className="divide-y divide-border/50">
              {vehicleT?.features.map((feat) => (
                <div key={feat} className="flex items-center justify-between gap-3 py-3.5 sm:py-3">
                  <span className="text-sm sm:text-base font-medium tracking-wide text-foreground">{feat}</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full gold-gradient text-primary-foreground py-4 sm:py-5 rounded-md text-sm sm:text-base font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            <MessageCircle size={18} />
            {t.fleet.book}
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VehicleModal;
