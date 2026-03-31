import { useSearchParams, Link, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Briefcase, CalendarIcon, MapPin, Clock, ArrowLeft, Shield, ShieldCheck,
  Baby, CircleDollarSign, Zap, ChevronRight, Check, AlertTriangle, Percent, Car, Fuel, Gauge
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppBubble from "@/components/WhatsAppBubble";
import { vehiclePrices, vehicleTrims } from "@/data/vehicles";
import { useCurrency } from "@/i18n/CurrencyContext";
import { Switch } from "@/components/ui/switch";

// Cover images
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

interface VehicleInfo {
  name: string;
  categoryKey: string;
  passengers: number;
  luggage?: number;
  coverImage: string;
  features: string[];
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

const vehicleMap: Record<string, VehicleInfo> = {
  "Corvette Stingray C8": { name: "Corvette Stingray C8", categoryKey: "superSport", passengers: 2, luggage: 1, coverImage: corvetteCover, features: ["Motor 6.2L V8", "495 HP", "Câmbio automático 8 marchas", "Apple CarPlay / Android Auto", "Modo Track", "Teto Targa removível"] },
  "Mustang Conversível": { name: "Mustang Conversível", categoryKey: "sport", passengers: 4, luggage: 2, coverImage: mustangCover, features: ["Motor 2.3L EcoBoost", "Capota conversível elétrica", "310 HP", "Apple CarPlay / Android Auto", "Câmbio automático 10 marchas", "Banco de couro aquecido"] },
  "Cadillac Escalade": { name: "Cadillac Escalade", categoryKey: "suvPremium", passengers: 7, luggage: 5, coverImage: escaladeCover, features: ["Motor 6.2L V8", "420 HP", "Tela OLED 38\"", "Sistema AKG 36 alto-falantes", "Bancos de couro ventilados", "Wi-Fi nativo"] },
  "BMW X5 M Sport": { name: "BMW X5 M Sport", categoryKey: "suvPremium", passengers: 5, luggage: 3, coverImage: bmwX5Cover, features: ["Motor 3.0L Turbo", "335 HP", "xDrive AWD", "Panoramic Roof", "Harman Kardon Sound", "Assistente de estacionamento"] },
  "Chevrolet Suburban": { name: "Chevrolet Suburban", categoryKey: "suvFullSize", passengers: 7, luggage: 5, coverImage: suburbanCover, features: ["Motor 5.3L V8", "355 HP", "3ª fileira de bancos", "Tela 10.2\"", "Wi-Fi nativo", "Espaço para até 8 malas"] },
  "Dodge Durango": { name: "Dodge Durango", categoryKey: "suv", passengers: 7, luggage: 4, coverImage: durangoCover, features: ["Motor 3.6L V6", "295 HP", "3ª fileira de bancos", "Uconnect 10.1\"", "Apple CarPlay", "Tração AWD disponível"] },
  "Kia Sorento": { name: "Kia Sorento", categoryKey: "suv", passengers: 6, luggage: 3, coverImage: sorentoCover, features: ["Motor 2.5L Turbo", "281 HP", "Câmbio DCT 8 marchas", "Tela 10.25\"", "Carregador wireless", "Bancos de couro"] },
  "Kia Sportage": { name: "Kia Sportage", categoryKey: "suv", passengers: 5, luggage: 3, coverImage: sportageCover, features: ["Motor 2.5L", "187 HP", "Tela panorâmica curva", "Apple CarPlay / Android Auto", "Assistente de faixa", "Câmera 360°"] },
  "Mitsubishi Outlander": { name: "Mitsubishi Outlander", categoryKey: "suv", passengers: 7, luggage: 3, coverImage: outlanderCover, features: ["Motor 2.5L", "181 HP", "3ª fileira de bancos", "Tela 9\"", "AWC (tração integral)", "Controle de cruzeiro adaptativo"] },
  "Volkswagen Tiguan": { name: "Volkswagen Tiguan", categoryKey: "suv", passengers: 7, luggage: 3, coverImage: tiguanCover, features: ["Motor 2.0L TSI", "184 HP", "3ª fileira de bancos", "Digital Cockpit", "App-Connect", "Tração 4Motion"] },
  "Chrysler Pacifica": { name: "Chrysler Pacifica", categoryKey: "minivan", passengers: 7, luggage: 5, coverImage: pacificaCover, features: ["Motor 3.6L V6", "287 HP", "Stow 'n Go Seats", "Uconnect Theater", "Portas deslizantes elétricas", "Aspirador de pó integrado"] },
  "Lexus NX": { name: "Lexus NX", categoryKey: "suvPremium", passengers: 5, luggage: 3, coverImage: lexusNxCover, features: ["Motor 2.5L Turbo", "275 HP", "Lexus Safety System+", "Tela 14\"", "Mark Levinson Audio", "Bancos ventilados"] },
  "Audi Q7": { name: "Audi Q7", categoryKey: "suvPremium", passengers: 7, luggage: 4, coverImage: audiQ7Cover, features: ["Motor 2.0L TFSI", "261 HP", "Quattro AWD", "Virtual Cockpit", "Bang & Olufsen 3D Sound", "Suspensão pneumática"] },
  "Volvo XC60": { name: "Volvo XC60", categoryKey: "suvPremium", passengers: 5, luggage: 3, coverImage: volvoXc60Cover, features: ["Motor 2.0L Turbo", "247 HP", "Pilot Assist", "Bowers & Wilkins Audio", "Tela Sensus 9\"", "City Safety"] },
  "MUSTANG CONVERSÍVEL": { name: "MUSTANG CONVERSÍVEL", categoryKey: "sport", passengers: 4, luggage: 2, coverImage: mustangWhiteCover, features: ["Motor 2.3L EcoBoost", "Capota conversível elétrica", "310 HP", "Apple CarPlay / Android Auto", "Câmbio automático 10 marchas", "Cor: Branco Oxford"] },
  "VOLKSWAGEN TIGUAN": { name: "VOLKSWAGEN TIGUAN", categoryKey: "suv", passengers: 7, luggage: 3, coverImage: tiguanWhiteCover, features: ["Motor 2.0L TSI", "184 HP", "3ª fileira de bancos", "Digital Cockpit", "App-Connect", "Cor: Branco Pure"] },
  "Nissan Kicks": { name: "Nissan Kicks", categoryKey: "suvCompact", passengers: 5, luggage: 2, coverImage: nissanKicksCover, features: ["Motor 1.6L", "122 HP", "Câmbio CVT", "Tela 8\"", "Apple CarPlay / Android Auto", "Câmera de ré inteligente"] },
  "Volkswagen Atlas": { name: "Volkswagen Atlas", categoryKey: "suvFullSize", passengers: 7, luggage: 5, coverImage: vwAtlasCover, features: ["Motor 3.6L V6", "276 HP", "3ª fileira de bancos", "Digital Cockpit Pro", "4Motion AWD", "Espaço amplo para família"] },
  "Mercedes-Benz GLA": { name: "Mercedes-Benz GLA", categoryKey: "suvPremium", passengers: 5, luggage: 3, coverImage: mercedesGlaCover, features: ["Motor 2.0L Turbo", "221 HP", "MBUX Infotainment", "Tela dupla 10.25\"", "Pacote AMG Line", "Suspensão esportiva"] },
};

const RETURN_FEE = 150;
const CHILD_SEAT_DAILY = 9;
const TOLL_TAG_DAILY = 4;
const PREMIUM_INSURANCE_RATE = 0.12;
const LONG_RENTAL_DISCOUNT_RATE = 0.05;
const LONG_RENTAL_MIN_DAYS = 10;
const BASIC_DEPOSIT = 550;
const DEDUCTIBLE_MULTIPLIER = 11;

const BookingDetails = () => {
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const [searchParams] = useSearchParams();
  const { formatPrice, currencySymbol } = useCurrency();

  const decodedName = decodeURIComponent(vehicleName || "");
  const vehicle = vehicleMap[decodedName];

  const pickupDateStr = searchParams.get("pickupDate");
  const returnDateStr = searchParams.get("returnDate");
  const pickupTime = searchParams.get("pickupTime") || "10:00";
  const returnTime = searchParams.get("returnTime") || "10:00";
  const pickupLocation = searchParams.get("pickupLocation") || "";
  const returnLocation = searchParams.get("returnLocation") || pickupLocation;

  const pickupDate = pickupDateStr ? new Date(pickupDateStr) : null;
  const returnDate = returnDateStr ? new Date(returnDateStr) : null;

  const days = pickupDate && returnDate
    ? Math.max(1, Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  // Extras state
  const [premiumInsurance, setPremiumInsurance] = useState(false);
  const [childSeat, setChildSeat] = useState(false);
  const [childSeatQty, setChildSeatQty] = useState(1);
  const [tollTag, setTollTag] = useState(false);

  // Check if different cities
  const isDifferentCity = useMemo(() => {
    if (!pickupLocation || !returnLocation) return false;
    return pickupLocation.trim().toLowerCase() !== returnLocation.trim().toLowerCase();
  }, [pickupLocation, returnLocation]);

  // Pricing calculations
  const dailyPrice = vehiclePrices[decodedName] || 99;
  const pricing = useMemo(() => {
    const subtotalRental = dailyPrice * days;
    const insuranceDailyExtra = premiumInsurance ? Math.round(dailyPrice * PREMIUM_INSURANCE_RATE) : 0;
    const insuranceTotal = insuranceDailyExtra * days;
    const childSeatTotal = childSeat ? CHILD_SEAT_DAILY * childSeatQty * days : 0;
    const tollTagTotal = tollTag ? TOLL_TAG_DAILY * days : 0;
    const returnFee = isDifferentCity ? RETURN_FEE : 0;

    const subtotalBeforeDiscount = subtotalRental + insuranceTotal + childSeatTotal + tollTagTotal + returnFee;

    const qualifiesDiscount = days >= LONG_RENTAL_MIN_DAYS;
    const discountAmount = qualifiesDiscount ? Math.round(subtotalBeforeDiscount * LONG_RENTAL_DISCOUNT_RATE) : 0;
    const total = subtotalBeforeDiscount - discountAmount;

    const basicDeductible = dailyPrice * DEDUCTIBLE_MULTIPLIER;

    return {
      dailyPrice,
      subtotalRental,
      insuranceDailyExtra,
      insuranceTotal,
      childSeatTotal,
      tollTagTotal,
      returnFee,
      subtotalBeforeDiscount,
      qualifiesDiscount,
      discountAmount,
      total,
      basicDeductible,
      deposit: premiumInsurance ? 0 : BASIC_DEPOSIT,
      deductible: premiumInsurance ? 0 : basicDeductible,
    };
  }, [dailyPrice, days, premiumInsurance, childSeat, childSeatQty, tollTag, isDifferentCity]);

  // WhatsApp message
  const whatsappMsg = useMemo(() => {
    const lines = [
      `Olá! Gostaria de reservar o *${decodedName}*.`,
      ``,
      `📅 *Período:*`,
      pickupDate ? `Retirada: ${format(pickupDate, "dd/MM/yyyy", { locale: pt })} às ${pickupTime}` : "",
      returnDate ? `Devolução: ${format(returnDate, "dd/MM/yyyy", { locale: pt })} às ${returnTime}` : "",
      `Duração: ${days} ${days === 1 ? "dia" : "dias"}`,
      ``,
      `📍 *Locais:*`,
      `Retirada: ${pickupLocation}`,
      `Devolução: ${returnLocation}`,
      ``,
      `💰 *Resumo do Orçamento:*`,
      `Diária: $\{formatPrice(dailyPrice)\}`,
      `Subtotal locação: $\{formatPrice(pricing.subtotalRental)\}`,
      premiumInsurance ? `Seguro Premium: $\{formatPrice(pricing.insuranceTotal)\}` : `Seguro Básico: Incluso`,
      childSeat ? `Cadeirinha (x${childSeatQty}): $\{formatPrice(pricing.childSeatTotal)\}` : "",
      tollTag ? `TAG Pedágios: $\{formatPrice(pricing.tollTagTotal)\}` : "",
      isDifferentCity ? `Taxa de retorno: $\{formatPrice(RETURN_FEE)\}` : "",
      pricing.qualifiesDiscount ? `Desconto 10+ diárias: -$\{formatPrice(pricing.discountAmount)\}` : "",
      ``,
      `*TOTAL: $\{formatPrice(pricing.total)\}*`,
      premiumInsurance ? `✅ Franquia: ZERO | Caução: ZERO` : `⚠️ Caução: $\{formatPrice(BASIC_DEPOSIT)\} | Franquia: $\{formatPrice(pricing.basicDeductible)\}`,
    ].filter(Boolean);

    return `https://wa.me/16892981754?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [decodedName, pickupDate, returnDate, pickupTime, returnTime, days, pickupLocation, returnLocation, dailyPrice, pricing, premiumInsurance, childSeat, childSeatQty, tollTag, isDifferentCity]);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Veículo não encontrado</h1>
          <Link to="/buscar" className="text-primary hover:underline">Voltar à busca</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back */}
          <Link
            to={`/buscar?${searchParams.toString()}`}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs tracking-wide mb-6"
          >
            <ArrowLeft size={14} />
            Voltar aos resultados
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* LEFT: Vehicle + Extras */}
            <div className="lg:col-span-3 space-y-5">
              {/* Vehicle Hero Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl overflow-hidden border border-border/40 bg-card"
              >
                <div className="relative h-56 sm:h-72">
                  <img
                    src={vehicle.coverImage}
                    alt={vehicle.name}
                    className="w-full h-full object-cover object-[center_40%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[10px] text-primary font-semibold uppercase tracking-[0.2em] mb-0.5">
                      {categoryLabels[vehicle.categoryKey]}
                    </p>
                    <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-foreground">
                      {vehicle.name}
                    </h1>
                    {vehicleTrims[decodedName] && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">{vehicleTrims[decodedName]}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1"><Users size={12} className="text-primary" /> {vehicle.passengers}</span>
                      {vehicle.luggage && <span className="flex items-center gap-1"><Briefcase size={12} className="text-primary" /> {vehicle.luggage}</span>}
                      <span className="flex items-center gap-1"><Fuel size={12} className="text-primary" /> Gasolina</span>
                      <span className="flex items-center gap-1"><Gauge size={12} className="text-primary" /> Auto</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Trip Details */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-xl border border-border/40 bg-card p-5"
              >
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 text-foreground">
                  <CalendarIcon size={15} className="text-primary" />
                  Detalhes da <span className="gold-text">Viagem</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/20 border border-border/20">
                      <div className="w-7 h-7 rounded-md gold-gradient flex items-center justify-center shrink-0 mt-0.5">
                        <CalendarIcon size={12} className="text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Retirada</p>
                        <p className="text-sm font-medium text-foreground">
                          {pickupDate ? format(pickupDate, "dd 'de' MMMM, yyyy", { locale: pt }) : ""}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={10} /> {pickupTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/20 border border-border/20">
                      <div className="w-7 h-7 rounded-md gold-gradient flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin size={12} className="text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Local de Retirada</p>
                        <p className="text-sm font-medium text-foreground">{pickupLocation || ""}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/20 border border-border/20">
                      <div className="w-7 h-7 rounded-md gold-gradient flex items-center justify-center shrink-0 mt-0.5">
                        <CalendarIcon size={12} className="text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Devolução</p>
                        <p className="text-sm font-medium text-foreground">
                          {returnDate ? format(returnDate, "dd 'de' MMMM, yyyy", { locale: pt }) : ""}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={10} /> {returnTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/20 border border-border/20">
                      <div className="w-7 h-7 rounded-md gold-gradient flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin size={12} className="text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Local de Devolução</p>
                        <p className="text-sm font-medium text-foreground">{returnLocation || ""}</p>
                        {isDifferentCity && (
                          <p className="text-[10px] text-amber-400 flex items-center gap-1 mt-1">
                            <AlertTriangle size={9} /> Cidade diferente
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-2.5 rounded-lg bg-primary/8 border border-primary/15 text-center">
                  <p className="text-xs font-semibold text-primary">
                    {days} {days === 1 ? "diária" : "diárias"} · {formatPrice(dailyPrice)}/dia
                  </p>
                </div>
              </motion.div>

              {/* Vehicle Features */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-border/40 bg-card p-5"
              >
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 text-foreground">
                  <Car size={15} className="text-primary" />
                  Destaques do <span className="gold-text">Veículo</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {vehicle.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-1.5 p-2 rounded-md bg-muted/15 border border-border/15 text-xs">
                      <Check size={12} className="text-emerald-400 shrink-0" />
                      <span className="text-muted-foreground">{feat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Insurance Selection */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-xl border border-border/40 bg-card p-5"
              >
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 text-foreground">
                  <Shield size={15} className="text-primary" />
                  Proteção & <span className="gold-text">Seguro</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Basic */}
                  <button
                    onClick={() => setPremiumInsurance(false)}
                    className={`relative p-4 rounded-lg border transition-all duration-300 text-left ${
                      !premiumInsurance
                        ? "border-primary/50 bg-primary/5"
                        : "border-border/30 bg-muted/10 hover:border-border/50"
                    }`}
                  >
                    {!premiumInsurance && (
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full gold-gradient flex items-center justify-center">
                        <Check size={10} className="text-primary-foreground" />
                      </div>
                    )}
                    <Shield size={18} className="text-muted-foreground mb-2" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-0.5">Seguro Básico</h3>
                    <p className="text-[10px] text-emerald-400 font-semibold mb-2.5">Já incluso</p>
                    <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                      <li className="flex items-start gap-1.5"><Check size={10} className="text-emerald-400 mt-0.5 shrink-0" /> Cobertura contra colisão</li>
                      <li className="flex items-start gap-1.5"><Check size={10} className="text-emerald-400 mt-0.5 shrink-0" /> Cobertura contra roubo</li>
                      <li className="flex items-start gap-1.5">
                        <AlertTriangle size={10} className="text-amber-400 mt-0.5 shrink-0" />
                        <span>Caução: <strong className="text-foreground">{formatPrice(BASIC_DEPOSIT)}</strong></span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <AlertTriangle size={10} className="text-amber-400 mt-0.5 shrink-0" />
                        <span>Franquia: <strong className="text-foreground">{formatPrice(pricing.basicDeductible)}</strong></span>
                      </li>
                    </ul>
                  </button>

                  {/* Premium */}
                  <button
                    onClick={() => setPremiumInsurance(true)}
                    className={`relative p-4 rounded-lg border transition-all duration-300 text-left ${
                      premiumInsurance
                        ? "border-primary/50 bg-primary/5 ring-1 ring-primary/15"
                        : "border-border/30 bg-muted/10 hover:border-border/50"
                    }`}
                  >
                    {premiumInsurance && (
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full gold-gradient flex items-center justify-center">
                        <Check size={10} className="text-primary-foreground" />
                      </div>
                    )}
                    <div className="absolute -top-2 left-3 px-2 py-0.5 rounded gold-gradient">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-primary-foreground">Recomendado</span>
                    </div>
                    <ShieldCheck size={18} className="text-primary mb-2" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-0.5">Seguro Premium</h3>
                    <p className="text-[10px] text-primary font-semibold mb-2.5">+ {formatPrice(Math.round(dailyPrice * PREMIUM_INSURANCE_RATE))} /dia</p>
                    <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                      <li className="flex items-start gap-1.5"><Check size={10} className="text-emerald-400 mt-0.5 shrink-0" /> Cobertura total contra colisão</li>
                      <li className="flex items-start gap-1.5"><Check size={10} className="text-emerald-400 mt-0.5 shrink-0" /> Cobertura total contra roubo</li>
                      <li className="flex items-start gap-1.5">
                        <Check size={10} className="text-emerald-400 mt-0.5 shrink-0" />
                        <span>Caução: <strong className="text-emerald-400">ZERO</strong></span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check size={10} className="text-emerald-400 mt-0.5 shrink-0" />
                        <span>Franquia: <strong className="text-emerald-400">ZERO</strong></span>
                      </li>
                      <li className="flex items-start gap-1.5"><Check size={10} className="text-emerald-400 mt-0.5 shrink-0" /> Proteção de vidros e pneus</li>
                      <li className="flex items-start gap-1.5"><Check size={10} className="text-emerald-400 mt-0.5 shrink-0" /> Assistência 24h prioritária</li>
                    </ul>
                  </button>
                </div>
              </motion.div>

              {/* Add-ons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-border/40 bg-card p-5"
              >
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 text-foreground">
                  <Zap size={15} className="text-primary" />
                  Adicionais & <span className="gold-text">Extras</span>
                </h2>

                <div className="space-y-3">
                  {/* Child seat */}
                  <div className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                    childSeat ? "border-primary/30 bg-primary/5" : "border-border/20 bg-muted/10"
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-muted/30 flex items-center justify-center">
                        <Baby size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">Cadeirinha Bebê/Criança</p>
                        <p className="text-[10px] text-muted-foreground">Homologada ISOFIX</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <p className="text-xs font-bold text-foreground whitespace-nowrap">{formatPrice(CHILD_SEAT_DAILY)}/dia</p>
                      <Switch
                        checked={childSeat}
                        onCheckedChange={setChildSeat}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {childSeat && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-2.5 pl-12 pb-1">
                          <p className="text-[10px] text-muted-foreground">Qtd:</p>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setChildSeatQty(Math.max(1, childSeatQty - 1))}
                              className="w-6 h-6 rounded bg-muted/30 border border-border/30 text-foreground font-medium text-xs hover:bg-muted/50 transition-colors"
                            >
                              −
                            </button>
                            <span className="w-5 text-center text-xs font-semibold text-foreground">{childSeatQty}</span>
                            <button
                              onClick={() => setChildSeatQty(Math.min(3, childSeatQty + 1))}
                              className="w-6 h-6 rounded bg-muted/30 border border-border/30 text-foreground font-medium text-xs hover:bg-muted/50 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-[10px] text-primary font-semibold">= {formatPrice(CHILD_SEAT_DAILY * childSeatQty)}/dia</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Toll Tag */}
                  <div className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                    tollTag ? "border-primary/30 bg-primary/5" : "border-border/20 bg-muted/10"
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-muted/30 flex items-center justify-center">
                        <CircleDollarSign size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">TAG Ilimitada Pedágios FL</p>
                        <p className="text-[10px] text-muted-foreground">SunPass inclusos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <p className="text-xs font-bold text-foreground whitespace-nowrap">{formatPrice(TOLL_TAG_DAILY)}/dia</p>
                      <Switch
                        checked={tollTag}
                        onCheckedChange={setTollTag}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Included for free */}
                  <div className="p-3 rounded-lg border border-border/15 bg-muted/5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-2">Já incluso na sua reserva</p>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground">
                      {["Quilometragem ilimitada", "Segundo motorista grátis", "Seguro básico", "Assistência 24h", "GPS integrado", "Limpeza completa"].map((item) => (
                        <div key={item} className="flex items-center gap-1">
                          <Check size={10} className="text-emerald-400 shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Sticky Summary */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="sticky top-24 space-y-4"
              >
                {/* Price Summary Card */}
                <div className="rounded-xl border border-primary/20 bg-card p-5">
                  <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 text-foreground">
                    <CircleDollarSign size={15} className="text-primary" />
                    Resumo do <span className="gold-text">Orçamento</span>
                  </h2>

                  <div className="space-y-2.5 text-xs">
                    {/* Rental */}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Locação ({days} {days === 1 ? "dia" : "dias"} × {formatPrice(dailyPrice)})</span>
                      <span className="font-semibold text-foreground">{formatPrice(pricing.subtotalRental)}</span>
                    </div>

                    {/* Insurance */}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {premiumInsurance ? "Seguro Premium" : "Seguro Básico"}
                      </span>
                      <span className={`font-semibold ${premiumInsurance ? "text-foreground" : "text-emerald-400"}`}>
                        {premiumInsurance ? `$\{formatPrice(pricing.insuranceTotal)\}` : "Incluso"}
                      </span>
                    </div>

                    {/* Child seat */}
                    {childSeat && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cadeirinha (x{childSeatQty})</span>
                        <span className="font-semibold text-foreground">{formatPrice(pricing.childSeatTotal)}</span>
                      </div>
                    )}

                    {/* Toll tag */}
                    {tollTag && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">TAG Pedágios FL</span>
                        <span className="font-semibold text-foreground">{formatPrice(pricing.tollTagTotal)}</span>
                      </div>
                    )}

                    {/* Return fee */}
                    {isDifferentCity && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          Taxa de retorno
                          <span className="text-[9px] text-amber-400">(cidade diferente)</span>
                        </span>
                        <span className="font-semibold text-foreground">{formatPrice(RETURN_FEE)}</span>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-border/30 my-1.5" />

                    {/* Discount */}
                    {pricing.qualifiesDiscount && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex justify-between items-center p-2 rounded-md bg-emerald-500/10 border border-emerald-500/15"
                      >
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Percent size={12} />
                          Desconto 10+ diárias
                        </span>
                        <span className="font-bold text-emerald-400">- {formatPrice(pricing.discountAmount)}</span>
                      </motion.div>
                    )}

                    {!pricing.qualifiesDiscount && days >= 7 && (
                      <div className="p-2 rounded-md bg-primary/5 border border-primary/10 text-center">
                        <p className="text-[9px] uppercase tracking-widest text-primary">
                          Reserve {LONG_RENTAL_MIN_DAYS - days}+ dia(s) a mais e ganhe 5% OFF
                        </p>
                      </div>
                    )}

                    {/* Total */}
                    <div className="pt-1.5">
                      <div className="flex justify-between items-end">
                        <span className="text-muted-foreground text-xs font-medium">Total</span>
                        <div className="text-right">
                          {pricing.qualifiesDiscount && (
                            <p className="text-[10px] text-muted-foreground line-through">{formatPrice(pricing.subtotalBeforeDiscount)}</p>
                          )}
                          <p className="text-xl font-bold text-foreground">
                            {formatPrice(pricing.total)}
                          </p>
                        </div>
                      </div>
                      <p className="text-[9px] text-muted-foreground text-right mt-0.5">
                        ≈ {formatPrice(Math.round(pricing.total / days))} /dia (média)
                      </p>
                    </div>
                  </div>

                  {/* Deposit / Deductible info */}
                  <div className={`mt-4 p-3 rounded-lg text-[11px] ${
                    premiumInsurance
                      ? "bg-emerald-500/8 border border-emerald-500/15"
                      : "bg-amber-500/8 border border-amber-500/15"
                  }`}>
                    {premiumInsurance ? (
                      <div className="space-y-0.5">
                        <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <ShieldCheck size={12} /> Proteção Premium ativa
                        </p>
                        <p className="text-emerald-400/80">Caução: <strong>ZERO</strong> · Franquia: <strong>ZERO</strong></p>
                        <p className="text-emerald-400/60">Você está 100% protegido</p>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <p className="flex items-center gap-1.5 text-amber-400 font-semibold">
                          <AlertTriangle size={12} /> Seguro Básico
                        </p>
                        <p className="text-amber-400/80">Caução: <strong>{formatPrice(BASIC_DEPOSIT)}</strong></p>
                        <p className="text-amber-400/80">Franquia: <strong>{formatPrice(pricing.basicDeductible)}</strong></p>
                        <p className="text-amber-400/60 mt-0.5">Upgrade para Premium e elimine esses custos</p>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <a
                    href={whatsappMsg}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full gold-gradient text-primary-foreground py-3 rounded-lg text-xs font-bold uppercase tracking-[0.12em] flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    Reservar pelo WhatsApp
                    <ChevronRight size={14} />
                  </a>

                  <p className="text-[9px] text-center text-muted-foreground mt-2">
                    Sem compromisso · Resposta em até 15 minutos
                  </p>
                </div>

                {/* Trust badges */}
                <div className="rounded-xl border border-border/30 bg-card p-4">
                  <div className="grid grid-cols-2 gap-2.5 text-center text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                    {[
                      { icon: ShieldCheck, label: "Seguro incluso" },
                      { icon: Car, label: "Km ilimitado" },
                      { icon: Zap, label: "Retirada rápida" },
                      { icon: Users, label: "2º motorista grátis" },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-1 p-1.5">
                        <Icon size={15} className="text-primary" />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppBubble />
    </div>
  );
};

export default BookingDetails;
