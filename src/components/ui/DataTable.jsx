export default function DataTable({ columns, rows, emptyMessage = "No records found.", keyField = "id" }) {
  if (!rows.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-[#ddcfbf] bg-[#fcf7f1] px-4 py-10 text-center text-sm text-[#6b716d] sm:rounded-[28px] sm:px-6 sm:py-12">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div className="space-y-3 md:hidden">
        {rows.map((row, rowIndex) => (
          <article key={row[keyField] || rowIndex} className="rounded-[20px] border border-[#efe7dc] bg-white p-4 shadow-[0_12px_32px_-24px_rgba(0,0,0,0.3)]">
            <div className="space-y-3">
              {columns.map((column) => (
                <div key={column.key} className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#8b6e63]">{column.label}</p>
                  <div className="text-sm leading-6 text-[#314131] break-words">
                    {typeof column.render === "function" ? column.render(row) : row[column.key] ?? "-"}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-[28px] border border-[#efe7dc] bg-white md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#efe7dc]">
            <thead className="bg-[#fcf7f1] text-left text-xs uppercase tracking-[2px] text-[#8b6e63]">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-4 font-semibold">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2ebe3] text-sm text-[#314131]">
              {rows.map((row, rowIndex) => (
                <tr key={row[keyField] || rowIndex} className="align-top">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4 leading-6">
                      {typeof column.render === "function" ? column.render(row) : row[column.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}