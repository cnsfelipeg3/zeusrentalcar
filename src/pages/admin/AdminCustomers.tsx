import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Pencil, Trash2, X, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Customer = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  document_number: string | null;
  nationality: string | null;
  driver_license: string | null;
  notes: string | null;
  created_at: string;
  booking_count?: number;
};

const emptyCustomer = {
  full_name: "", email: "", phone: "", document_number: "",
  nationality: "", driver_license: "", notes: "",
};

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Customer> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: customersData } = await supabase.from("customers").select("*").order("full_name");
    const { data: bookingsData } = await supabase.from("bookings").select("customer_id");
    
    const countMap: Record<string, number> = {};
    (bookingsData || []).forEach((b: any) => {
      if (b.customer_id) countMap[b.customer_id] = (countMap[b.customer_id] || 0) + 1;
    });
    
    setCustomers((customersData || []).map(c => ({ ...c, booking_count: countMap[c.id] || 0 })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = customers.filter((c) =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || "").includes(search)
  );

  const save = async () => {
    if (!editing?.full_name) return toast({ title: "Nome obrigatório", variant: "destructive" });

    const payload = {
      full_name: editing.full_name,
      email: editing.email || null,
      phone: editing.phone || null,
      document_number: editing.document_number || null,
      nationality: editing.nationality || null,
      driver_license: editing.driver_license || null,
      notes: editing.notes || null,
    };

    if (isNew) {
      await supabase.from("customers").insert(payload);
      toast({ title: "Cliente adicionado" });
    } else {
      await supabase.from("customers").update(payload).eq("id", editing.id!);
      toast({ title: "Cliente atualizado" });
    }
    setEditing(null);
    load();
  };

  const deleteCustomer = async (id: string) => {
    if (!confirm("Excluir este cliente?")) return;
    await supabase.from("customers").delete().eq("id", id);
    toast({ title: "Cliente excluído" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-1">{customers.length} clientes cadastrados</p>
        </div>
        <button
          onClick={() => { setEditing({ ...emptyCustomer }); setIsNew(true); }}
          className="gold-gradient text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Adicionar
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente..."
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-border/60 bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card rounded-xl border border-border/50 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">{isNew ? "Novo Cliente" : "Editar Cliente"}</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              {[
                { label: "Nome completo", key: "full_name" },
                { label: "E-mail", key: "email" },
                { label: "Telefone", key: "phone" },
                { label: "Documento", key: "document_number" },
                { label: "Nacionalidade", key: "nationality" },
                { label: "CNH / Driver License", key: "driver_license" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">{field.label}</label>
                  <input
                    type="text"
                    value={(editing as any)[field.key] ?? ""}
                    onChange={(e) => setEditing({ ...editing, [field.key]: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border/60 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              ))}

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Observações</label>
                <textarea
                  value={editing.notes ?? ""}
                  onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border/60 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>

              <button
                onClick={save}
                className="w-full h-10 gold-gradient text-primary-foreground rounded-lg text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity mt-2"
              >
                {isNew ? "Adicionar" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <Card className="bg-card/50 border-border/40">
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-sm text-muted-foreground">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Nenhum cliente encontrado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-left">
                    <th className="p-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Nome</th>
                    <th className="p-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Contato</th>
                    <th className="p-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Documento</th>
                    <th className="p-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">CNH</th>
                    <th className="p-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Nacionalidade</th>
                    <th className="p-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Reservas</th>
                    <th className="p-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                      <td className="p-4 text-foreground font-medium">{c.full_name}</td>
                      <td className="p-4">
                        <p className="text-muted-foreground">{c.email || "—"}</p>
                        <p className="text-xs text-muted-foreground/70">{c.phone || ""}</p>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs font-mono">{c.document_number || "—"}</td>
                      <td className="p-4 text-muted-foreground text-xs">{c.driver_license || "—"}</td>
                      <td className="p-4 text-muted-foreground">{c.nationality || "—"}</td>
                      <td className="p-4">
                        {c.booking_count ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            <FileText size={10} /> {c.booking_count}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">0</span>
                        )}
                      </td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => { setEditing(c); setIsNew(false); }}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => deleteCustomer(c.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
