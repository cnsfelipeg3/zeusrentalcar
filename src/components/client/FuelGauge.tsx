interface FuelGaugeProps {
  level: string; // "full" | "3/4" | "1/2" | "1/4" | "empty"
  label: string;
}

const levelMap: Record<string, number> = {
  full: 100,
  "3/4": 75,
  "1/2": 50,
  "1/4": 25,
  empty: 0,
};

const FuelGauge = ({ level, label }: FuelGaugeProps) => {
  const pct = levelMap[level] ?? 100;
  const getColor = () => {
    if (pct >= 75) return "bg-green-500";
    if (pct >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex-1">
      <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">{label}</p>
      <div className="h-3 rounded-full bg-muted overflow-hidden relative">
        <div className={`h-full rounded-full transition-all ${getColor()}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[9px] text-muted-foreground/60 mt-1">
        <span>E</span>
        <span>1/4</span>
        <span>1/2</span>
        <span>3/4</span>
        <span>F</span>
      </div>
      <p className="text-xs text-foreground font-medium mt-1 text-center capitalize">{level}</p>
    </div>
  );
};

export default FuelGauge;
