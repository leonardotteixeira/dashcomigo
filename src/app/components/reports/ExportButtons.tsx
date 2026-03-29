import { Download, FileJson, FileText } from "lucide-react";
import { Button } from "../ui/button";

interface ExportButtonsProps {
  filename?: string;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
  loading?: {
    excel?: boolean;
    pdf?: boolean;
  };
}

export function ExportButtons({
  filename = "relatorio",
  onExportExcel,
  onExportPDF,
  loading = {},
}: ExportButtonsProps) {
  const isLoading = loading.excel || loading.pdf;

  return (
    <div className="flex gap-3 flex-wrap">
      {onExportExcel && (
        <Button
          onClick={onExportExcel}
          disabled={isLoading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          <FileJson className="w-4 h-4" />
          {loading.excel ? "Gerando..." : "Exportar Excel"}
        </Button>
      )}

      {onExportPDF && (
        <Button
          onClick={onExportPDF}
          disabled={isLoading}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50"
        >
          <FileText className="w-4 h-4" />
          {loading.pdf ? "Gerando..." : "Exportar PDF"}
        </Button>
      )}

      {!onExportExcel && !onExportPDF && (
        <div className="text-sm text-[#A1A1A1] italic">
          Nenhuma opção de exportação disponível
        </div>
      )}
    </div>
  );
}

/**
 * Helper: Download file como blob
 */
export function downloadFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Helper: Gera filename com timestamp
 */
export function generateFilename(base: string, format: "xlsx" | "pdf"): string {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
  return `${base}_${dateStr}.${format}`;
}
