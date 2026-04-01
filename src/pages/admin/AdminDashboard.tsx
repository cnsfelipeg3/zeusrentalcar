import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarRange, Car, Users, DollarSign, TrendingUp, Clock } from "lucide-react";

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
        activeBookings: bList.filter((b) => b.status === "confirmed" || b.status === "active").length,
        pendingBookings: bList.filter((b) => b.status === "pending").length,
        totalVehicles: vList.length,
        availableVehicles: vList.filter((v) => v.status === "available").length,
        totalCustomers: cList.length,
        totalRevenue: bList.reduce((sum, b) => sum + (b.total_price || 0), 0),
      });

      setRecentBookings(bList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5));
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { label: "Reservas Totais", value: stats.totalBookings, icon: CalendarRange, color: "text-primary" },
    { label: "Reservas Ativas", value: stats.activeBookings, icon: TrendingUp, color: "text-green-500" },
    { label: "Pendentes", value: stats.pendingBookings, icon: Clock, color: "text-yellow-500" },
    { label: "Veículos", value: `${stats.availableVehicles}/${stats.totalVehicles}`, icon: Car, color: "text-blue-400" },
    { label: "Clientes", value: stats.totalCustomers, icon: Users, color: "text-purple-400" },
    { label: "Receita Total", value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-primary" },
  ];

  const statusMap: Record<string, { label: string; className: string }> = {
    pending: { label: "Pendente", className: "bg-yellow-500/10 text-yellow-500" },
    confirmed: { label: "Confirmada", className: "bg-green-500/10 text-green-500" },
    active: { label: "Ativa", className: "bg-blue-500/10 text-blue-400" },
    completed: { label: "Concluída", className: "bg-muted text-muted-foreground" },
    cancelled: { label: "Cancelada", className: "bg-destructive/10 text-destructive" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral do sistema Zeus Rental Car</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className="bg-card/50 border-border/40 hover:border-primary/20 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{card.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${card.color}`}>
                    {loading ? "—" : card.value}
                  </p>
                </div>
                <card.icon className={`h-8 w-8 ${card.color} opacity-40`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/50 border-border/40">
        <CardHeader>
          <CardTitle className="text-base">Reservas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : recentBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma reserva encontrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-left">
                    <th className="pb-2 text-xs text-muted-foreground uppercase tracking-wider font-medium">Cliente</th>
                    <th className="pb-2 text-xs text-muted-foreground uppercase tracking-wider font-medium">Retirada</th>
                    <th className="pb-2 text-xs text-muted-foreground uppercase tracking-wider font-medium">Devolução</th>
                    <th className="pb-2 text-xs text-muted-foreground uppercase tracking-wider font-medium">Valor</th>
                    <th className="pb-2 text-xs text-muted-foreground uppercase tracking-wider font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => {
                    const st = statusMap[b.status] || { label: b.status, className: "bg-muted text-muted-foreground" };
                    return (
                      <tr key={b.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                        <td className="py-3 text-foreground">{b.customer_name}</td>
                        <td className="py-3 text-muted-foreground">{new Date(b.pickup_date).toLocaleDateString("pt-BR")}</td>
                        <td className="py-3 text-muted-foreground">{new Date(b.return_date).toLocaleDateString("pt-BR")}</td>
                        <td className="py-3 text-foreground font-medium">${b.total_price?.toFixed(2) || "—"}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.className}`}>{st.label}</span>
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
