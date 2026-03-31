import { ShieldCheck, ShieldAlert } from "lucide-react";

interface InsuranceCardProps {
  isPremium: boolean;
  deposit: number;
  franchise: number;
}

const InsuranceCard = ({ isPremium, deposit, franchise }: InsuranceCardProps) => {
  if (isPremium) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={20} className="text-green-500" />
          <h4 className="font-semibold text-green-400 text-sm">Seguro Premium ativo</h4>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground">Franquia</p>
            <p className="text-green-400 font-bold">ZERO</p>
          </div>
          <div>
            <p className="text-muted-foreground">Caução</p>
            <p className="text-green-400 font-bold">ZERO</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <ShieldAlert size={20} className="text-amber-500" />
        <h4 className="font-semibold text-amber-400 text-sm">Seguro Básico</h4>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-muted-foreground">Caução</p>
          <p className="text-amber-400 font-bold">${deposit}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Franquia</p>
          <p className="text-amber-400 font-bold">${franchise}</p>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCard;
