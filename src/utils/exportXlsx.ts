import * as XLSX from "xlsx";

export function exportToXlsx(
  rows: Record<string, unknown>[],
  filename: string,
  sheetName = "Dados",
) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Auto-width columns
  const maxWidths: number[] = [];
  rows.forEach((row) => {
    Object.values(row).forEach((val, i) => {
      const len = String(val ?? "").length;
      maxWidths[i] = Math.max(maxWidths[i] ?? 10, len);
    });
  });
  worksheet["!cols"] = maxWidths.map((w) => ({ wch: Math.min(w + 2, 50) }));

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
