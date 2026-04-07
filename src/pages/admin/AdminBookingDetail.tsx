import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, User, Mail, Phone, FileText, MapPin, Calendar,
  DollarSign, Car, LogIn, LogOut, GitCompare, Clock, Users,
  Shield, Fuel, Gauge
} from "lucide-react";

type Booking = {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_id: string | null;
  pickup_date: string;
  return_date: string;
  pickup_location: string | null;
  return_location: string | null;
  total_price: number | null;
  status: string;
  notes: string | null;
  driver_age: number | null;
  extra_driver: boolean | null;
  vehicle_id: string | null;
  created_at: string;
  updated_at: string;
};

type Customer = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  document_number: string | null;
  nationality: string | null;
  driver_license: string | null;
  notes: string | null;
};

type Vehicle = {
  id: string;
  name: string;
  category: string;
  daily_price_usd: number;
  passengers: number;
  bags: number;
  transmission: string;
  fuel: string;
  year: number | null;
  image_url: string | null;
  status: string;
};

type Inspection = {
  id: string;
  type: string;
  odometer_reading: number | null;
  fuel_level: string | null;
  damages: any;
  accessories_check: any;
  notes: string | null;
  agent_name: string | null;
  completed_at: string | null;
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendente", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30" },
  confirmed: { label: "Confirmada", color: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
  active: { label: "Ativa", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  in_progress: { label: "Em andamento", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  completed: { label: "Concluída", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  cancelled: { label: "Cancelada", color: "bg-red-500/10 text-red-500 border-red-500/30" },
};

export default function AdminBookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;
    const load = async () => {
      setLoading(true);
      const { data: b } = await supabase.from("bookings").select("*").eq("id", bookingId).single();
      if (!b) { setLoading(false); return; }
      setBooking(b);

      if (b.customer_id) {
        const { data: c } = await supabase.from("customers").select("*").eq("id", b.customer_id).single();
        setCustomer(c);
      }
      if (b.vehicle_id) {
        const { data: v } = await supabase.from("vehicles").select("*").eq("id", b.vehicle_id).single();
        setVehicle(v);
      }
      const { data: insp } = await supabase.from("vehicle_inspections").select("*").eq("booking_id", bookingId);
      setInspections(insp || []);
      setLoading(false);
    };
    load();
  }, [bookingId]);

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground">Carregando...</div>;
  if (!booking) return <div className="flex items-center justify-center py-20 text-muted-foreground">Reserva não encontrada.</div>;

  const checkin = inspections.find(i => i.type === "checkin");
  const checkout = inspections.find(i => i.type === "checkout");
  const pickup = new Date(booking.pickup_date);
  const returnD = new Date(booking.return_date);
  const days = Math.max(1, Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));
  const sc = statusConfig[booking.status] || statusConfig.pending;

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number | null | undefined }) => (
    <div className="flex items-start gap-3 py-2.5">
      <Icon size={15} className="text-primary mt-0.5 shrink-0" />
      <div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
        <p className="text-sm text-foreground font-medium">{value || "—"}</p>
      </div>
    </div>
  );

  const InspectionSummary = ({ insp, label }: { insp: Inspection | undefined; label: string }) => {
    if (!insp) return (
      <div className="rounded-xl border border-border/40 bg-card/50 p-5">
        <h3 className="text-sm font-semibold text-foreground mb-2">{label}</h3>
        <p className="text-xs text-muted-foreground">Inspeção ainda não realizada.</p>
      </div>
    );
    const damages = Array.isArray(insp.damages) ? insp.damages : [];
    const accessories = insp.accessories_check && typeof insp.accessories_check === "object" ? insp.accessories_check as Record<string, boolean> : {};
    const accessoryCount = Object.values(accessories).filter(Boolean).length;
    const totalAccessories = Object.keys(accessories).length;

    return (
      <div className="rounded-xl border border-border/40 bg-card/50 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
          {insp.completed_at && (
            <span className="text-[10px] text-muted-foreground">
              {new Date(insp.completed_at).toLocaleDateString("pt-BR")} às {new Date(insp.completed_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <Gauge size={16} className="mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Odômetro</p>
            <p className="text-sm font-bold text-foreground">{insp.odometer_reading?.toLocaleString() || "—"} km</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <Fuel size={16} className="mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Combustível</p>
            <p className="text-sm font-bold text-foreground">{insp.fuel_level || "—"}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <Shield size={16} className="mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Avarias</p>
            <p className={`text-sm font-bold ${damages.length > 0 ? "text-red-500" : "text-emerald-500"}`}>{damages.length}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <FileText size={16} className="mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Acessórios</p>
            <p className="text-sm font-bold text-foreground">{accessoryCount}/{totalAccessories}</p>
          </div>
        </div>
        {insp.agent_name && (
          <p className="text-[11px] text-muted-foreground">Agente: <span className="font-medium text-foreground">{insp.agent_name}</span></p>
        )}
        {insp.notes && (
          <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 italic">{insp.notes}</p>
        )}
        {damages.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Avarias registradas:</p>
            {damages.map((d: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className={`w-2 h-2 rounded-full shrink-0 ${d.severity === "medium" ? "bg-amber-500" : d.severity === "heavy" ? "bg-red-500" : "bg-yellow-400"}`} />
                <span className="text-foreground">{d.description}</span>
                <span className="text-muted-foreground/60">({d.position})</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <button
        onClick={() => navigate("/admin/bookings")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} /> Voltar para reservas
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{booking.customer_name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Reserva criada em {new Date(booking.created_at).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${sc.color} border text-xs px-3 py-1`}>{sc.label}</Badge>
          <div className="flex gap-1.5">
            <button
              onClick={() => navigate(`/admin/inspection/${booking.id}?type=checkin`)}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
            >
              <LogIn size={12} /> Entrega
            </button>
            <button
              onClick={() => navigate(`/admin/inspection/${booking.id}?type=checkout`)}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium"
            >
              <LogOut size={12} /> Devolução
            </button>
            <button
              onClick={() => navigate(`/admin/inspection/compare/${booking.id}`)}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-md bg-muted text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <GitCompare size={12} /> Comparar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Booking + Customer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking details */}
          <Card className="bg-card/50 border-border/40">
            <CardContent className="p-6">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Detalhes da Reserva</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <InfoRow icon={Calendar} label="Retirada" value={`${pickup.toLocaleDateString("pt-BR")} — ${booking.pickup_location || "Não informado"}`} />
                <InfoRow icon={Calendar} label="Devolução" value={`${returnD.toLocaleDateString("pt-BR")} — ${booking.return_location || "Não informado"}`} />
                <InfoRow icon={Clock} label="Duração" value={`${days} dia${days > 1 ? "s" : ""}`} />
                <InfoRow icon={DollarSign} label="Valor Total" value={booking.total_price ? `$${booking.total_price.toFixed(2)}` : "—"} />
                <InfoRow icon={Users} label="Condutor Adicional" value={booking.extra_driver ? "Sim" : "Não"} />
                <InfoRow icon={User} label="Idade do Condutor" value={booking.driver_age ? `${booking.driver_age} anos` : "—"} />
              </div>
              {booking.notes && (
                <div className="mt-4 pt-4 border-t border-border/30">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Observações</p>
                  <p className="text-sm text-muted-foreground italic">{booking.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inspections */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Inspeções</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InspectionSummary insp={checkin} label="Checkin (Entrega)" />
              <InspectionSummary insp={checkout} label="Checkout (Devolução)" />
            </div>
            {checkin && checkout && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg border border-border/30 bg-card/50 p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">KM Rodados</p>
                  <p className="text-lg font-bold text-foreground">
                    {checkin.odometer_reading && checkout.odometer_reading
                      ? (checkout.odometer_reading - checkin.odometer_reading).toLocaleString()
                      : "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-border/30 bg-card/50 p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Combustível Entrega</p>
                  <p className="text-lg font-bold text-foreground">{checkin.fuel_level || "—"}</p>
                </div>
                <div className="rounded-lg border border-border/30 bg-card/50 p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Combustível Devolução</p>
                  <p className="text-lg font-bold text-foreground">{checkout.fuel_level || "—"}</p>
                </div>
                <div className="rounded-lg border border-border/30 bg-card/50 p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Novas Avarias</p>
                  <p className={`text-lg font-bold ${
                    (Array.isArray(checkout.damages) ? checkout.damages.length : 0) > (Array.isArray(checkin.damages) ? checkin.damages.length : 0)
                      ? "text-red-500" : "text-emerald-500"
                  }`}>
                    {Math.max(0, (Array.isArray(checkout.damages) ? checkout.damages.length : 0) - (Array.isArray(checkin.damages) ? checkin.damages.length : 0))}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column - Customer + Vehicle */}
        <div className="space-y-6">
          {/* Customer */}
          <Card className="bg-card/50 border-border/40">
            <CardContent className="p-6">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Cliente</h2>
              {customer ? (
                <div className="space-y-1">
                  <InfoRow icon={User} label="Nome" value={customer.full_name} />
                  <InfoRow icon={Mail} label="E-mail" value={customer.email} />
                  <InfoRow icon={Phone} label="Telefone" value={customer.phone} />
                  <InfoRow icon={FileText} label="Documento (CPF)" value={customer.document_number} />
                  <InfoRow icon={FileText} label="CNH" value={customer.driver_license} />
                  <InfoRow icon={MapPin} label="Nacionalidade" value={customer.nationality} />
                  {customer.notes && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <p className="text-xs text-muted-foreground italic">{customer.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Cliente não vinculado.</p>
              )}
            </CardContent>
          </Card>

          {/* Vehicle */}
          <Card className="bg-card/50 border-border/40">
            <CardContent className="p-6">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Veículo</h2>
              {vehicle ? (
                <div className="space-y-1">
                  <InfoRow icon={Car} label="Modelo" value={`${vehicle.name}${vehicle.year ? ` ${vehicle.year}` : ""}`} />
                  <InfoRow icon={FileText} label="Categoria" value={vehicle.category} />
                  <InfoRow icon={DollarSign} label="Diária" value={`$${vehicle.daily_price_usd.toFixed(2)}`} />
                  <InfoRow icon={Users} label="Passageiros" value={vehicle.passengers} />
                  <InfoRow icon={FileText} label="Transmissão" value={vehicle.transmission} />
                  <InfoRow icon={Fuel} label="Combustível" value={vehicle.fuel} />
                  {vehicle.image_url && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <img src={vehicle.image_url} alt={vehicle.name} className="w-full rounded-lg object-cover" />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Veículo não vinculado.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
