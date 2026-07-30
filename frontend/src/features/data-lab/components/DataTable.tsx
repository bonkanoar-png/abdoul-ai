import { Card } from "@/components/ui/card";
import type { DataTableData } from "@/features/data-lab/types/dataset";

type DataTableProps = {
  table: DataTableData;
};

export function DataTable({ table }: DataTableProps) {
  return (
    <Card>
      <h2 className="text-ink text-2xl font-bold tracking-[-0.03em]">Aperçu des données</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[42rem] border-collapse text-left">
          <caption className="sr-only">{table.caption}</caption>
          <thead>
            <tr className="border-line border-b">
              {table.headers.map((header) => (
                <th className="text-ink px-4 py-3 text-sm font-bold" scope="col" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr className="border-line border-b last:border-0" key={row.join("-")}>
                {row.map((cell, cellIndex) =>
                  cellIndex === 0 ? (
                    <th className="text-ink px-4 py-4 font-semibold" scope="row" key={cell}>
                      {cell}
                    </th>
                  ) : (
                    <td className="text-muted px-4 py-4" key={`${rowIndex}-${cellIndex}`}>
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
