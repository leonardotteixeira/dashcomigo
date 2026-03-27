import { useState } from "react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface ExportOption {
  label: string;
  format: "xlsx" | "csv" | "pdf";
  icon: React.ReactNode;
  onExport: () => Promise<void> | void;
}

interface ExportButtonProps {
  options: ExportOption[];
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function ExportButton({
  options,
  variant = "outline",
  size = "default",
  className = "",
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (option: ExportOption) => {
    setIsExporting(true);
    try {
      await option.onExport();
      toast.success("Arquivo exportado com sucesso!", {
        description: `Formato: ${option.format.toUpperCase()}`,
      });
    } catch (error) {
      toast.error("Erro ao exportar arquivo", {
        description: "Tente novamente mais tarde",
      });
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl ${className}`}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {isExporting ? "Exportando..." : "Exportar"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-[#1B1B1B] border-white/10 text-white"
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.format}
            onClick={() => handleExport(option)}
            disabled={isExporting}
            className="cursor-pointer text-[#A1A1A1] hover:bg-white/5 focus:bg-white/5 hover:text-white focus:text-white"
          >
            <span className="mr-2">{option.icon}</span>
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Ícones pré-configurados por formato
export const ExportIcons = {
  excel: <FileSpreadsheet className="h-4 w-4 text-green-500" />,
  csv: <FileSpreadsheet className="h-4 w-4 text-blue-400" />,
  pdf: <FileText className="h-4 w-4 text-red-400" />,
};
