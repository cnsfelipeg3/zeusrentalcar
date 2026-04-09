import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { UsersRound, Plus, X, Search, Pencil, Trash2, Phone, Mail, Shield, CheckCircle2, XCircle } from "lucide-react";

type TeamMember = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: string;
  position: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
};

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  manager: "Gerente",
  agent: "Agente",
  mechanic: "Mecânico",
};

const roleColors: Record<string, string> = {
  admin: "bg-primary/15 text-primary border-primary/20",
  manager: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  agent: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  mechanic: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

const emptyMember = { full_name: "", email: "", phone: "", role: "agent", position: "", notes: "" };

export default function AdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyMember);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("team_members").select("*").order("created_at", { ascending: false });
    setMembers((data as TeamMember[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.full_name.trim()) { toast({ title: "Nome é obrigatório", variant: "destructive" }); return; }

    if (editingId) {
      await supabase.from("team_members").update({
        full_name: form.full_name,
        email: form.email || null,
        phone: form.phone || null,
        role: form.role,
        position: form.position || null,
        notes: form.notes || null,
      }).eq("id", editingId);
      toast({ title: "Membro atualizado" });
    } else {
      await supabase.from("team_members").insert({
        full_name: form.full_name,
        email: form.email || null,
        phone: form.phone || null,
        role: form.role,
        position: form.position || null,
        notes: form.notes || null,
      });
      toast({ title: "Membro adicionado" });
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyMember);
    load();
  };

  const handleEdit = (m: TeamMember) => {
    setForm({ full_name: m.full_name, email: m.email || "", phone: m.phone || "", role: m.role, position: m.position || "", notes: m.notes || "" });
    setEditingId(m.id);
    setShowForm(true);
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    await supabase.from("team_members").update({ is_active: !current }).eq("id", id);
    toast({ title: current ? "Membro desativado" : "Membro ativado" });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este membro da equipe?")) return;
    await supabase.from("team_members").delete().eq("id", id);
    toast({ title: "Membro removido" });
    load();
  };

  const filtered = members.filter((m) =>
    m.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (m.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.role || "").toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: members.length,
    active: members.filter((m) => m.is_active).length,
    admins: members.filter((m) => m.role === "admin").length,
    agents: members.filter((m) => m.role === "agent").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <UsersRound className="h-6 w-6 text-primary" /> Equipe
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{stats.total} membros • {stats.active} ativos</p>
        </div>
        <button
          onClick={() => { setForm(emptyMember); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus size={14} /> Adicionar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, icon: UsersRound },
          { label: "Ativos", value: stats.active, icon: CheckCircle2 },
          { label: "Admins", value: stats.admins, icon: Shield },
          { label: "Agentes", value: stats.agents, icon: UsersRound },
        ].map((s) => (
          <Card key={s.label} className="border-border/30">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card className="border-primary/20 bg-card">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">{editingId ? "Editar Membro" : "Novo Membro"}</h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Nome completo *" className="h-9 px-3 rounded-lg border border-border/40 bg-background text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="E-mail" className="h-9 px-3 rounded-lg border border-border/40 bg-background text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telefone" className="h-9 px-3 rounded-lg border border-border/40 bg-background text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="h-9 px-3 rounded-lg border border-border/40 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Cargo / Função" className="h-9 px-3 rounded-lg border border-border/40 bg-background text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Observações" className="h-9 px-3 rounded-lg border border-border/40 bg-background text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-xs px-4 py-2 rounded-lg border border-border/40 text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
              <button onClick={handleSave} className="text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">{editingId ? "Salvar" : "Adicionar"}</button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar membro..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-border/40 bg-card/50 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
      </div>

      {/* Members list */}
      {loading ? (
        <div className="p-8 flex justify-center"><div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Nenhum membro encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((m) => (
            <Card key={m.id} className={`border-border/30 transition-all hover:shadow-md ${!m.is_active ? "opacity-50" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {m.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{m.full_name}</p>
                      {m.position && <p className="text-[11px] text-muted-foreground">{m.position}</p>}
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${roleColors[m.role] || roleColors.agent}`}>
                    {roleLabels[m.role] || m.role}
                  </span>
                </div>

                <div className="space-y-1.5 mb-3">
                  {m.email && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail size={11} /> <span className="truncate">{m.email}</span>
                    </div>
                  )}
                  {m.phone && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone size={11} /> <span>{m.phone}</span>
                    </div>
                  )}
                </div>

                {m.notes && <p className="text-[10px] text-muted-foreground/60 mb-3 line-clamp-2">{m.notes}</p>}

                <div className="flex items-center justify-between pt-2 border-t border-border/20">
                  <button
                    onClick={() => handleToggleActive(m.id, m.is_active)}
                    className={`flex items-center gap-1 text-[10px] font-medium transition-colors ${m.is_active ? "text-emerald-500 hover:text-emerald-600" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {m.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {m.is_active ? "Ativo" : "Inativo"}
                  </button>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(m)} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
