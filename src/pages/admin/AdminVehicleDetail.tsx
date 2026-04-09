import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft, Loader2, Car, DollarSign, Gauge, Calendar,
  Users, Fuel, AlertTriangle, CheckCircle2, Clock,
  BarChart3, MapPin, FileText, Settings, Pencil, X,
  TrendingUp, Hash, Palette, StickyNote, CalendarDays
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Vehicle = {
  id: string;
  name: string;
  category: string;
  daily_price_usd: number;
  image_url: string | null;
  passengers: number;
  bags: number;
  transmission: string;
  fuel: string;
  year: number | null;
  status: string;
  features: string[] | null;
  purchase_price: number | null;
  initial_odometer: number | null;
  current_odometer: number | null;
  acquired_date: string | null;
  license_plate: string | null;
  vin: string | null;
  color: string | null;
  notes: string | null;
  created_at: string;
};

type BookingWithInspections = {
  id: string;
  customer_name: string;
  customer_email: string | null;
  pickup_date: string;
  return_date: string;
  pickup_location: string | null;
  return_location: string | null;
  total_price: number | null;
  status: string;
  created_at: string;
  checkin?: any;
  checkout?: any;
};

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  pending: { label: "Pendente", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30", dot: "bg-yellow-500" },
  confirmed: { label: "Confirmada", color: "bg-blue-500/10 text-blue-500 border-blue-500/30", dot: "bg-blue-500" },
  active: { label: "Ativa", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", dot: "bg-emerald-500" },
  completed: { label: "Concluída", color: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground" },
  cancelled: { label: "Cancelada", color: "bg-destructive/10 text-destructive border-destructive/30", dot: "bg-destructive" },
};

const vehicleStatusConfig: Record<string, { label: string; color: string }> = {
  available: { label: "Disponível", color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  rented: { label: "Alugado", color: "bg-blue-500/15 text-blue-500 border-blue-500/30" },
  maintenance: { label: "Manutenção", color: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30" },
  unavailable: { label: "Indisponível", color: "bg-destructive/15 text-destructive border-destructive/30" },
};

export default function AdminVehicleDetail() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [bookings, setBookings] = useState<BookingWithInspections[]>([]);
  const [editingDetails, setEditingDetails] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Vehicle>>({});

  useEffect(() => {
    loadData();
  }, [vehicleId]);

  const loadData = async () => {
    if (!vehicleId) return;
    setLoading(true);

    const [vRes, bRes, iRes] = await Promise.all([
      supabase.from("vehicles").select("*").eq("id", vehicleId).single(),
      supabase.from("bookings").select("*").eq("vehicle_id", vehicleId).order("pickup_date", { ascending: false }),
      supabase.from("vehicle_inspections").select("*").order("created_at", { ascending: false }),
    ]);

    if (vRes.data) {
      setVehicle(vRes.data as Vehicle);
      setEditForm(vRes.data as Vehicle);
    }

    const allInspections = iRes.data || [];
    const enriched = (bRes.data || []).map((b: any) => ({
      ...b,
      checkin: allInspections.find((i: any) => i.booking_id === b.id && i.type === "checkin"),
      checkout: allInspections.find((i: any) => i.booking_id === b.id && i.type === "checkout"),
    }));
    setBookings(enriched);
    setLoading(false);
  };

  const saveDetails = async () => {
    if (!vehicle) return;
    const { error } = await supabase.from("vehicles").update({
      purchase_price: editForm.purchase_price || 0,
      initial_odometer: editForm.initial_odometer || 0,
      current_odometer: editForm.current_odometer || 0,
      acquired_date: editForm.acquired_date || null,
      license_plate: editForm.license_plate || null,
      vin: editForm.vin || null,
      color: editForm.color || null,
      notes: editForm.notes || null,
    }).eq("id", vehicle.id);

    if (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } else {
      toast({ title: "Dados atualizados!" });
      setEditingDetails(false);
      loadData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vehicle) {
    return <p className="text-muted-foreground">Veículo não encontrado.</p>;
  }

  // Computed stats
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
  const avgRevenue = completedBookings.length > 0 ? totalRevenue / completedBookings.length : 0;
  const totalDays = bookings.reduce((sum, b) => {
    const days = Math.ceil(
      (new Date(b.return_date).getTime() - new Date(b.pickup_date).getTime()) / (1000 * 60 * 60 * 24)
    );
    return sum + Math.max(days, 1);
  }, 0);

  const inspectionsWithOdometer = bookings
    .filter((b) => b.checkin?.odometer_reading || b.checkout?.odometer_reading)
    .sort((a, b) => new Date(a.pickup_date).getTime() - new Date(b.pickup_date).getTime());

  const lastOdometer = inspectionsWithOdometer.length > 0
    ? inspectionsWithOdometer[inspectionsWithOdometer.length - 1]?.checkout?.odometer_reading
      || inspectionsWithOdometer[inspectionsWithOdometer.length - 1]?.checkin?.odometer_reading
    : vehicle.current_odometer;
  const kmTotal = lastOdometer && vehicle.initial_odometer ? lastOdometer - vehicle.initial_odometer : null;

  const totalDamages = bookings.reduce((sum, b) => sum + ((b.checkout?.damages as any[])?.length || 0), 0);
  const uniqueClients = new Set(bookings.map((b) => b.customer_email || b.customer_name)).size;

  const daysSinceAcquired = vehicle.acquired_date
    ? Math.ceil((Date.now() - new Date(vehicle.acquired_date).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const utilizationRate = daysSinceAcquired ? ((totalDays / daysSinceAcquired) * 100).toFixed(1) : null;

  const roi = vehicle.purchase_price && vehicle.purchase_price > 0
    ? ((totalRevenue / vehicle.purchase_price) * 100).toFixed(1)
    : null;

  const vs = vehicleStatusConfig[vehicle.status] || vehicleStatusConfig.unavailable;

  // Timeline events
  const timelineEvents: { date: string; icon: any; title: string; description: string; color: string }[] = [];

  if (vehicle.acquired_date) {
    timelineEvents.push({
      date: vehicle.acquired_date,
      icon: Car,
      title: "Veículo adquirido",
      description: `Entrou na frota com ${vehicle.initial_odometer?.toLocaleString("pt-BR") || 0} km${vehicle.purchase_price ? ` • Valor: $${vehicle.purchase_price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : ""}`,
      color: "text-primary",
    });
  }

  bookings
    .sort((a, b) => new Date(a.pickup_date).getTime() - new Date(b.pickup_date).getTime())
    .forEach((b) => {
      const sc = statusConfig[b.status] || statusConfig.pending;
      timelineEvents.push({
        date: b.pickup_date,
        icon: Calendar,
        title: `Locação — ${b.customer_name}`,
        description: `${new Date(b.pickup_date).toLocaleDateString("pt-BR")} → ${new Date(b.return_date).toLocaleDateString("pt-BR")}${b.total_price ? ` • $${b.total_price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : ""} • ${sc.label}`,
        color: b.status === "completed" ? "text-emerald-500" : b.status === "active" ? "text-blue-500" : "text-muted-foreground",
      });
    });

  timelineEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/fleet")} className="mt-1">
          <ChevronLeft size={20} />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground">{vehicle.name}</h1>
            <Badge variant="outline" className={vs.color}>{vs.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {vehicle.category} • {vehicle.year} • {vehicle.transmission === "Automatic" ? "Automático" : "Manual"} • {vehicle.fuel}
            {vehicle.color && ` • ${vehicle.color}`}
            {vehicle.license_plate && ` • ${vehicle.license_plate}`}
          </p>
        </div>
      </div>

      {/* Vehicle image + info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Image */}
        {vehicle.image_url && (
          <Card className="border-border/40 overflow-hidden lg:col-span-1">
            <img src={vehicle.image_url} alt={vehicle.name} className="w-full h-48 lg:h-full object-cover" />
          </Card>
        )}

        {/* Key info */}
        <div className={`${vehicle.image_url ? "lg:col-span-2" : "lg:col-span-3"} grid grid-cols-2 md:grid-cols-3 gap-3`}>
          {[
            { icon: DollarSign, label: "Valor de Compra", value: vehicle.purchase_price ? `$${vehicle.purchase_price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—", sub: roi ? `ROI: ${roi}%` : "Não informado" },
            { icon: Gauge, label: "Odômetro Entrada", value: vehicle.initial_odometer ? `${vehicle.initial_odometer.toLocaleString("pt-BR")} km` : "—", sub: "Quando entrou na frota" },
            { icon: Gauge, label: "Odômetro Atual", value: lastOdometer ? `${lastOdometer.toLocaleString("pt-BR")} km` : vehicle.current_odometer ? `${vehicle.current_odometer.toLocaleString("pt-BR")} km` : "—", sub: kmTotal ? `${kmTotal.toLocaleString("pt-BR")} km rodados` : "—" },
            { icon: DollarSign, label: "Receita Total", value: `$${totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, sub: `Média $${avgRevenue.toFixed(0)}/locação` },
            { icon: Calendar, label: "Na Frota Há", value: daysSinceAcquired ? `${daysSinceAcquired} dias` : "—", sub: utilizationRate ? `${utilizationRate}% ocupação` : "—" },
            { icon: BarChart3, label: "Locações", value: bookings.length.toString(), sub: `${uniqueClients} clientes • ${totalDamages} avarias` },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="border-border/40">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} className="text-primary" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{s.label}</span>
                  </div>
                  <p className="text-lg font-bold text-foreground leading-tight">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{s.sub}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="history">Histórico de Locações</TabsTrigger>
          <TabsTrigger value="details">Ficha Técnica</TabsTrigger>
        </TabsList>

        {/* Timeline */}
        <TabsContent value="timeline" className="mt-4">
          {timelineEvents.length === 0 ? (
            <Card className="border-border/40">
              <CardContent className="p-8 text-center">
                <Clock size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Nenhum evento registrado.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative pl-8">
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
              {timelineEvents.map((ev, i) => {
                const Icon = ev.icon;
                return (
                  <div key={i} className="relative mb-6 last:mb-0">
                    <div className={`absolute -left-8 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center`}>
                      <Icon size={14} className={ev.color} />
                    </div>
                    <div className="ml-4">
                      <p className="text-[11px] text-muted-foreground mb-0.5">
                        {new Date(ev.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                      <p className="font-semibold text-sm text-foreground">{ev.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{ev.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="mt-4">
          {bookings.length === 0 ? (
            <Card className="border-border/40">
              <CardContent className="p-8 text-center">
                <Car size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Nenhuma locação registrada.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => {
                const days = Math.ceil(
                  (new Date(b.return_date).getTime() - new Date(b.pickup_date).getTime()) / (1000 * 60 * 60 * 24)
                );
                const sc = statusConfig[b.status] || { label: b.status, color: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" };
                const kmDriven = b.checkin?.odometer_reading && b.checkout?.odometer_reading
                  ? b.checkout.odometer_reading - b.checkin.odometer_reading : null;
                const checkoutDamages = (b.checkout?.damages as any[])?.length || 0;

                return (
                  <Card
                    key={b.id}
                    className="border-border/40 hover:border-primary/20 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/bookings/${b.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-foreground">{b.customer_name}</span>
                            <Badge variant="outline" className={`text-[10px] ${sc.color}`}>{sc.label}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} />
                              {new Date(b.pickup_date).toLocaleDateString("pt-BR")} → {new Date(b.return_date).toLocaleDateString("pt-BR")}
                            </span>
                            <span>{days} dia(s)</span>
                          </div>
                          {(b.pickup_location || b.return_location) && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin size={11} />
                              {b.pickup_location || "—"} → {b.return_location || b.pickup_location || "—"}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground">Valor</p>
                            <p className="font-bold text-foreground">
                              ${b.total_price?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "—"}
                            </p>
                          </div>
                          {kmDriven !== null && (
                            <div className="text-center">
                              <p className="text-[10px] text-muted-foreground">Km</p>
                              <p className="font-bold text-foreground">{kmDriven.toLocaleString("pt-BR")}</p>
                            </div>
                          )}
                          {checkoutDamages > 0 && (
                            <div className="text-center">
                              <p className="text-[10px] text-muted-foreground">Avarias</p>
                              <p className="font-bold text-destructive">{checkoutDamages}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Inspection row */}
                      {(b.checkin || b.checkout) && (
                        <div className="mt-3 pt-3 border-t border-border/20 flex items-center gap-4 text-[11px] text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            {b.checkin?.completed_at ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Clock size={12} className="text-yellow-500" />}
                            Entrega: {b.checkin?.completed_at ? "Finalizada" : b.checkin ? "Rascunho" : "Pendente"}
                          </span>
                          <span className="flex items-center gap-1">
                            {b.checkout?.completed_at ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Clock size={12} className="text-yellow-500" />}
                            Devolução: {b.checkout?.completed_at ? "Finalizada" : b.checkout ? "Rascunho" : "Pendente"}
                          </span>
                          {b.checkin?.odometer_reading && (
                            <span>Odômetro: {b.checkin.odometer_reading.toLocaleString("pt-BR")} km</span>
                          )}
                          {b.checkout?.odometer_reading && (
                            <span>→ {b.checkout.odometer_reading.toLocaleString("pt-BR")} km</span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Details / Ficha Técnica */}
        <TabsContent value="details" className="mt-4">
          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Settings size={16} className="text-primary" /> Ficha do Veículo
                </h3>
                {!editingDetails ? (
                  <Button variant="outline" size="sm" onClick={() => { setEditForm(vehicle); setEditingDetails(true); }}>
                    <Pencil size={12} className="mr-1" /> Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingDetails(false)}>
                      <X size={12} className="mr-1" /> Cancelar
                    </Button>
                    <Button size="sm" onClick={saveDetails} className="gold-gradient text-primary-foreground">
                      Salvar
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: DollarSign, label: "Valor de Compra (USD)", key: "purchase_price", type: "number", format: (v: any) => v ? `$${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—" },
                  { icon: Gauge, label: "Odômetro na Aquisição (km)", key: "initial_odometer", type: "number", format: (v: any) => v ? `${Number(v).toLocaleString("pt-BR")} km` : "—" },
                  { icon: Gauge, label: "Odômetro Atual (km)", key: "current_odometer", type: "number", format: (v: any) => v ? `${Number(v).toLocaleString("pt-BR")} km` : "—" },
                  { icon: CalendarDays, label: "Data de Aquisição", key: "acquired_date", type: "date", format: (v: any) => v ? new Date(v).toLocaleDateString("pt-BR") : "—" },
                  { icon: Hash, label: "Placa", key: "license_plate", type: "text", format: (v: any) => v || "—" },
                  { icon: Hash, label: "Chassi (VIN)", key: "vin", type: "text", format: (v: any) => v || "—" },
                  { icon: Palette, label: "Cor", key: "color", type: "text", format: (v: any) => v || "—" },
                ].map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key} className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Icon size={12} /> {field.label}
                      </label>
                      {editingDetails ? (
                        <input
                          type={field.type}
                          value={(editForm as any)[field.key] ?? ""}
                          onChange={(e) => setEditForm({ ...editForm, [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value })}
                          className="w-full h-9 px-3 rounded-lg border border-border/60 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      ) : (
                        <p className="text-sm font-medium text-foreground">{field.format((vehicle as any)[field.key])}</p>
                      )}
                    </div>
                  );
                })}

                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <StickyNote size={12} /> Observações
                  </label>
                  {editingDetails ? (
                    <textarea
                      value={editForm.notes ?? ""}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-border/60 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  ) : (
                    <p className="text-sm text-foreground">{vehicle.notes || "—"}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
