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
      `Diária: US$ ${dailyPrice}`,
      `Subtotal locação: US$ ${pricing.subtotalRental}`,
      premiumInsurance ? `Seguro Premium: US$ ${pricing.insuranceTotal}` : `Seguro Básico: Incluso`,
      childSeat ? `Cadeirinha (x${childSeatQty}): US$ ${pricing.childSeatTotal}` : "",
      tollTag ? `TAG Pedágios: US$ ${pricing.tollTagTotal}` : "",
      isDifferentCity ? `Taxa de retorno: US$ ${RETURN_FEE}` : "",
      pricing.qualifiesDiscount ? `Desconto 10+ diárias: -US$ ${pricing.discountAmount}` : "",
      ``,
      `*TOTAL: US$ ${pricing.total}*`,
      premiumInsurance ? `✅ Franquia: ZERO | Caução: ZERO` : `⚠️ Caução: US$ ${BASIC_DEPOSIT} | Franquia: US$ ${pricing.basicDeductible}`,
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
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm mb-8"
          >
            <ArrowLeft size={16} />
            Voltar aos resultados
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* LEFT: Vehicle + Extras */}
            <div className="lg:col-span-3 space-y-6">
              {/* Vehicle Hero Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <div className="relative h-64 sm:h-80">
                  <img
                    src={vehicle.coverImage}
                    alt={vehicle.name}
                    className="w-full h-full object-cover object-[center_40%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs text-primary font-bold uppercase tracking-[0.2em] mb-1">
                      {categoryLabels[vehicle.categoryKey]}
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-foreground">
                      {vehicle.name}
                    </h1>
                    {vehicleTrims[decodedName] && (
                      <p className="text-xs text-muted-foreground mt-0.5">{vehicleTrims[decodedName]}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1.5"><Users size={14} className="text-primary" /> {vehicle.passengers} passageiros</span>
                      {vehicle.luggage && <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-primary" /> {vehicle.luggage} malas</span>}
                      <span className="flex items-center gap-1.5"><Fuel size={14} className="text-primary" /> Gasolina</span>
                      <span className="flex items-center gap-1.5"><Gauge size={14} className="text-primary" /> Automático</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Trip Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CalendarIcon size={18} className="text-primary" />
                  Detalhes da <span className="gold-text">Viagem</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
                      <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center shrink-0 mt-0.5">
                        <CalendarIcon size={14} className="text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Retirada</p>
                        <p className="font-semibold text-foreground">
                          {pickupDate ? format(pickupDate, "dd 'de' MMMM, yyyy", { locale: pt }) : "—"}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><Clock size={12} /> {pickupTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
                      <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin size={14} className="text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Local de Retirada</p>
                        <p className="font-semibold text-foreground">{pickupLocation || "—"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
                      <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center shrink-0 mt-0.5">
                        <CalendarIcon size={14} className="text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Devolução</p>
                        <p className="font-semibold text-foreground">
                          {returnDate ? format(returnDate, "dd 'de' MMMM, yyyy", { locale: pt }) : "—"}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><Clock size={12} /> {returnTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
                      <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin size={14} className="text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Local de Devolução</p>
                        <p className="font-semibold text-foreground">{returnLocation || "—"}</p>
                        {isDifferentCity && (
                          <p className="text-xs text-amber-400 flex items-center gap-1 mt-1">
                            <AlertTriangle size={10} /> Cidade diferente — taxa de retorno aplicada
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
                  <p className="text-sm font-semibold text-primary">
                    {days} {days === 1 ? "diária" : "diárias"} • US$ {dailyPrice}/dia
                  </p>
                </div>
              </motion.div>

              {/* Vehicle Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Car size={18} className="text-primary" />
                  Destaques do <span className="gold-text">Veículo</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {vehicle.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/20 border border-border/20 text-sm">
                      <Check size={14} className="text-emerald-400 shrink-0" />
                      <span className="text-muted-foreground">{feat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Insurance Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-primary" />
                  Proteção & <span className="gold-text">Seguro</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Basic */}
                  <button
                    onClick={() => setPremiumInsurance(false)}
                    className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                      !premiumInsurance
                        ? "border-primary/60 bg-primary/5"
                        : "border-border/40 bg-card/30 hover:border-border/60"
                    }`}
                  >
                    {!premiumInsurance && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full gold-gradient flex items-center justify-center">
                        <Check size={12} className="text-primary-foreground" />
                      </div>
                    )}
                    <Shield size={24} className="text-muted-foreground mb-3" />
                    <h3 className="font-bold uppercase tracking-wider text-foreground mb-1">Seguro Básico</h3>
                    <p className="text-xs text-emerald-400 font-semibold mb-3">Já incluso</p>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-start gap-2"><Check size={12} className="text-emerald-400 mt-0.5 shrink-0" /> Cobertura contra colisão</li>
                      <li className="flex items-start gap-2"><Check size={12} className="text-emerald-400 mt-0.5 shrink-0" /> Cobertura contra roubo</li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle size={12} className="text-amber-400 mt-0.5 shrink-0" />
                        <span>Caução: <strong className="text-foreground">US$ {BASIC_DEPOSIT}</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle size={12} className="text-amber-400 mt-0.5 shrink-0" />
                        <span>Franquia: <strong className="text-foreground">US$ {pricing.basicDeductible}</strong></span>
                      </li>
                    </ul>
                  </button>

                  {/* Premium */}
                  <button
                    onClick={() => setPremiumInsurance(true)}
                    className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                      premiumInsurance
                        ? "border-primary/60 bg-primary/5 ring-1 ring-primary/20"
                        : "border-border/40 bg-card/30 hover:border-border/60"
                    }`}
                  >
                    {premiumInsurance && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full gold-gradient flex items-center justify-center">
                        <Check size={12} className="text-primary-foreground" />
                      </div>
                    )}
                    <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-md gold-gradient">
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary-foreground">Mais popular</span>
                    </div>
                    <ShieldCheck size={24} className="text-primary mb-3" />
                    <h3 className="font-bold uppercase tracking-wider text-foreground mb-1">Seguro Premium</h3>
                    <p className="text-xs text-primary font-semibold mb-3">+ US$ {Math.round(dailyPrice * PREMIUM_INSURANCE_RATE)} /dia</p>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-start gap-2"><Check size={12} className="text-emerald-400 mt-0.5 shrink-0" /> Cobertura total contra colisão</li>
                      <li className="flex items-start gap-2"><Check size={12} className="text-emerald-400 mt-0.5 shrink-0" /> Cobertura total contra roubo</li>
                      <li className="flex items-start gap-2">
                        <Check size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                        <span>Caução: <strong className="text-emerald-400">ZERO</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                        <span>Franquia: <strong className="text-emerald-400">ZERO</strong></span>
                      </li>
                      <li className="flex items-start gap-2"><Check size={12} className="text-emerald-400 mt-0.5 shrink-0" /> Proteção de vidros e pneus</li>
                      <li className="flex items-start gap-2"><Check size={12} className="text-emerald-400 mt-0.5 shrink-0" /> Assistência 24h prioritária</li>
                    </ul>
                  </button>
                </div>
              </motion.div>

              {/* Add-ons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Zap size={18} className="text-primary" />
                  Adicionais & <span className="gold-text">Extras</span>
                </h2>

                <div className="space-y-4">
                  {/* Child seat */}
                  <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                    childSeat ? "border-primary/40 bg-primary/5" : "border-border/30 bg-muted/10"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted/40 flex items-center justify-center">
                        <Baby size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">Cadeirinha para Bebê/Criança</p>
                        <p className="text-xs text-muted-foreground">Segurança homologada — ISOFIX</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-foreground whitespace-nowrap">US$ {CHILD_SEAT_DAILY}/dia</p>
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
                        <div className="flex items-center gap-3 pl-16 pb-2">
                          <p className="text-xs text-muted-foreground">Quantidade:</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setChildSeatQty(Math.max(1, childSeatQty - 1))}
                              className="w-7 h-7 rounded-md bg-muted/40 border border-border/40 text-foreground font-bold text-sm hover:bg-muted/60 transition-colors"
                            >
                              −
                            </button>
                            <span className="w-6 text-center font-bold text-foreground">{childSeatQty}</span>
                            <button
                              onClick={() => setChildSeatQty(Math.min(3, childSeatQty + 1))}
                              className="w-7 h-7 rounded-md bg-muted/40 border border-border/40 text-foreground font-bold text-sm hover:bg-muted/60 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-xs text-primary font-semibold">= US$ {CHILD_SEAT_DAILY * childSeatQty}/dia</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Toll Tag */}
                  <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                    tollTag ? "border-primary/40 bg-primary/5" : "border-border/30 bg-muted/10"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted/40 flex items-center justify-center">
                        <CircleDollarSign size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">TAG Ilimitada — Pedágios FL</p>
                        <p className="text-xs text-muted-foreground">SunPass — todos os pedágios da Flórida inclusos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-foreground whitespace-nowrap">US$ {TOLL_TAG_DAILY}/dia</p>
                      <Switch
                        checked={tollTag}
                        onCheckedChange={setTollTag}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Included for free */}
                  <div className="p-4 rounded-xl border border-border/20 bg-muted/5">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Já incluso na sua reserva</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      {["Quilometragem ilimitada", "Segundo motorista grátis", "Seguro básico", "Assistência 24h", "GPS integrado", "Limpeza completa"].map((item) => (
                        <div key={item} className="flex items-center gap-1.5">
                          <Check size={12} className="text-emerald-400 shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Sticky Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24 space-y-4"
              >
                {/* Price Summary Card */}
                <div className="glass-card rounded-2xl p-6 border border-primary/20">
                  <h2 className="text-lg font-bold uppercase tracking-wider mb-5 flex items-center gap-2">
                    <CircleDollarSign size={18} className="text-primary" />
                    Resumo do <span className="gold-text">Orçamento</span>
                  </h2>

                  <div className="space-y-3 text-sm">
                    {/* Rental */}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Locação ({days} {days === 1 ? "dia" : "dias"} × US$ {dailyPrice})</span>
                      <span className="font-semibold text-foreground">US$ {pricing.subtotalRental}</span>
                    </div>

                    {/* Insurance */}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {premiumInsurance ? "Seguro Premium" : "Seguro Básico"}
                      </span>
                      <span className={`font-semibold ${premiumInsurance ? "text-foreground" : "text-emerald-400"}`}>
                        {premiumInsurance ? `US$ ${pricing.insuranceTotal}` : "Incluso"}
                      </span>
                    </div>

                    {/* Child seat */}
                    {childSeat && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cadeirinha (x{childSeatQty})</span>
                        <span className="font-semibold text-foreground">US$ {pricing.childSeatTotal}</span>
                      </div>
                    )}

                    {/* Toll tag */}
                    {tollTag && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">TAG Pedágios FL</span>
                        <span className="font-semibold text-foreground">US$ {pricing.tollTagTotal}</span>
                      </div>
                    )}

                    {/* Return fee */}
                    {isDifferentCity && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          Taxa de retorno
                          <span className="text-[10px] text-amber-400">(cidade diferente)</span>
                        </span>
                        <span className="font-semibold text-foreground">US$ {RETURN_FEE}</span>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-border/40 my-2" />

                    {/* Discount */}
                    {pricing.qualifiesDiscount && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex justify-between items-center p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                      >
                        <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                          <Percent size={14} />
                          Desconto 10+ diárias
                        </span>
                        <span className="font-bold text-emerald-400">- US$ {pricing.discountAmount}</span>
                      </motion.div>
                    )}

                    {!pricing.qualifiesDiscount && days >= 7 && (
                      <div className="p-2 rounded-lg bg-primary/5 border border-primary/10 text-center">
                        <p className="text-[10px] uppercase tracking-widest text-primary">
                          Reserve {LONG_RENTAL_MIN_DAYS - days}+ dia(s) a mais e ganhe 5% OFF!
                        </p>
                      </div>
                    )}

                    {/* Total */}
                    <div className="pt-2">
                      <div className="flex justify-between items-end">
                        <span className="text-muted-foreground font-medium">Total</span>
                        <div className="text-right">
                          {pricing.qualifiesDiscount && (
                            <p className="text-xs text-muted-foreground line-through">US$ {pricing.subtotalBeforeDiscount}</p>
                          )}
                          <p className="text-2xl font-black text-foreground">
                            US$ {pricing.total}
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground text-right mt-1">
                        ≈ US$ {Math.round(pricing.total / days)} /dia (média)
                      </p>
                    </div>
                  </div>

                  {/* Deposit / Deductible info */}
                  <div className={`mt-4 p-3 rounded-xl text-xs ${
                    premiumInsurance
                      ? "bg-emerald-500/10 border border-emerald-500/20"
                      : "bg-amber-500/10 border border-amber-500/20"
                  }`}>
                    {premiumInsurance ? (
                      <div className="space-y-1">
                        <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <ShieldCheck size={14} /> Proteção Premium ativa
                        </p>
                        <p className="text-emerald-400/80">Caução: <strong>ZERO</strong> • Franquia: <strong>ZERO</strong></p>
                        <p className="text-emerald-400/60">Você está 100% protegido!</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="flex items-center gap-1.5 text-amber-400 font-semibold">
                          <AlertTriangle size={14} /> Seguro Básico
                        </p>
                        <p className="text-amber-400/80">Caução exigido: <strong>US$ {BASIC_DEPOSIT}</strong></p>
                        <p className="text-amber-400/80">Franquia em caso de sinistro: <strong>US$ {pricing.basicDeductible}</strong></p>
                        <p className="text-amber-400/60 mt-1">Upgrade para Premium e elimine esses custos!</p>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <a
                    href={whatsappMsg}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 w-full gold-gradient text-primary-foreground py-4 rounded-xl text-sm font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    Reservar pelo WhatsApp
                    <ChevronRight size={16} />
                  </a>

                  <p className="text-[10px] text-center text-muted-foreground mt-3">
                    Sem compromisso • Resposta em até 15 minutos
                  </p>
                </div>

                {/* Trust badges */}
                <div className="glass-card rounded-2xl p-5">
                  <div className="grid grid-cols-2 gap-3 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
                    {[
                      { icon: ShieldCheck, label: "Seguro incluso" },
                      { icon: Car, label: "Km ilimitado" },
                      { icon: Zap, label: "Retirada rápida" },
                      { icon: Users, label: "2º motorista grátis" },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-1.5 p-2">
                        <Icon size={18} className="text-primary" />
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
