import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter, RefreshCw, Search, Zap } from "lucide-react";

import DocumentTable from "../../components/admin/DocumentTable.jsx";
import UploadDocumentForm from "../../components/admin/UploadDocumentForm.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Loader from "../../components/ui/Loader.jsx";
import Select from "../../components/ui/Select.jsx";
import { documentService } from "../../services/documentService.js";
import { ingestService } from "../../services/ingestService.js";
import { DOCUMENT_STATUSES, SOURCE_TYPES } from "../../utils/constants.js";

function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  });
  const [filters, setFilters] = useState({
    search: "",
    source_type: "",
    status: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [isLoading, setIsLoading] = useState(true);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [processingDocumentId, setProcessingDocumentId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const queryParams = useMemo(
    () => ({
      page: pagination.page,
      limit: pagination.limit,
      search: appliedFilters.search || undefined,
      source_type: appliedFilters.source_type || undefined,
      status: appliedFilters.status || undefined,
    }),
    [appliedFilters, pagination.limit, pagination.page],
  );

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await documentService.getDocuments(queryParams);
      setDocuments(result.data || []);
      setPagination((currentPagination) => ({
        ...currentPagination,
        ...(result.pagination || {}),
      }));
    } catch (error) {
      setDocuments([]);
      setErrorMessage(error.message || "Data dokumen gagal dimuat.");
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }));
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    setPagination((currentPagination) => ({ ...currentPagination, page: 1 }));
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    const nextFilters = { search: "", source_type: "", status: "" };
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setPagination((currentPagination) => ({ ...currentPagination, page: 1 }));
  };

  const handleUploaded = () => {
    setSuccessMessage("Dokumen berhasil diupload.");
    setPagination((currentPagination) => ({ ...currentPagination, page: 1 }));
    loadDocuments();
  };

  const handleDelete = async (document) => {
    const confirmed = window.confirm(`Hapus dokumen "${document.title}"?`);
    if (!confirmed) return;

    setErrorMessage("");
    setSuccessMessage("");

    try {
      await documentService.deleteDocument(document.id);
      setSuccessMessage("Dokumen berhasil dihapus.");
      loadDocuments();
    } catch (error) {
      setErrorMessage(error.message || "Dokumen gagal dihapus.");
    }
  };

  const handleIngestAction = async (document, action) => {
    setProcessingDocumentId(document.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result =
        action === "reindex"
          ? await ingestService.reindexDocument(document.id)
          : await ingestService.ingestDocument(document.id);
      setSuccessMessage(
        action === "reindex"
          ? `Dokumen berhasil di-reindex dengan ${result.total_chunks || 0} chunks.`
          : `Dokumen berhasil di-ingest dengan ${result.total_chunks || 0} chunks.`,
      );
      loadDocuments();
    } catch (error) {
      await loadDocuments();
      setErrorMessage(error.message || "Proses ingest dokumen gagal.");
    } finally {
      setProcessingDocumentId(null);
    }
  };

  const handleBulkIngest = async () => {
    const confirmed = window.confirm("Jalankan bulk ingest untuk semua dokumen berstatus uploaded?");
    if (!confirmed) return;

    setIsBulkProcessing(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await ingestService.bulkIngest();
      setSuccessMessage(
        `Bulk ingest selesai. ${result.total_indexed || 0} berhasil, ${result.total_failed || 0} gagal dari ${result.total_documents || 0} dokumen.`,
      );
      loadDocuments();
    } catch (error) {
      await loadDocuments();
      setErrorMessage(error.message || "Bulk ingest gagal.");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handlePageChange = (nextPage) => {
    setPagination((currentPagination) => ({
      ...currentPagination,
      page: Math.min(Math.max(nextPage, 1), currentPagination.total_pages || 1),
    }));
  };

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-kicker">Knowledge Base</p>
          <h1 className="mb-0 text-3xl font-semibold tracking-normal">Dokumen</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload, cari, filter, edit metadata, dan hapus dokumen knowledge base.
          </p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <Button
            className="w-full md:w-auto"
            disabled={isLoading || isBulkProcessing}
            icon={<Zap size={16} />}
            onClick={handleBulkIngest}
            type="button"
          >
            {isBulkProcessing ? "Memproses..." : "Bulk Ingest"}
          </Button>
          <Button
            className="w-full md:w-auto"
            disabled={isLoading || isBulkProcessing}
            icon={<RefreshCw size={16} />}
            onClick={loadDocuments}
            type="button"
            variant="outline"
          >
            Refresh
          </Button>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}
      {successMessage ? (
        <div className="rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          {successMessage}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          <Card className="p-5">
            <form className="grid gap-3 lg:grid-cols-[1fr_220px_180px_auto_auto]" onSubmit={handleApplyFilters}>
              <Input
                label="Search"
                name="search"
                onChange={handleFilterChange}
                placeholder="Cari judul dokumen"
                value={filters.search}
              />
              <Select label="Source Type" name="source_type" onChange={handleFilterChange} value={filters.source_type}>
                <option value="">Semua source type</option>
                {SOURCE_TYPES.map((sourceType) => (
                  <option key={sourceType.value} value={sourceType.value}>
                    {sourceType.label}
                  </option>
                ))}
              </Select>
              <Select label="Status" name="status" onChange={handleFilterChange} value={filters.status}>
                <option value="">Semua status</option>
                {DOCUMENT_STATUSES.filter((status) => status.value !== "deleted").map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Select>
              <div className="flex items-end">
                <Button className="w-full" icon={<Filter size={16} />} type="submit">
                  Filter
                </Button>
              </div>
              <div className="flex items-end">
                <Button className="w-full" onClick={handleResetFilters} type="button" variant="outline">
                  Reset
                </Button>
              </div>
            </form>
          </Card>

          {isLoading ? <Loader label="Memuat dokumen" /> : null}
          <DocumentTable
            documents={documents}
            emptyText="Belum ada dokumen sesuai filter."
            isLoading={isLoading}
            onDelete={handleDelete}
            onIngestAction={handleIngestAction}
            processingDocumentId={processingDocumentId}
          />

          <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-sm md:flex-row md:items-center md:justify-between">
            <span className="text-muted-foreground">
              Total {pagination.total || 0} dokumen, halaman {pagination.page || 1} dari {pagination.total_pages || 1}
            </span>
            <div className="flex gap-2">
              <Button
                disabled={isLoading || pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                type="button"
                variant="outline"
              >
                Sebelumnya
              </Button>
              <Button
                disabled={isLoading || pagination.page >= (pagination.total_pages || 1)}
                onClick={() => handlePageChange(pagination.page + 1)}
                type="button"
                variant="outline"
              >
                Berikutnya
              </Button>
            </div>
          </div>
        </div>

        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            <h2 className="mb-0 text-base font-semibold">Upload Dokumen</h2>
          </div>
          <UploadDocumentForm onUploaded={handleUploaded} />
        </Card>
      </div>
    </section>
  );
}

export default DocumentsPage;
