import { Link } from "react-router-dom";
import { Eye, RefreshCw, Trash2, Zap } from "lucide-react";

import { SOURCE_TYPES } from "../../utils/constants.js";
import { formatDate } from "../../utils/formatDate.js";
import { formatStatus, statusTone } from "../../utils/formatStatus.js";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import Table from "../ui/Table.jsx";

const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Judul" },
  { key: "source_type", label: "Source Type" },
  { key: "file_type", label: "File Type" },
  { key: "status", label: "Status" },
  { key: "total_chunks", label: "Chunks" },
  { key: "created_at", label: "Created At" },
  { key: "action", label: "Aksi" },
];

const sourceTypeLabels = SOURCE_TYPES.reduce((labels, sourceType) => {
  labels[sourceType.value] = sourceType.label;
  return labels;
}, {});

function ingestActionForStatus(status) {
  const actionMap = {
    uploaded: { label: "Ingest", action: "ingest", icon: <Zap size={16} /> },
    indexed: { label: "Reindex", action: "reindex", icon: <RefreshCw size={16} /> },
    failed: { label: "Retry", action: "ingest", icon: <RefreshCw size={16} /> },
  };
  return actionMap[status] || null;
}

function DocumentTable({
  documents = [],
  emptyText,
  isLoading = false,
  onDelete,
  onIngestAction,
  processingDocumentId,
}) {
  return (
    <Table
      columns={columns}
      minWidth={1040}
      rows={documents}
      emptyText={isLoading ? "Memuat dokumen..." : emptyText || "Belum ada dokumen"}
      renderRow={(row) => (
        <tr key={row.id} className="border-b transition-colors hover:bg-muted/40">
          <td className="p-4 font-mono text-xs text-muted-foreground">{row.id}</td>
          <td className="p-4">
            <div className="max-w-[280px]">
              <p className="mb-1 truncate font-medium">{row.title}</p>
              <p className="mb-0 truncate text-xs text-muted-foreground">{row.file_name || "-"}</p>
            </div>
          </td>
          <td className="p-4">{sourceTypeLabels[row.source_type] || formatStatus(row.source_type)}</td>
          <td className="p-4">{row.file_type || "-"}</td>
          <td className="p-4">
            <Badge tone={statusTone(row.status)}>{formatStatus(row.status)}</Badge>
          </td>
          <td className="p-4">{row.total_chunks ?? 0}</td>
          <td className="p-4 whitespace-nowrap text-muted-foreground">{formatDate(row.created_at)}</td>
          <td className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button as={Link} icon={<Eye size={16} />} size="sm" to={`/admin/documents/${row.id}`} variant="outline">
                Detail
              </Button>
              {ingestActionForStatus(row.status) ? (
                <Button
                  disabled={processingDocumentId === row.id || row.status === "processing"}
                  icon={ingestActionForStatus(row.status).icon}
                  onClick={() => onIngestAction?.(row, ingestActionForStatus(row.status).action)}
                  size="sm"
                  type="button"
                  variant={row.status === "indexed" ? "secondary" : "default"}
                >
                  {processingDocumentId === row.id ? "Proses..." : ingestActionForStatus(row.status).label}
                </Button>
              ) : null}
              <Button
                disabled={processingDocumentId === row.id || row.status === "processing"}
                icon={<Trash2 size={16} />}
                onClick={() => onDelete?.(row)}
                size="sm"
                type="button"
                variant="destructive"
              >
                Hapus
              </Button>
            </div>
          </td>
        </tr>
      )}
    />
  );
}

export default DocumentTable;
