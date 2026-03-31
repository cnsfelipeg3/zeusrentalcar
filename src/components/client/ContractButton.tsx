import { FileDown } from "lucide-react";

interface ContractButtonProps {
  url: string;
}

const ContractButton = ({ url }: ContractButtonProps) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="w-full flex items-center justify-center gap-2 gold-gradient text-primary-foreground px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
  >
    <FileDown size={16} />
    Baixar contrato
  </a>
);

export default ContractButton;
