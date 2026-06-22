import { formatDate } from "../../utils/formatDate.js";
import Badge from "../ui/Badge.jsx";
import Table from "../ui/Table.jsx";

const columns = [
  { key: "id", label: "ID" },
  { key: "user_id", label: "User" },
  { key: "action", label: "Action" },
  { key: "description", label: "Deskripsi" },
  { key: "ip", label: "IP Address" },
  { key: "created_at", label: "Tanggal" },
];

function AuditLogTable({ logs = [], isLoading = false }) {
  return (
    <Table
      columns={columns}
      minWidth={1040}
      rows={logs}
      emptyText={isLoading ? "Memuat audit log..." : "Belum ada audit log sesuai filter."}
      renderRow={(row) => (
        <tr key={row.id} className="border-b transition-colors hover:bg-muted/40">
          <td className="p-4 font-mono text-xs text-muted-foreground">{row.id}</td>
          <td className="p-4">{row.user_id || "-"}</td>
          <td className="p-4">
            <Badge tone="info">{row.action}</Badge>
          </td>
          <td className="p-4">
            <p className="mb-0 line-clamp-2 max-w-[360px] text-sm">{row.description || "-"}</p>
            <p className="mb-0 mt-1 line-clamp-1 max-w-[360px] text-xs text-muted-foreground">
              {row.user_agent || "-"}
            </p>
          </td>
          <td className="p-4 whitespace-nowrap text-muted-foreground">{row.ip_address || "-"}</td>
          <td className="p-4 whitespace-nowrap text-muted-foreground">{formatDate(row.created_at)}</td>
        </tr>
      )}
    />
  );
}

export default AuditLogTable;
