import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Database,
  FileCheck2,
  FileText,
  Layers3,
  MessageSquareText,
  RefreshCw,
  Server,
} from "lucide-react";

import DashboardCard from "../../components/admin/DashboardCard.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Loader from "../../components/ui/Loader.jsx";
import { dashboardService } from "../../services/dashboardService.js";
import { healthService } from "../../services/healthService.js";
import { SOURCE_TYPES } from "../../utils/constants.js";
import { formatStatus, statusTone } from "../../utils/formatStatus.js";

const sourceTypeLabels = SOURCE_TYPES.reduce((labels, sourceType) => {
  labels[sourceType.value] = sourceType.label;
  return labels;
}, {});

function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value || 0));
}

function metricValue(summary, key) {
  return formatNumber(summary?.[key] || 0);
}

function getMaxTotal(items) {
  return Math.max(...items.map((item) => Number(item.total || 0)), 1);
}

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    const [summaryResult, healthResult] = await Promise.allSettled([
      dashboardService.getDashboardSummary(),
      healthService.getHealthStatus(),
    ]);

    if (summaryResult.status === "fulfilled") {
      setSummary(summaryResult.value);
    } else {
      setSummary(null);
      setErrorMessage(summaryResult.reason?.message || "Data dashboard gagal dimuat.");
    }

    if (healthResult.status === "fulfilled") {
      setHealthStatus(healthResult.value);
    } else {
      setHealthStatus(null);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const systemStatus = useMemo(
    () => healthStatus || summary?.system_status || {},
    [healthStatus, summary],
  );

  const sourceTypeRows = summary?.documents_by_source_type || [];
  const statusRows = summary?.documents_by_status || [];
  const frequentQuestions = summary?.frequent_questions || [];
  const maxSourceTotal = getMaxTotal(sourceTypeRows);
  const maxStatusTotal = getMaxTotal(statusRows);

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-kicker">Admin</p>
          <h1 className="mb-0 text-3xl font-semibold tracking-normal">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ringkasan knowledge base, aktivitas chatbot, dan status koneksi sistem.
          </p>
        </div>
        <Button
          className="w-full md:w-auto"
          disabled={isLoading}
          icon={<RefreshCw size={16} />}
          onClick={loadDashboard}
          type="button"
          variant="outline"
        >
          Refresh
        </Button>
      </div>

      {errorMessage ? (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {isLoading ? (
        <Card className="p-6">
          <Loader label="Memuat data dashboard" />
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardCard
          description="Total dokumen aktif"
          icon={<FileText size={18} />}
          label="Dokumen"
          tone="info"
          value={metricValue(summary, "total_documents")}
        />
        <DashboardCard
          description="Sudah masuk vector DB"
          icon={<FileCheck2 size={18} />}
          label="Indexed"
          tone="success"
          value={metricValue(summary, "total_indexed_documents")}
        />
        <DashboardCard
          description="Perlu pengecekan"
          icon={<AlertCircle size={18} />}
          label="Failed"
          tone={summary?.total_failed_documents ? "danger" : "neutral"}
          value={metricValue(summary, "total_failed_documents")}
        />
        <DashboardCard
          description="Percakapan tersimpan"
          icon={<MessageSquareText size={18} />}
          label="Chat"
          tone="warning"
          value={metricValue(summary, "total_chat")}
        />
        <DashboardCard
          description="Chunk dokumen"
          icon={<Layers3 size={18} />}
          label="Chunks"
          tone="neutral"
          value={metricValue(summary, "total_chunks")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            <h2 className="mb-0 text-base font-semibold">Status Sistem</h2>
          </div>
          <div className="grid gap-3">
            {[
              ["MySQL", systemStatus.mysql],
              ["ChromaDB", systemStatus.chromadb],
              ["Gemini", systemStatus.gemini],
            ].map(([label, status]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Badge tone={statusTone(status)}>{formatStatus(status)}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <h2 className="mb-0 text-base font-semibold">Dokumen Berdasarkan Status</h2>
          </div>
          {statusRows.length ? (
            <div className="grid gap-3">
              {statusRows.map((item) => (
                <div key={item.status} className="grid gap-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <Badge tone={statusTone(item.status)}>{formatStatus(item.status)}</Badge>
                    <span className="font-medium">{formatNumber(item.total)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(Number(item.total || 0) / maxStatusTotal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Belum ada status dokumen" description="Data akan tampil setelah dokumen diupload." />
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 text-base font-semibold">Dokumen Berdasarkan Source Type</h2>
          {sourceTypeRows.length ? (
            <div className="grid gap-3">
              {sourceTypeRows.map((item) => (
                <div key={item.source_type} className="grid gap-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">
                      {sourceTypeLabels[item.source_type] || formatStatus(item.source_type)}
                    </span>
                    <span className="text-muted-foreground">{formatNumber(item.total)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-secondary"
                      style={{ width: `${(Number(item.total || 0) / maxSourceTotal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Belum ada source type" description="Upload dokumen untuk melihat distribusi source type." />
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-base font-semibold">Frequent Questions</h2>
          {frequentQuestions.length ? (
            <div className="grid gap-3">
              {frequentQuestions.map((item, index) => (
                <div key={`${item.question}-${index}`} className="flex items-start justify-between gap-4 rounded-md border px-3 py-2">
                  <p className="mb-0 line-clamp-2 text-sm">{item.question}</p>
                  <Badge tone="info">{formatNumber(item.total)}x</Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Belum ada pertanyaan" description="Pertanyaan populer akan tampil setelah chatbot digunakan." />
          )}
        </Card>
      </div>
    </section>
  );
}

export default DashboardPage;
