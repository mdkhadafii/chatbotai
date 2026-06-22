import { FileText } from "lucide-react";

import { SOURCE_TYPES } from "../../utils/constants.js";

const sourceTypeLabels = SOURCE_TYPES.reduce((labels, sourceType) => {
  labels[sourceType.value] = sourceType.label;
  return labels;
}, {});

function formatScore(score) {
  if (typeof score !== "number") return null;
  return `${Math.round(score * 100)}%`;
}

function ChatSourceList({ sources }) {
  if (!sources.length) return null;

  return (
    <div className="mt-4 grid gap-2">
      <p className="mb-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Sumber jawaban
      </p>
      <ul className="grid gap-2 text-xs text-muted-foreground">
      {sources.map((source) => (
        <li
          key={`${source.document_id}-${source.title}-${source.page || "page"}`}
          className="rounded-md border bg-background px-3 py-2"
        >
          <div className="flex items-start gap-2">
            <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="mb-1 truncate font-medium text-foreground">
                {source.title || `Dokumen ${source.document_id || ""}`}
              </p>
              <div className="flex flex-wrap gap-2">
                {source.source_type ? <span>{sourceTypeLabels[source.source_type] || source.source_type}</span> : null}
                {source.page ? <span>Hal. {source.page}</span> : null}
                {formatScore(source.score) ? <span>Score {formatScore(source.score)}</span> : null}
              </div>
            </div>
          </div>
        </li>
      ))}
      </ul>
    </div>
  );
}

export default ChatSourceList;
