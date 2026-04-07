import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Trash2, LogIn, LogOut, GitCompare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendente", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  confirmed: { label: "Confirmada", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  active: { label: "Ativa", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  in_progress: { label: "Em andamento", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  completed: { label: "Concluída", color: "bg-muted text-muted-foreground border-border/30" },
  cancelled: { label: "Cancelada", color: "bg-red-500/10 text-red-500 border-red-500/20" },
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

export default function AdminBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    setBookings(data || []);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Reservas</h1>
        <p className="text-sm text-muted-foreground mt-1">{bookings.length} reservas no total</p>
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

      {/* Table */}
      <Card className="bg-card/80 border-border/30 overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-8 text-sm text-muted-foreground text-center">Nenhuma reserva encontrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30 bg-muted/20">
                    <th className="px-5 py-3 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Cliente</th>
                    <th className="px-5 py-3 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Período</th>
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
    </div>
  );
}
