export default function DataTable({ columns, rows, emptyMessage = "No records found.", keyField = "id" }) {
  if (!rows.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-[#ddcfbf] bg-[#fcf7f1] px-6 py-12 text-center text-sm text-[#6b716d]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#efe7dc] bg-white">
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
  );
}