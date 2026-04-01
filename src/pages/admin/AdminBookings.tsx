import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Booking = {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
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

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pendente", variant: "outline" },
  confirmed: { label: "Confirmada", variant: "default" },
  active: { label: "Ativa", variant: "secondary" },
  completed: { label: "Concluída", variant: "outline" },
  cancelled: { label: "Cancelada", variant: "destructive" },
};

export default function AdminBookings() {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reservas</h1>
          <p className="text-sm text-muted-foreground mt-1">{bookings.length} reservas no total</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border/60 bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "confirmed", "active", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                statusFilter === s
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "border-border/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "all" ? "Todos" : statusConfig[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      <Card className="bg-card/50 border-border/40">
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-sm text-muted-foreground">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Nenhuma reserva encontrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-left">
                    <th className="p-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Cliente</th>
                    <th className="p-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Período</th>
                    <th className="p-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Local</th>
                    <th className="p-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Valor</th>
                    <th className="p-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Status</th>
                    <th className="p-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => {
                    const sc = statusConfig[b.status] || { label: b.status, variant: "outline" as const };
                    return (
                      <tr key={b.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <p className="text-foreground font-medium">{b.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{b.customer_email}</p>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(b.pickup_date).toLocaleDateString("pt-BR")} →{" "}
                          {new Date(b.return_date).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="p-4 text-muted-foreground text-xs">{b.pickup_location || "—"}</td>
                        <td className="p-4 text-foreground font-medium">${b.total_price?.toFixed(2) || "—"}</td>
                        <td className="p-4">
                          <select
                            value={b.status}
                            onChange={(e) => updateStatus(b.id, e.target.value)}
                            className="text-xs bg-background border border-border/40 rounded px-2 py-1 text-foreground"
                          >
                            {Object.entries(statusConfig).map(([key, val]) => (
                              <option key={key} value={key}>{val.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => deleteBooking(b.id)}
                            className="text-destructive/60 hover:text-destructive transition-colors"
                          >
                            <Trash2 size={14} />
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
