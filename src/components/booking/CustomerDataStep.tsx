import { useState, useRef } from "react";
import { User, Mail, Phone, Calendar, Globe, FileText, MapPin, Upload } from "lucide-react";

export interface CustomerData {
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  nationality: string;
  document_number: string;
  address: string;
  zip_code: string;
  licenseFile: File | null;
}

interface Props {
  data: CustomerData;
  onChange: (data: CustomerData) => void;
}

const fields = [
  { key: "full_name", label: "Nome Completo *", icon: User, type: "text", placeholder: "Seu nome completo" },
  { key: "email", label: "E-mail *", icon: Mail, type: "email", placeholder: "seu@email.com" },
  { key: "phone", label: "Celular (WhatsApp) *", icon: Phone, type: "tel", placeholder: "+55 11 99999-0000" },
  { key: "date_of_birth", label: "Data de Nascimento", icon: Calendar, type: "date", placeholder: "" },
  { key: "nationality", label: "Nacionalidade", icon: Globe, type: "text", placeholder: "Brasileira" },
  { key: "document_number", label: "CPF (se brasileiro)", icon: FileText, type: "text", placeholder: "000.000.000-00" },
  { key: "address", label: "Endereço Completo", icon: MapPin, type: "text", placeholder: "Rua, número, bairro, cidade" },
  { key: "zip_code", label: "CEP / Zip Code", icon: MapPin, type: "text", placeholder: "00000-000" },
];

export default function CustomerDataStep({ data, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (key: string, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="rounded-xl border border-border/40 bg-card p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <User size={14} className="text-primary" />
        <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-foreground">Dados do Condutor</h3>
      </div>
      <p className="text-[10px] text-muted-foreground -mt-2 mb-2">
        Preencha para finalizar sua reserva. Os dados serão salvos para agilizar futuras locações.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
          <div key={key} className={key === "address" ? "sm:col-span-2" : ""}>
            <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
              <Icon size={9} className="text-primary/50" />
              {label}
            </label>
            <input
              type={type}
              value={(data as any)[key]}
              onChange={(e) => update(key, e.target.value)}
              placeholder={placeholder}
              className="w-full h-8 px-2.5 rounded-md border border-border/40 bg-background text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>
        ))}
      </div>

      {/* License upload */}
      <div>
        <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
          <FileText size={9} className="text-primary/50" />
          Habilitação (CNH) — Foto ou PDF
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            onChange({ ...data, licenseFile: file });
          }}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full h-8 px-2.5 rounded-md border border-dashed border-border/50 bg-background/50 text-[11px] text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all flex items-center gap-1.5"
        >
          <Upload size={11} />
          {data.licenseFile ? data.licenseFile.name : "Clique para anexar"}
        </button>
      </div>
    </div>
  );
}
