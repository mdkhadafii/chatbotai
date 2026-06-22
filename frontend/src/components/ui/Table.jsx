function Table({ columns, rows, renderRow, emptyText = "Belum ada data", minWidth = 680 }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full caption-bottom text-sm" style={{ minWidth }}>
        <thead>
          <tr className="border-b bg-muted/50">
            {columns.map((column) => (
              <th key={column.key} className="h-11 px-4 text-left align-middle font-semibold text-muted-foreground">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map(renderRow)
          ) : (
            <tr className="border-b">
              <td colSpan={columns.length} className="h-24 px-4 text-center text-muted-foreground">
                <div className="mx-auto max-w-sm rounded-md border border-dashed bg-muted/30 px-4 py-5 text-sm">
                  {emptyText}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
