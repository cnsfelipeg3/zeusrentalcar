import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Trash2, LogIn, LogOut, GitCompare, CalendarDays, List, ChevronLeft, ChevronRight, Clock, SlidersHorizontal, ArrowUpDown, X, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Booking = {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_id: string | null;
  pickup_date: string;
  return_date: string;
  pickup_time: string | null;
  return_time: string | null;
  pickup_location: string | null;
  return_location: string | null;
  total_price: number | null;
  status: string;
  notes: string | null;
  driver_age: number | null;
  extra_driver: boolean | null;
  vehicle_id: string | null;
  created_at: string;
  vehicle_name?: string;
};

const statusConfig: Record<string, { label: string; color: string; calBg: string; calText: string; accent: string }> = {
  pending:     { label: "Pendente",       color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", calBg: "bg-yellow-500/15", calText: "text-yellow-700 dark:text-yellow-400", accent: "border-l-yellow-500" },
  confirmed:   { label: "Confirmada",     color: "bg-blue-500/10 text-blue-500 border-blue-500/20",       calBg: "bg-blue-500/15",   calText: "text-blue-700 dark:text-blue-400",     accent: "border-l-blue-500" },
  active:      { label: "Ativa",          color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", calBg: "bg-emerald-500/15", calText: "text-emerald-700 dark:text-emerald-400", accent: "border-l-emerald-500" },
  in_progress: { label: "Em andamento",   color: "bg-amber-500/10 text-amber-600 border-amber-500/20",    calBg: "bg-amber-500/15",  calText: "text-amber-700 dark:text-amber-400",   accent: "border-l-amber-500" },
  completed:   { label: "Concluída",      color: "bg-muted text-muted-foreground border-border/30",       calBg: "bg-muted",          calText: "text-muted-foreground",                accent: "border-l-muted-foreground/40" },
  cancelled:   { label: "Cancelada",      color: "bg-red-500/10 text-red-500 border-red-500/20",          calBg: "bg-red-500/10",     calText: "text-red-600 dark:text-red-400",       accent: "border-l-red-500" },
};

function getBookingProgress(pickupDate: string, returnDate: string, status: string): number {
  if (status === "completed") return 100;
  if (status === "pending" || status === "confirmed" || status === "cancelled") return 0;
  const now = new Date().getTime();
  const start = new Date(pickupDate).getTime();
  const end = new Date(returnDate).getTime();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WEEKDAYS_FULL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// ─── Monthly Calendar ───────────────────────────────────────
function CalendarView({ bookings, navigate }: { bookings: Booking[]; navigate: (path: string) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const bookingsByDay = useMemo(() => {
    const map: Record<number, Booking[]> = {};
    bookings.forEach((b) => {
      const pickup = new Date(b.pickup_date);
      const ret = new Date(b.return_date);
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        if (date >= new Date(pickup.getFullYear(), pickup.getMonth(), pickup.getDate()) &&
            date <= new Date(ret.getFullYear(), ret.getMonth(), ret.getDate())) {
          if (!map[d]) map[d] = [];
          map[d].push(b);
        }
      }
    });
    return map;
  }, [bookings, year, month, daysInMonth]);

  const today = new Date();
  const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ChevronLeft size={16} />
          </button>
          <h2 className="text-lg font-bold text-foreground min-w-[180px] text-center capitalize">
            {new Date(year, month).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </h2>
          <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ChevronRight size={16} />
          </button>
        </div>
        <button onClick={goToday} className="text-xs px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium">
          Hoje
        </button>
      </div>

      <Card className="border-border/30 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b border-border/30 bg-muted/20">
            {WEEKDAYS.map((wd) => (
              <div key={wd} className="px-2 py-2.5 text-center text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                {wd}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const dayBookings = day ? (bookingsByDay[day] || []) : [];
              const showMax = 2;

              return (
                <div
                  key={i}
                  className={`min-h-[110px] border-b border-r border-border/15 p-1.5 transition-colors ${
                    day ? "bg-card/50 hover:bg-muted/30" : "bg-muted/10"
                  }`}
                >
                  {day && (
                    <>
                      <div className={`text-xs font-medium mb-1.5 w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday(day) ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayBookings.slice(0, showMax).map((b) => {
                          const sc = statusConfig[b.status] || statusConfig.pending;
                          const isPickup = new Date(b.pickup_date).getDate() === day && new Date(b.pickup_date).getMonth() === month;
                          const isReturn = new Date(b.return_date).getDate() === day && new Date(b.return_date).getMonth() === month;
                          const vehicleShort = b.vehicle_name ? b.vehicle_name.split(" ").slice(0, 2).join(" ") : "";
                          const customerFirst = b.customer_name.split(" ")[0];
                          const time = isPickup ? b.pickup_time : isReturn ? b.return_time : null;
                          return (
                            <div
                              key={b.id}
                              onClick={() => navigate(`/admin/bookings/${b.id}`)}
                              className={`text-[9px] leading-tight px-1.5 py-1 rounded-md cursor-pointer transition-all hover:scale-[1.02] hover:shadow-sm border ${sc.calBg} ${sc.calText} border-transparent hover:border-current/20`}
                              title={`${b.vehicle_name || "—"} • ${b.customer_name} — ${sc.label}${isPickup ? ` (Retirada ${b.pickup_time || ""})` : ""}${isReturn ? ` (Devolução ${b.return_time || ""})` : ""}`}
                            >
                              <div className="font-bold truncate">
                                {isPickup && <span className="opacity-60">→ </span>}
                                {isReturn && <span className="opacity-60">← </span>}
                                {vehicleShort || "—"}
                              </div>
                              <div className="opacity-70 truncate flex items-center gap-0.5">
                                {customerFirst}
                                {time && <span className="ml-auto opacity-60">{time}</span>}
                              </div>
                            </div>
                          );
                        })}
                        {dayBookings.length > showMax && (
                          <div className="text-[9px] text-muted-foreground font-medium px-1.5 cursor-default">
                            +{dayBookings.length - showMax} mais
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <CalendarLegend />
    </div>
  );
}

// ─── Weekly Calendar ───────────────────────────────────────
function WeeklyView({ bookings, navigate }: { bookings: Booking[]; navigate: (path: string) => void }) {
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay()); // start on Sunday
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [weekStart]);

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };
  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };
  const goToday = () => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    setWeekStart(d);
  };

  const bookingsByDay = useMemo(() => {
    const map: Record<string, { booking: Booking; isPickup: boolean; isReturn: boolean; isMid: boolean }[]> = {};
    weekDays.forEach((day) => {
      const key = day.toISOString().slice(0, 10);
      map[key] = [];
    });

    bookings.forEach((b) => {
      const pickup = new Date(b.pickup_date + "T00:00:00");
      const ret = new Date(b.return_date + "T00:00:00");

      weekDays.forEach((day) => {
        const dayMs = day.getTime();
        const pickupMs = new Date(pickup.getFullYear(), pickup.getMonth(), pickup.getDate()).getTime();
        const retMs = new Date(ret.getFullYear(), ret.getMonth(), ret.getDate()).getTime();

        if (dayMs >= pickupMs && dayMs <= retMs) {
          const key = day.toISOString().slice(0, 10);
          map[key].push({
            booking: b,
            isPickup: dayMs === pickupMs,
            isReturn: dayMs === retMs,
            isMid: dayMs > pickupMs && dayMs < retMs,
          });
        }
      });
    });
    return map;
  }, [bookings, weekDays]);

  const today = new Date();
  const todayStr = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().slice(0, 10);

  const weekEnd = weekDays[6];
  const rangeLabel = `${weekDays[0].toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} — ${weekEnd.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={prevWeek} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ChevronLeft size={16} />
          </button>
          <h2 className="text-lg font-bold text-foreground min-w-[220px] text-center">
            {rangeLabel}
          </h2>
          <button onClick={nextWeek} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ChevronRight size={16} />
          </button>
        </div>
        <button onClick={goToday} className="text-xs px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium">
          Hoje
        </button>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((day, i) => {
          const key = day.toISOString().slice(0, 10);
          const isToday = key === todayStr;
          const entries = bookingsByDay[key] || [];

          return (
            <div key={key} className="space-y-2">
              {/* Day header */}
              <div className={`text-center rounded-lg py-2 ${isToday ? "bg-primary text-primary-foreground" : "bg-muted/30"}`}>
                <div className="text-[10px] uppercase tracking-wider font-semibold opacity-70">
                  {WEEKDAYS_FULL[i]}
                </div>
                <div className={`text-lg font-bold ${isToday ? "" : "text-foreground"}`}>
                  {day.getDate()}
                </div>
                <div className="text-[10px] opacity-60">
                  {day.toLocaleDateString("pt-BR", { month: "short" })}
                </div>
              </div>

              {/* Bookings for this day */}
              <div className="space-y-2 min-h-[200px]">
                {entries.length === 0 && (
                  <div className="text-[10px] text-muted-foreground/40 text-center py-4">—</div>
                )}
                {entries.map(({ booking: b, isPickup, isReturn, isMid }) => {
                  const sc = statusConfig[b.status] || statusConfig.pending;
                  const vehicleShort = b.vehicle_name ? b.vehicle_name.split(" ").slice(0, 2).join(" ") : "—";
                  const customerFirst = b.customer_name.split(" ")[0];

                  return (
                    <div
                      key={b.id}
                      onClick={() => navigate(`/admin/bookings/${b.id}`)}
                      className={`rounded-lg p-2.5 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] border-l-[3px] ${sc.accent} ${sc.calBg} ${sc.calText}`}
                    >
                      {/* Movement badge */}
                      {(isPickup || isReturn) && (
                        <div className="flex items-center gap-1 mb-1.5">
                          {isPickup && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                              → Retirada
                            </span>
                          )}
                          {isReturn && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded">
                              ← Devolução
                            </span>
                          )}
                        </div>
                      )}
                      {isMid && (
                        <div className="text-[9px] font-medium uppercase tracking-wider opacity-50 mb-1">
                          Em uso
                        </div>
                      )}

                      {/* Vehicle */}
                      <div className="font-bold text-[11px] truncate">{vehicleShort}</div>

                      {/* Customer */}
                      <div className="text-[10px] opacity-70 truncate">{customerFirst}</div>

                      {/* Time */}
                      {(isPickup || isReturn) && (
                        <div className="flex items-center gap-1 mt-1.5 text-[9px] opacity-60">
                          <Clock size={9} />
                          <span>{isPickup ? (b.pickup_time || "—") : (b.return_time || "—")}</span>
                        </div>
                      )}

                      {/* Location */}
                      {isPickup && b.pickup_location && (
                        <div className="text-[9px] opacity-50 truncate mt-0.5">📍 {b.pickup_location}</div>
                      )}
                      {isReturn && b.return_location && (
                        <div className="text-[9px] opacity-50 truncate mt-0.5">📍 {b.return_location}</div>
                      )}

                      {/* Price */}
                      {b.total_price && (
                        <div className="text-[9px] font-semibold mt-1.5 opacity-80 tabular-nums">
                          ${b.total_price.toFixed(2)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <CalendarLegend />
    </div>
  );
}

// ─── Shared Legend ──────────────────────────────────────────
function CalendarLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-[10px]">
      {Object.entries(statusConfig).map(([key, val]) => (
        <div key={key} className="flex items-center gap-1.5">
          <div className={`w-2.5 h-2.5 rounded-sm ${val.calBg}`} />
          <span className="text-muted-foreground">{val.label}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5 ml-2 text-muted-foreground">
        <span>→ Retirada</span> <span>← Devolução</span>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────
export default function AdminBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "calendar" | "week">("table");

  const load = async () => {
    setLoading(true);
    const [bRes, vRes] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("vehicles").select("id, name"),
    ]);
    const vehicleMap: Record<string, string> = {};
    (vRes.data || []).forEach((v: any) => { vehicleMap[v.id] = v.name; });
    setBookings((bRes.data || []).map((b: any) => ({ ...b, vehicle_name: b.vehicle_id ? vehicleMap[b.vehicle_id] || "" : "" })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = bookings.filter((b) => {
    const matchSearch = b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      (b.customer_email || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    toast({ title: "Status atualizado" });
    load();
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta reserva?")) return;
    await supabase.from("bookings").delete().eq("id", id);
    toast({ title: "Reserva excluída" });
    load();
  };

  const allStatuses = ["all", "pending", "confirmed", "active", "in_progress", "completed", "cancelled"];

  const viewModes = [
    { key: "table" as const, label: "Lista", icon: List },
    { key: "calendar" as const, label: "Mês", icon: CalendarDays },
    { key: "week" as const, label: "Semana", icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Reservas</h1>
          <p className="text-sm text-muted-foreground mt-1">{bookings.length} reservas no total</p>
        </div>
        {/* View toggle */}
        <div className="flex items-center bg-muted/50 rounded-lg p-0.5 border border-border/30">
          {viewModes.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border/40 bg-card/50 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {allStatuses.map((s) => {
            const active = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-[10px] px-3 py-1.5 rounded-md font-semibold uppercase tracking-wider transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card/50 text-muted-foreground hover:text-foreground border border-border/30 hover:border-border/60"
                }`}
              >
                {s === "all" ? "Todos" : statusConfig[s]?.label || s}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="p-8 flex justify-center">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : viewMode === "calendar" ? (
        <CalendarView bookings={filtered} navigate={navigate} />
      ) : viewMode === "week" ? (
        <WeeklyView bookings={filtered} navigate={navigate} />
      ) : (
        /* Table */
        <Card className="bg-card/80 border-border/30 overflow-hidden">
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <p className="p-8 text-sm text-muted-foreground text-center">Nenhuma reserva encontrada.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30 bg-muted/20">
                      <th className="px-5 py-3 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Cliente</th>
                      <th className="px-5 py-3 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Período</th>
                      <th className="px-5 py-3 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Horários</th>
                      <th className="px-5 py-3 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Local</th>
                      <th className="px-5 py-3 text-right text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Valor</th>
                      <th className="px-5 py-3 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Status</th>
                      <th className="px-5 py-3 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-semibold min-w-[120px]">Progresso</th>
                      <th className="px-5 py-3 text-center text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Inspeção</th>
                      <th className="px-5 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b) => {
                      const progress = getBookingProgress(b.pickup_date, b.return_date, b.status);
                      const sc = statusConfig[b.status] || statusConfig.pending;
                      return (
                        <tr
                          key={b.id}
                          onClick={() => navigate(`/admin/bookings/${b.id}`)}
                          className="border-b border-border/10 hover:bg-muted/20 transition-colors cursor-pointer group"
                        >
                          <td className="px-5 py-3.5">
                            <p className="text-foreground font-medium text-[13px]">{b.customer_name}</p>
                            <p className="text-[11px] text-muted-foreground/60 mt-0.5">{b.customer_email}</p>
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground tabular-nums text-xs">
                            {new Date(b.pickup_date).toLocaleDateString("pt-BR")} → {new Date(b.return_date).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-muted-foreground tabular-nums">
                            <div className="flex flex-col gap-0.5">
                              <span className="flex items-center gap-1">
                                <span className="text-emerald-500 text-[10px]">→</span> {b.pickup_time || "—"}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="text-orange-500 text-[10px]">←</span> {b.return_time || "—"}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground text-xs max-w-[180px] truncate">{b.pickup_location || "—"}</td>
                          <td className="px-5 py-3.5 text-foreground font-semibold text-right tabular-nums">${b.total_price?.toFixed(2) || "—"}</td>
                          <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={b.status}
                              onChange={(e) => updateStatus(b.id, e.target.value)}
                              className={`text-[10px] font-semibold rounded-md px-2 py-1 border cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/30 ${sc.color}`}
                            >
                              {Object.entries(statusConfig).map(([key, val]) => (
                                <option key={key} value={key}>{val.label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    b.status === "completed" ? "bg-emerald-500"
                                    : b.status === "active" || b.status === "in_progress" ? "bg-amber-500"
                                    : "bg-muted-foreground/20"
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-muted-foreground font-medium tabular-nums min-w-[28px] text-right">{progress}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => navigate(`/admin/inspection/${b.id}?type=checkin`)}
                                className="flex items-center gap-1 text-[10px] px-2 py-1.5 rounded-md bg-primary/8 text-primary hover:bg-primary/15 transition-colors font-medium border border-primary/15"
                                title="Entrega"
                              >
                                <LogIn size={11} /> Entrega
                              </button>
                              <button
                                onClick={() => navigate(`/admin/inspection/${b.id}?type=checkout`)}
                                className="flex items-center gap-1 text-[10px] px-2 py-1.5 rounded-md bg-muted text-muted-foreground hover:text-foreground transition-colors font-medium border border-border/30"
                                title="Devolução"
                              >
                                <LogOut size={11} /> Devolução
                              </button>
                              <button
                                onClick={() => navigate(`/admin/inspection/compare/${b.id}`)}
                                className="flex items-center justify-center w-7 h-7 rounded-md bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border/30"
                                title="Comparar"
                              >
                                <GitCompare size={11} />
                              </button>
                            </div>
                          </td>
                          <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => deleteBooking(b.id)}
                              className="text-muted-foreground/30 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
