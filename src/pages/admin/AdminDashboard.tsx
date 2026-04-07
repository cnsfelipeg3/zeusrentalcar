import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarRange, Car, Users, DollarSign, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  totalVehicles: number;
  availableVehicles: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingBookings: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0, activeBookings: 0, totalVehicles: 0,
    availableVehicles: 0, totalCustomers: 0, totalRevenue: 0, pendingBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [bookings, vehicles, customers] = await Promise.all([
        supabase.from("bookings").select("*"),
        supabase.from("vehicles").select("*"),
        supabase.from("customers").select("id"),
      ]);

      const bList = bookings.data || [];
      const vList = vehicles.data || [];
      const cList = customers.data || [];

      setStats({
        totalBookings: bList.length,
        activeBookings: bList.filter((b) => b.status === "confirmed" || b.status === "active" || b.status === "in_progress").length,
        pendingBookings: bList.filter((b) => b.status === "pending").length,
        totalVehicles: vList.length,
        availableVehicles: vList.filter((v) => v.status === "available").length,
        totalCustomers: cList.length,
        totalRevenue: bList.reduce((sum, b) => sum + (b.total_price || 0), 0),
      });

      setRecentBookings(bList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8));
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { label: "Reservas Totais", value: stats.totalBookings, icon: CalendarRange, color: "text-primary" },
    { label: "Ativas / Em Andamento", value: stats.activeBookings, icon: TrendingUp, color: "text-emerald-500" },
    { label: "Pendentes", value: stats.pendingBookings, icon: Clock, color: "text-yellow-500" },
    { label: "Veículos Disponíveis", value: `${stats.availableVehicles}/${stats.totalVehicles}`, icon: Car, color: "text-blue-400" },
    { label: "Clientes", value: stats.totalCustomers, icon: Users, color: "text-purple-400" },
    { label: "Receita Total", value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-primary" },
  ];

  const statusMap: Record<string, { label: string; className: string }> = {
    pending: { label: "Pendente", className: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20" },
    confirmed: { label: "Confirmada", className: "bg-blue-500/10 text-blue-500 border border-blue-500/20" },
    active: { label: "Ativa", className: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" },
    in_progress: { label: "Em andamento", className: "bg-amber-500/10 text-amber-600 border border-amber-500/20" },
    completed: { label: "Concluída", className: "bg-muted text-muted-foreground border border-border/30" },
    cancelled: { label: "Cancelada", className: "bg-destructive/10 text-destructive border border-destructive/20" },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral do sistema Zeus Rental Car</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className="bg-card/80 border-border/30 hover:border-primary/20 transition-all duration-200">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium leading-tight">{card.label}</p>
                <card.icon className={`h-4 w-4 ${card.color} opacity-50`} />
              </div>
              <p className={`text-xl font-bold ${card.color}`}>
                {loading ? "—" : card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent bookings */}
      <Card className="bg-card/80 border-border/30">
        <CardContent className="p-0">
          <div className="px-5 py-4 border-b border-border/20">
            <h2 className="text-sm font-semibold text-foreground">Reservas Recentes</h2>
          </div>
          {loading ? (
            <div className="p-6 flex justify-center">
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : recentBookings.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground text-center">Nenhuma reserva encontrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/20">
                    <th className="px-5 py-3 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Cliente</th>
                    <th className="px-5 py-3 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Retirada</th>
                    <th className="px-5 py-3 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Devolução</th>
                    <th className="px-5 py-3 text-right text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Valor</th>
                    <th className="px-5 py-3 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => {
                    const st = statusMap[b.status] || { label: b.status, className: "bg-muted text-muted-foreground border border-border/30" };
                    return (
                      <tr
                        key={b.id}
                        onClick={() => navigate(`/admin/bookings/${b.id}`)}
                        className="border-b border-border/10 hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-3.5 text-foreground font-medium">{b.customer_name}</td>
                        <td className="px-5 py-3.5 text-muted-foreground tabular-nums">{new Date(b.pickup_date).toLocaleDateString("pt-BR")}</td>
                        <td className="px-5 py-3.5 text-muted-foreground tabular-nums">{new Date(b.return_date).toLocaleDateString("pt-BR")}</td>
                        <td className="px-5 py-3.5 text-foreground font-medium text-right tabular-nums">${b.total_price?.toFixed(2) || "—"}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[10px] px-2 py-1 rounded-md font-semibold ${st.className}`}>{st.label}</span>
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
