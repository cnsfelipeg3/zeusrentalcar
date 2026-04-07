import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Check, Upload, Loader2, User, Mail, Phone, FileText, MapPin, Calendar, Globe } from "lucide-react";
import zeusLogo from "@/assets/zeus-logo-hd.png";

const CustomerRegistration = () => {
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", document_number: "",
    nationality: "", date_of_birth: "", address: "", zip_code: "",
    house_number: "", complement: "",
  });
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const lookupCep = async (cep: string) => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        const addr = [data.logradouro, data.bairro, data.localidade, data.uf].filter(Boolean).join(", ");
        setForm(prev => ({ ...prev, address: addr }));
      }
    } catch {}
    setCepLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setLicenseFile(file);
    } else if (file) {
      toast({ title: "Arquivo muito grande", description: "Máximo 10MB", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) return toast({ title: "Nome é obrigatório", variant: "destructive" });
    if (!form.email.trim()) return toast({ title: "E-mail é obrigatório", variant: "destructive" });
    if (!form.phone.trim()) return toast({ title: "Telefone é obrigatório", variant: "destructive" });

    setSubmitting(true);

    try {
      let driverLicenseUrl: string | null = null;

      if (licenseFile) {
        const ext = licenseFile.name.split(".").pop();
        const path = `licenses/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("inspections").upload(path, licenseFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("inspections").getPublicUrl(path);
        driverLicenseUrl = urlData.publicUrl;
      }

      const email = form.email.trim().toLowerCase();
      const { data: existing } = await supabase
        .from("customers").select("id").eq("email", email).maybeSingle();

      if (existing) {
        await supabase.from("customers").update({
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
          document_number: form.document_number.trim() || null,
          nationality: form.nationality.trim() || null,
          date_of_birth: form.date_of_birth || null,
          address: form.address.trim() || null,
          house_number: form.house_number.trim() || null,
          complement: form.complement.trim() || null,
          zip_code: form.zip_code.trim() || null,
          ...(driverLicenseUrl ? { driver_license_file_url: driverLicenseUrl } : {}),
        }).eq("id", existing.id);
      } else {
        await supabase.from("customers").insert({
          full_name: form.full_name.trim(),
          email,
          phone: form.phone.trim(),
          document_number: form.document_number.trim() || null,
          nationality: form.nationality.trim() || null,
          date_of_birth: form.date_of_birth || null,
          address: form.address.trim() || null,
          house_number: form.house_number.trim() || null,
          complement: form.complement.trim() || null,
          zip_code: form.zip_code.trim() || null,
          driver_license_file_url: driverLicenseUrl,
        });
      }

      setSuccess(true);
    } catch (err: any) {
      toast({ title: "Erro ao cadastrar", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <img src={zeusLogo} alt="Zeus Rental Car" className="h-16 mx-auto" />
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <Check size={28} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Cadastro Realizado!</h1>
          <p className="text-muted-foreground text-sm">
            Obrigado, <strong>{form.full_name}</strong>! Seus dados foram cadastrados com sucesso.
            Nossa equipe entrará em contato em breve.
          </p>
        </div>
      </div>
    );
  }

  const fields = [
    { key: "full_name", label: "Nome Completo *", icon: User, type: "text", placeholder: "Seu nome completo" },
    { key: "email", label: "E-mail *", icon: Mail, type: "email", placeholder: "seu@email.com" },
    { key: "phone", label: "Celular (WhatsApp) *", icon: Phone, type: "tel", placeholder: "+55 11 99999-0000" },
    { key: "date_of_birth", label: "Data de Nascimento", icon: Calendar, type: "date", placeholder: "" },
    { key: "nationality", label: "Nacionalidade", icon: Globe, type: "text", placeholder: "Brasileira" },
    { key: "document_number", label: "CPF (se brasileiro)", icon: FileText, type: "text", placeholder: "000.000.000-00" },
    { key: "zip_code", label: "CEP / Zip Code", icon: MapPin, type: "text", placeholder: "00000-000" },
    { key: "address", label: "Rua / Logradouro", icon: MapPin, type: "text", placeholder: "Rua, bairro, cidade, estado" },
    { key: "house_number", label: "Número", icon: MapPin, type: "text", placeholder: "123" },
    { key: "complement", label: "Complemento", icon: MapPin, type: "text", placeholder: "Apto, bloco, sala..." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/40 bg-card/50">
        <div className="container mx-auto px-4 py-6 flex items-center justify-center">
          <img src={zeusLogo} alt="Zeus Rental Car" className="h-14" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Cadastro de Cliente</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Preencha seus dados para agilizar sua experiência conosco.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
            <div key={key}>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Icon size={11} className="text-primary/60" />
                {label}
              </label>
              <div className="relative">
                <input
                  type={type}
                  value={(form as any)[key]}
                  onChange={(e) => {
                    update(key, e.target.value);
                    if (key === "zip_code") lookupCep(e.target.value);
                  }}
                  placeholder={placeholder}
                  className="w-full h-10 px-3 rounded-lg border border-border/40 bg-card text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
                {key === "zip_code" && cepLoading && (
                  <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-spin" />
                )}
              </div>
            </div>
          ))}

          {/* Driver License Upload */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText size={11} className="text-primary/60" />
              Habilitação (CNH) — Foto ou PDF
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full h-10 px-3 rounded-lg border border-dashed border-border/60 bg-card/50 text-sm text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all flex items-center gap-2"
            >
              <Upload size={14} />
              {licenseFile ? licenseFile.name : "Tirar foto ou anexar arquivo"}
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 gold-gradient text-primary-foreground rounded-lg text-xs font-bold uppercase tracking-[0.12em] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 mt-6"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Cadastro"
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-muted-foreground/50 mt-6">
          Zeus Rental Car · Orlando & Miami · Seus dados estão protegidos.
        </p>
      </div>
    </div>
  );
};

export default CustomerRegistration;
