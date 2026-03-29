import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Column {
  key: string;
  label: string;
  format?: (value: any) => string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

interface ReportTableProps {
  title?: string;
  data: any[];
  columns: Column[];
  rowColor?: (row: any) => string;
  onRowClick?: (row: any) => void;
  itemsPerPage?: number;
}

type SortDirection = "asc" | "desc" | null;

export function ReportTable({
  title,
  data,
  columns,
  rowColor,
  onRowClick,
  itemsPerPage = 10,
}: ReportTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting logic
  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();

        if (sortDirection === "asc") {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      })
    : data;

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      // Toggle direction
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
      setCurrentPage(1);
    }
  };

  if (data.length === 0) {
    return (
      <div className="bg-[#1B1B1B] border border-white/10 rounded-lg p-8 text-center">
        <p className="text-[#A1A1A1]">Sem dados para exibir</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1B1B1B] border border-white/10 rounded-lg overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="border-b border-white/10 bg-[#0F0F0F]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-4 text-left text-sm font-semibold text-[#A1A1A1] hover:text-white transition-colors ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  style={{
                    width: col.width,
                    textAlign: col.align || "left",
                  }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <>
                        {sortDirection === "asc" && (
                          <ChevronUp className="w-4 h-4 text-[#28A263]" />
                        )}
                        {sortDirection === "desc" && (
                          <ChevronDown className="w-4 h-4 text-[#28A263]" />
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick?.(row)}
                style={{
                  backgroundColor: rowColor ? rowColor(row) : undefined,
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-sm text-white"
                    style={{ textAlign: col.align || "left" }}
                  >
                    {col.format ? col.format(row[col.key]) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-sm text-[#A1A1A1]">
            Mostrando {startIndex + 1} a {Math.min(endIndex, sortedData.length)} de{" "}
            {sortedData.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
            >
              Anterior
            </button>
            <span className="px-3 py-2 text-sm text-[#A1A1A1]">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
