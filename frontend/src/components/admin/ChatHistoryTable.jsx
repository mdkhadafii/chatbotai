import { Link } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";

import { formatDate } from "../../utils/formatDate.js";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import Table from "../ui/Table.jsx";

const columns = [
  { key: "session_id", label: "Session" },
  { key: "question", label: "Pertanyaan" },
  { key: "confidence", label: "Confidence" },
  { key: "created_at", label: "Tanggal" },
  { key: "action", label: "Aksi" },
];

function confidenceTone(score) {
  if (score >= 0.75) return "success";
  if (score >= 0.4) return "warning";
  return "neutral";
}

function formatConfidence(score) {
  return `${Math.round(Number(score || 0) * 100)}%`;
}

function ChatHistoryTable({ histories = [], isLoading = false, onDelete }) {
  return (
    <Table
      columns={columns}
      minWidth={920}
      rows={histories}
      emptyText={isLoading ? "Memuat riwayat chat..." : "Belum ada riwayat chat"}
      renderRow={(row) => (
        <tr key={row.id} className="border-b transition-colors hover:bg-muted/40">
          <td className="p-4">
            <span className="block max-w-[180px] truncate font-mono text-xs text-muted-foreground">
              {row.session_id}
            </span>
          </td>
          <td className="p-4">
            <div className="max-w-[360px]">
              <p className="mb-1 line-clamp-2 font-medium">{row.question}</p>
              <p className="mb-0 line-clamp-1 text-xs text-muted-foreground">{row.answer}</p>
            </div>
          </td>
          <td className="p-4">
            <Badge tone={confidenceTone(row.confidence_score)}>
              {formatConfidence(row.confidence_score)}
            </Badge>
          </td>
          <td className="p-4 whitespace-nowrap text-muted-foreground">{formatDate(row.created_at)}</td>
          <td className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button as={Link} icon={<Eye size={16} />} size="sm" to={`/admin/chat-history/${row.id}`} variant="outline">
                Detail
              </Button>
              <Button
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

export default ChatHistoryTable;
