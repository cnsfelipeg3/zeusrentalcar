import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarIcon, Clock, MapPin, Search } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const locations = [
  "Aeroporto de Orlando (MCO)",
  "Aeroporto de Miami (MIA)",
  "Aeroporto de Tampa (TPA)",
  "Orlando (Entrega no Hotel)",
  "Miami (Entrega no Hotel)",
  "Kissimmee",
  "International Drive",
  "Lake Buena Vista",
];

const timeSlots = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00",
];

const SearchBar = () => {
  const navigate = useNavigate();
  const [pickupDate, setPickupDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("10:00");
  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [openPicker, setOpenPicker] = useState<string | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (pickupDate) params.set("pickupDate", pickupDate.toISOString());
    if (returnDate) params.set("returnDate", returnDate.toISOString());
    if (pickupTime) params.set("pickupTime", pickupTime);
    if (pickupLocation) params.set("pickupLocation", pickupLocation);
    if (returnLocation) params.set("returnLocation", returnLocation || pickupLocation);
    navigate(`/buscar?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      className="mt-10 w-full max-w-5xl mx-auto"
    >
      <div className="glass-card p-4 sm:p-6 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Pickup Date */}
          <Popover open={openPicker === "pickupDate"} onOpenChange={(o) => setOpenPicker(o ? "pickupDate" : null)}>
            <PopoverTrigger asChild>
              <button className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl border border-border/60 bg-background/50 text-left hover:border-primary/40 transition-colors w-full",
                pickupDate && "border-primary/30"
              )}>
                <CalendarIcon size={16} className="text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Retirada</p>
                  <p className="text-sm text-foreground truncate">
                    {pickupDate ? format(pickupDate, "dd MMM yyyy", { locale: pt }) : "Selecione"}
                  </p>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
              <Calendar
                mode="single"
                selected={pickupDate}
                onSelect={(d) => { setPickupDate(d); setOpenPicker(null); }}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* Return Date */}
          <Popover open={openPicker === "returnDate"} onOpenChange={(o) => setOpenPicker(o ? "returnDate" : null)}>
            <PopoverTrigger asChild>
              <button className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl border border-border/60 bg-background/50 text-left hover:border-primary/40 transition-colors w-full",
                returnDate && "border-primary/30"
              )}>
                <CalendarIcon size={16} className="text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Devolução</p>
                  <p className="text-sm text-foreground truncate">
                    {returnDate ? format(returnDate, "dd MMM yyyy", { locale: pt }) : "Selecione"}
                  </p>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
              <Calendar
                mode="single"
                selected={returnDate}
                onSelect={(d) => { setReturnDate(d); setOpenPicker(null); }}
                disabled={(date) => date < (pickupDate || new Date())}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* Pickup Time */}
          <Popover open={openPicker === "time"} onOpenChange={(o) => setOpenPicker(o ? "time" : null)}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border/60 bg-background/50 text-left hover:border-primary/40 transition-colors w-full">
                <Clock size={16} className="text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Horário</p>
                  <p className="text-sm text-foreground">{pickupTime}</p>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 bg-card border-border max-h-60 overflow-y-auto" align="start">
              {timeSlots.map((t) => (
                <button
                  key={t}
                  onClick={() => { setPickupTime(t); setOpenPicker(null); }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    pickupTime === t ? "text-primary font-semibold bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  {t}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          {/* Pickup Location */}
          <Popover open={openPicker === "pickupLoc"} onOpenChange={(o) => setOpenPicker(o ? "pickupLoc" : null)}>
            <PopoverTrigger asChild>
              <button className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl border border-border/60 bg-background/50 text-left hover:border-primary/40 transition-colors w-full",
                pickupLocation && "border-primary/30"
              )}>
                <MapPin size={16} className="text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Local Retirada</p>
                  <p className="text-sm text-foreground truncate">{pickupLocation || "Selecione"}</p>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-2 bg-card border-border" align="start">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => { setPickupLocation(loc); if (!returnLocation) setReturnLocation(loc); setOpenPicker(null); }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
                    pickupLocation === loc ? "text-primary font-semibold bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  {loc}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="gold-gradient text-primary-foreground font-bold uppercase tracking-widest h-auto py-3 rounded-xl hover:opacity-90 transition-opacity text-sm gap-2"
          >
            <Search size={16} />
            Buscar
          </Button>
        </div>

        {/* Return location (secondary row) */}
        <div className="mt-3">
          <Popover open={openPicker === "returnLoc"} onOpenChange={(o) => setOpenPicker(o ? "returnLoc" : null)}>
            <PopoverTrigger asChild>
              <button className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl border border-border/60 bg-background/50 text-left hover:border-primary/40 transition-colors w-full sm:w-auto sm:min-w-[280px]",
                returnLocation && "border-primary/30"
              )}>
                <MapPin size={16} className="text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Local Devolução</p>
                  <p className="text-sm text-foreground truncate">{returnLocation || "Mesmo local de retirada"}</p>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-2 bg-card border-border" align="start">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => { setReturnLocation(loc); setOpenPicker(null); }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
                    returnLocation === loc ? "text-primary font-semibold bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  {loc}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchBar;
