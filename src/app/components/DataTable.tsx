import { ReactNode } from "react";

interface DataTableColumn {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: any) => ReactNode;
}

interface DataTableProps {
  columns: DataTableColumn[];
  data: any[];
  onRowClick?: (row: any) => void;
  emptyState?: ReactNode;
  loading?: boolean;
}

export function DataTable({
  columns,
  data,
  onRowClick,
  emptyState,
  loading,
}: DataTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0066FF] border-t-transparent" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-12 text-center">
        {emptyState || <p className="text-[rgba(0,21,41,0.6)]">Nenhum registro encontrado</p>}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[rgba(20,18,15,0.13)] rounded-2xl bg-white">
      <table className="w-full">
        <thead className="bg-[#F4EFE6] border-b border-[rgba(20,18,15,0.13)]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-4 text-left text-sm font-semibold text-[#0E3B2E] ${col.width || ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-[rgba(20,18,15,0.13)] last:border-b-0 ${
                onRowClick ? "cursor-pointer hover:bg-[#F4EFE6]" : ""
              } transition-colors`}
            >
              {columns.map((col) => (
                <td
                  key={`${idx}-${col.key}`}
                  className={`px-6 py-4 text-sm text-[#0E3B2E] ${col.width || ""}`}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
