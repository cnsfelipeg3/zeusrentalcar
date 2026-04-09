import { UsersRound } from "lucide-react";

export default function AdminTeam() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UsersRound className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Equipe</h1>
      </div>
      <p className="text-muted-foreground">Em breve: gestão de membros da equipe.</p>
    </div>
  );
}
