import { DollarSign } from "lucide-react";

export default function AdminFinance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
      </div>
      <p className="text-muted-foreground">Em breve: controle financeiro completo da operação.</p>
    </div>
  );
}
