import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Camera, Check, ChevronLeft, Fuel, Gauge, Car, ClipboardCheck,
  PenTool, Save, Loader2, X, Plus, Trash2, AlertTriangle, CheckCircle2,
  Download, GitCompare
} from "lucide-react";
import { generateInspectionPDF } from "@/utils/inspectionPdf";

type DamageItem = {
  id: string;
  position: string;
  description: string;
  severity: "light" | "medium" | "heavy";
  photoUrl?: string;
};

type ExteriorPhoto = {
  id: string;
  position: string;
  url: string;
};

type AccessoryCheck = Record<string, boolean>;

const PHOTO_POSITIONS = [
  "Frente", "Traseira", "Lateral Esquerda", "Lateral Direita",
  "Painel", "Banco Dianteiro", "Banco Traseiro", "Porta-Malas",
  "Roda Dianteira Esq.", "Roda Dianteira Dir.", "Roda Traseira Esq.", "Roda Traseira Dir."
];

const FUEL_LEVELS = [
  { value: "empty", label: "Vazio", pct: 0 },
  { value: "1/8", label: "1/8", pct: 12.5 },
  { value: "1/4", label: "1/4", pct: 25 },
  { value: "3/8", label: "3/8", pct: 37.5 },
  { value: "1/2", label: "1/2", pct: 50 },
  { value: "5/8", label: "5/8", pct: 62.5 },
  { value: "3/4", label: "3/4", pct: 75 },
  { value: "7/8", label: "7/8", pct: 87.5 },
  { value: "full", label: "Cheio", pct: 100 },
];

const DEFAULT_ACCESSORIES: Record<string, string> = {
  spare_tire: "Estepe",
  jack: "Macaco",
  triangle: "Triângulo",
  fire_extinguisher: "Extintor",
  first_aid: "Kit Primeiros Socorros",
  manual: "Manual do Veículo",
  floor_mats: "Tapetes",
  antenna: "Antena",
  hubcaps: "Calotas",
  wiper_blades: "Palhetas",
  charger_cable: "Cabo Carregador",
  sunshade: "Protetor Solar",
};

const CAR_ZONES = [
  { id: "front-left", label: "Diant. Esq.", x: 15, y: 20 },
  { id: "front-center", label: "Frente", x: 50, y: 8 },
  { id: "front-right", label: "Diant. Dir.", x: 85, y: 20 },
  { id: "left-side", label: "Lat. Esq.", x: 8, y: 50 },
  { id: "roof", label: "Teto", x: 50, y: 45 },
  { id: "right-side", label: "Lat. Dir.", x: 92, y: 50 },
  { id: "rear-left", label: "Tras. Esq.", x: 15, y: 80 },
  { id: "rear-center", label: "Traseira", x: 50, y: 92 },
  { id: "rear-right", label: "Tras. Dir.", x: 85, y: 80 },
];

export default function AdminInspection() {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") as "checkin" | "checkout";
  const navigate = useNavigate();

  const [booking, setBooking] = useState<any>(null);
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingInspection, setExistingInspection] = useState<any>(null);
  const [step, setStep] = useState(0);

  // Form state
  const [odometer, setOdometer] = useState("");
  const [fuelLevel, setFuelLevel] = useState("full");
  const [photos, setPhotos] = useState<ExteriorPhoto[]>([]);
  const [damages, setDamages] = useState<DamageItem[]>([]);
  const [accessories, setAccessories] = useState<AccessoryCheck>(
    Object.keys(DEFAULT_ACCESSORIES).reduce((acc, k) => ({ ...acc, [k]: true }), {})
  );
  const [notes, setNotes] = useState("");
  const [agentName, setAgentName] = useState("");
  const [customerSignature, setCustomerSignature] = useState("");
  const [agentSignature, setAgentSignature] = useState("");

  // Signature canvas refs
  const customerCanvasRef = useRef<HTMLCanvasElement>(null);
  const agentCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingCustomer, setIsDrawingCustomer] = useState(false);
  const [isDrawingAgent, setIsDrawingAgent] = useState(false);

  // Camera
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturePosition, setCapturePosition] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  // Damage photo
  const damageFileRef = useRef<HTMLInputElement>(null);
  const [damagePhotoTarget, setDamagePhotoTarget] = useState<string>("");

  useEffect(() => {
    loadData();
  }, [bookingId]);

  const loadData = async () => {
    if (!bookingId) return;
    setLoading(true);

    const [bookingRes, inspectionRes] = await Promise.all([
      supabase.from("bookings").select("*").eq("id", bookingId).single(),
      supabase.from("vehicle_inspections").select("*").eq("booking_id", bookingId).eq("type", type).maybeSingle(),
    ]);

    if (bookingRes.data) {
      setBooking(bookingRes.data);
      if (bookingRes.data.vehicle_id) {
        const { data: veh } = await supabase.from("vehicles").select("*").eq("id", bookingRes.data.vehicle_id).single();
        setVehicle(veh);
      }
    }

    if (inspectionRes.data) {
      setExistingInspection(inspectionRes.data);
      setOdometer(inspectionRes.data.odometer_reading?.toString() || "");
      setFuelLevel(inspectionRes.data.fuel_level || "full");
      setPhotos((inspectionRes.data.exterior_photos as any[]) || []);
      setDamages((inspectionRes.data.damages as any[]) || []);
      setAccessories(inspectionRes.data.accessories_check as AccessoryCheck || {});
      setNotes(inspectionRes.data.notes || "");
      setAgentName(inspectionRes.data.agent_name || "");
      setCustomerSignature(inspectionRes.data.customer_signature || "");
      setAgentSignature(inspectionRes.data.agent_signature || "");
    }

    setLoading(false);
  };

  // -- Photo capture
  const capturePhoto = (position: string) => {
    setCapturePosition(position);
    fileInputRef.current?.click();
  };

  const handleFileCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !capturePosition) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `${bookingId}/${type}/${Date.now()}-${capturePosition.replace(/\s/g, "_")}.${ext}`;

    const { error } = await supabase.storage.from("inspections").upload(path, file);
    if (error) {
      toast({ title: "Erro ao enviar foto", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("inspections").getPublicUrl(path);

    setPhotos((prev) => [...prev, { id: crypto.randomUUID(), position: capturePosition, url: urlData.publicUrl }]);
    setCapturePosition("");
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // -- Damage photo
  const captureDamagePhoto = (damageId: string) => {
    setDamagePhotoTarget(damageId);
    damageFileRef.current?.click();
  };

  const handleDamageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !damagePhotoTarget) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `${bookingId}/${type}/damage-${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("inspections").upload(path, file);
    if (error) {
      toast({ title: "Erro ao enviar foto", variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("inspections").getPublicUrl(path);
    setDamages((prev) =>
      prev.map((d) => (d.id === damagePhotoTarget ? { ...d, photoUrl: urlData.publicUrl } : d))
    );
    setDamagePhotoTarget("");
    setUploading(false);
    if (damageFileRef.current) damageFileRef.current.value = "";
  };

  // -- Damages
  const addDamage = (position: string) => {
    setDamages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), position, description: "", severity: "light" },
    ]);
  };

  const updateDamage = (id: string, field: keyof DamageItem, value: string) => {
    setDamages((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const removeDamage = (id: string) => {
    setDamages((prev) => prev.filter((d) => d.id !== id));
  };

  // -- Signature drawing
  const startDrawing = (canvas: HTMLCanvasElement, setDrawing: (v: boolean) => void) => {
    setDrawing(true);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
    isDrawing: boolean
  ) => {
    if (!isDrawing) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    let x: number, y: number;
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "hsl(var(--foreground))";
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = (
    canvas: HTMLCanvasElement,
    setDrawing: (v: boolean) => void,
    setSignature: (v: string) => void
  ) => {
    setDrawing(false);
    setSignature(canvas.toDataURL());
  };

  const clearCanvas = (canvas: HTMLCanvasElement, setSignature: (v: string) => void) => {
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
  };

  // -- Save
  const handleSave = async (finalize = false) => {
    setSaving(true);

    const payload = {
      booking_id: bookingId!,
      type,
      odometer_reading: odometer ? parseInt(odometer) : null,
      fuel_level: fuelLevel,
      exterior_photos: photos,
      damages,
      accessories_check: accessories,
      notes,
      customer_signature: customerSignature,
      agent_signature: agentSignature,
      agent_name: agentName,
      completed_at: finalize ? new Date().toISOString() : null,
    };

    let error;
    if (existingInspection) {
      ({ error } = await supabase.from("vehicle_inspections").update(payload).eq("id", existingInspection.id));
    } else {
      ({ error } = await supabase.from("vehicle_inspections").insert(payload));
    }

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: finalize ? "Inspeção finalizada com sucesso!" : "Rascunho salvo!" });
      if (finalize) navigate("/admin/bookings");
    }
    setSaving(false);
  };

  const steps = [
    { icon: Gauge, label: "Odômetro & Combustível" },
    { icon: Camera, label: "Fotos do Veículo" },
    { icon: AlertTriangle, label: "Avarias" },
    { icon: ClipboardCheck, label: "Acessórios" },
    { icon: PenTool, label: "Assinaturas" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return <p className="text-muted-foreground">Reserva não encontrada.</p>;
  }

  const isCompleted = !!existingInspection?.completed_at;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileCapture} />
      <input ref={damageFileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleDamageFile} />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/bookings")}>
          <ChevronLeft size={20} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              {type === "checkin" ? "Entrega do Veículo" : "Devolução do Veículo"}
            </h1>
            {isCompleted && (
              <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                <CheckCircle2 size={12} className="mr-1" /> Finalizada
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {booking.customer_name} • {vehicle?.name || "Veículo não vinculado"} •{" "}
            {new Date(booking.pickup_date).toLocaleDateString("pt-BR")} → {new Date(booking.return_date).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div className="flex gap-2">
          {isCompleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateInspectionPDF({ type, booking, vehicle, inspection: existingInspection })}
            >
              <Download size={14} className="mr-1" /> PDF
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/inspection/compare/${bookingId}`)}
          >
            <GitCompare size={14} className="mr-1" /> Comparar
          </Button>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                step === i
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon size={14} />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Step 0: Odometer & Fuel */}
      {step === 0 && (
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gauge size={20} className="text-primary" /> Odômetro & Combustível
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Leitura do Odômetro (km)</label>
              <Input
                type="number"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                placeholder="Ex: 45230"
                className="max-w-xs"
                disabled={isCompleted}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Nível de Combustível</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Fuel size={20} className="text-muted-foreground" />
                  <div className="flex-1 h-8 bg-muted/50 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${FUEL_LEVELS.find((f) => f.value === fuelLevel)?.pct || 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground min-w-[50px] text-right">
                    {FUEL_LEVELS.find((f) => f.value === fuelLevel)?.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {FUEL_LEVELS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => !isCompleted && setFuelLevel(f.value)}
                      disabled={isCompleted}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        fuelLevel === f.value
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "border-border/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Exterior Photos */}
      {step === 1 && (
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera size={20} className="text-primary" /> Fotos do Veículo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {PHOTO_POSITIONS.map((pos) => {
                const photo = photos.find((p) => p.position === pos);
                return (
                  <div key={pos} className="relative group">
                    {photo ? (
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border/40">
                        <img src={photo.url} alt={pos} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {!isCompleted && (
                            <>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => capturePhoto(pos)}
                                className="h-7 text-xs"
                              >
                                <Camera size={12} /> Refazer
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setPhotos((prev) => prev.filter((p) => p.position !== pos))}
                                className="h-7 text-xs"
                              >
                                <Trash2 size={12} />
                              </Button>
                            </>
                          )}
                        </div>
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                          {pos}
                        </span>
                        <CheckCircle2 size={16} className="absolute top-1 right-1 text-emerald-400" />
                      </div>
                    ) : (
                      <button
                        onClick={() => !isCompleted && capturePhoto(pos)}
                        disabled={isCompleted || uploading}
                        className="aspect-[4/3] rounded-lg border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors w-full"
                      >
                        <Camera size={20} />
                        <span className="text-[10px] font-medium">{pos}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {uploading && (
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <Loader2 size={14} className="animate-spin" /> Enviando foto...
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-4">
              {photos.length}/{PHOTO_POSITIONS.length} fotos capturadas
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Damages */}
      {step === 2 && (
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle size={20} className="text-primary" /> Mapa de Avarias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Car diagram */}
            <div className="relative bg-muted/30 rounded-xl p-6 border border-border/30">
              <p className="text-xs text-muted-foreground mb-3 text-center">Clique na zona para adicionar uma avaria</p>
              <div className="relative mx-auto" style={{ width: "280px", height: "360px" }}>
                {/* Car outline SVG */}
                <svg viewBox="0 0 280 360" className="absolute inset-0 w-full h-full">
                  <path
                    d="M140 20 C80 20 50 60 45 100 L40 140 C35 160 35 200 40 220 L45 260 C50 300 80 340 140 340 C200 340 230 300 235 260 L240 220 C245 200 245 160 240 140 L235 100 C230 60 200 20 140 20Z"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                  />
                  {/* Windshield */}
                  <path d="M85 90 L195 90 L185 130 L95 130Z" fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  {/* Rear window */}
                  <path d="M95 230 L185 230 L195 270 L85 270Z" fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  {/* Wheels */}
                  <ellipse cx="55" cy="110" rx="18" ry="25" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                  <ellipse cx="225" cy="110" rx="18" ry="25" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                  <ellipse cx="55" cy="250" rx="18" ry="25" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                  <ellipse cx="225" cy="250" rx="18" ry="25" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                </svg>

                {/* Clickable zones */}
                {CAR_ZONES.map((zone) => {
                  const hasDamage = damages.some((d) => d.position === zone.label);
                  return (
                    <button
                      key={zone.id}
                      onClick={() => !isCompleted && addDamage(zone.label)}
                      disabled={isCompleted}
                      className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                        hasDamage
                          ? "bg-destructive/20 text-destructive border-2 border-destructive/50 animate-pulse"
                          : "bg-primary/10 text-primary/60 border border-primary/20 hover:bg-primary/20 hover:scale-110"
                      }`}
                      style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                      title={zone.label}
                    >
                      {hasDamage ? "!" : "+"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Damage list */}
            {damages.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Avarias Registradas ({damages.length})</h3>
                {damages.map((d) => (
                  <div key={d.id} className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">{d.position}</Badge>
                        <select
                          value={d.severity}
                          onChange={(e) => updateDamage(d.id, "severity", e.target.value)}
                          disabled={isCompleted}
                          className="text-xs bg-background border border-border/40 rounded px-2 py-1 text-foreground"
                        >
                          <option value="light">Leve</option>
                          <option value="medium">Moderada</option>
                          <option value="heavy">Grave</option>
                        </select>
                      </div>
                      <Input
                        placeholder="Descreva a avaria..."
                        value={d.description}
                        onChange={(e) => updateDamage(d.id, "description", e.target.value)}
                        disabled={isCompleted}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      {d.photoUrl ? (
                        <img src={d.photoUrl} alt="Avaria" className="w-16 h-16 object-cover rounded border" />
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => captureDamagePhoto(d.id)}
                          disabled={isCompleted}
                          className="h-16 w-16 flex-col text-[9px]"
                        >
                          <Camera size={14} />
                          Foto
                        </Button>
                      )}
                      {!isCompleted && (
                        <Button size="sm" variant="ghost" onClick={() => removeDamage(d.id)} className="h-6 text-destructive">
                          <Trash2 size={12} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {damages.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                <CheckCircle2 size={24} className="mx-auto mb-2 text-emerald-500" />
                Nenhuma avaria registrada
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Accessories */}
      {step === 3 && (
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck size={20} className="text-primary" /> Checklist de Acessórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(DEFAULT_ACCESSORIES).map(([key, label]) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    accessories[key]
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-destructive/30 bg-destructive/5"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={accessories[key] ?? true}
                    onChange={(e) => !isCompleted && setAccessories((prev) => ({ ...prev, [key]: e.target.checked }))}
                    disabled={isCompleted}
                    className="rounded"
                  />
                  <span className="text-sm text-foreground">{label}</span>
                  {accessories[key] ? (
                    <Check size={14} className="ml-auto text-emerald-500" />
                  ) : (
                    <X size={14} className="ml-auto text-destructive" />
                  )}
                </label>
              ))}
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-foreground mb-2 block">Observações Gerais</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações adicionais sobre o estado do veículo..."
                rows={4}
                disabled={isCompleted}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Signatures */}
      {step === 4 && (
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PenTool size={20} className="text-primary" /> Assinaturas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Nome do Agente</label>
              <Input
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Nome completo do agente"
                className="max-w-sm"
                disabled={isCompleted}
              />
            </div>

            {/* Agent signature */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Assinatura do Agente</label>
                {!isCompleted && agentSignature && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => clearCanvas(agentCanvasRef.current!, setAgentSignature)}
                    className="h-7 text-xs"
                  >
                    Limpar
                  </Button>
                )}
              </div>
              {isCompleted && agentSignature ? (
                <img src={agentSignature} alt="Assinatura agente" className="h-24 border rounded-lg bg-white" />
              ) : (
                <canvas
                  ref={agentCanvasRef}
                  width={400}
                  height={150}
                  className="border-2 border-dashed border-border/60 rounded-lg bg-white cursor-crosshair touch-none w-full max-w-md"
                  onMouseDown={(e) => startDrawing(e.currentTarget, setIsDrawingAgent)}
                  onMouseMove={(e) => draw(e, e.currentTarget, isDrawingAgent)}
                  onMouseUp={() => stopDrawing(agentCanvasRef.current!, setIsDrawingAgent, setAgentSignature)}
                  onMouseLeave={() => isDrawingAgent && stopDrawing(agentCanvasRef.current!, setIsDrawingAgent, setAgentSignature)}
                  onTouchStart={(e) => { e.preventDefault(); startDrawing(e.currentTarget, setIsDrawingAgent); }}
                  onTouchMove={(e) => { e.preventDefault(); draw(e, e.currentTarget, isDrawingAgent); }}
                  onTouchEnd={() => stopDrawing(agentCanvasRef.current!, setIsDrawingAgent, setAgentSignature)}
                />
              )}
            </div>

            {/* Customer signature */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Assinatura do Cliente</label>
                {!isCompleted && customerSignature && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => clearCanvas(customerCanvasRef.current!, setCustomerSignature)}
                    className="h-7 text-xs"
                  >
                    Limpar
                  </Button>
                )}
              </div>
              {isCompleted && customerSignature ? (
                <img src={customerSignature} alt="Assinatura cliente" className="h-24 border rounded-lg bg-white" />
              ) : (
                <canvas
                  ref={customerCanvasRef}
                  width={400}
                  height={150}
                  className="border-2 border-dashed border-border/60 rounded-lg bg-white cursor-crosshair touch-none w-full max-w-md"
                  onMouseDown={(e) => startDrawing(e.currentTarget, setIsDrawingCustomer)}
                  onMouseMove={(e) => draw(e, e.currentTarget, isDrawingCustomer)}
                  onMouseUp={() => stopDrawing(customerCanvasRef.current!, setIsDrawingCustomer, setCustomerSignature)}
                  onMouseLeave={() => isDrawingCustomer && stopDrawing(customerCanvasRef.current!, setIsDrawingCustomer, setCustomerSignature)}
                  onTouchStart={(e) => { e.preventDefault(); startDrawing(e.currentTarget, setIsDrawingCustomer); }}
                  onTouchMove={(e) => { e.preventDefault(); draw(e, e.currentTarget, isDrawingCustomer); }}
                  onTouchEnd={() => stopDrawing(customerCanvasRef.current!, setIsDrawingCustomer, setCustomerSignature)}
                />
              )}
            </div>

            <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
              <p className="text-xs text-muted-foreground">
                Ao assinar, ambas as partes declaram estar de acordo com o estado do veículo documentado nesta inspeção,
                incluindo fotos, avarias e acessórios listados acima.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom actions */}
      <div className="flex items-center justify-between gap-3 pb-8">
        <div className="flex gap-2">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Anterior
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {!isCompleted && (
            <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
              {saving ? <Loader2 size={14} className="animate-spin mr-1" /> : <Save size={14} className="mr-1" />}
              Salvar Rascunho
            </Button>
          )}
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>
              Próximo
            </Button>
          ) : (
            !isCompleted && (
              <Button
                onClick={() => handleSave(true)}
                disabled={saving || !customerSignature || !agentSignature || !agentName}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {saving ? <Loader2 size={14} className="animate-spin mr-1" /> : <CheckCircle2 size={14} className="mr-1" />}
                Finalizar Inspeção
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
