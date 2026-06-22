import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw, Save, Trash2, Zap } from "lucide-react";

import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Input from "../../components/ui/Input.jsx";
import Loader from "../../components/ui/Loader.jsx";
import Select from "../../components/ui/Select.jsx";
import { documentService } from "../../services/documentService.js";
import { ingestService } from "../../services/ingestService.js";
import { SOURCE_TYPES } from "../../utils/constants.js";
import { formatDate } from "../../utils/formatDate.js";
import { formatStatus, statusTone } from "../../utils/formatStatus.js";

function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [form, setForm] = useState({
    title: "",
    source_type: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadDocument = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await documentService.getDocumentById(id);
      setDocument(data);
      setForm({
        title: data.title || "",
        source_type: data.source_type || "",
        description: data.description || "",
      });
    } catch (error) {
      setDocument(null);
      setErrorMessage(error.message || "Detail dokumen gagal dimuat.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setFormErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
    setSuccessMessage("");
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Judul wajib diisi.";
    }

    if (!form.source_type) {
      nextErrors.source_type = "Source type wajib dipilih.";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm() || isSaving) return;

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedDocument = await documentService.updateDocument(id, {
        title: form.title.trim(),
        source_type: form.source_type,
        description: form.description.trim() || null,
      });
      setDocument(updatedDocument);
      setSuccessMessage("Metadata dokumen berhasil diperbarui.");
    } catch (error) {
      setErrorMessage(error.message || "Metadata dokumen gagal diperbarui.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!document) return;
    const confirmed = window.confirm(`Hapus dokumen "${document.title}"?`);
    if (!confirmed) return;

    setErrorMessage("");
    setSuccessMessage("");

    try {
      await documentService.deleteDocument(document.id);
      navigate("/admin/documents", { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Dokumen gagal dihapus.");
    }
  };

  const handleIngest = async (action) => {
    if (!document || isIngesting) return;

    setIsIngesting(true);
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
      await loadDocument();
    } catch (error) {
      await loadDocument();
      setErrorMessage(error.message || "Proses ingest dokumen gagal.");
    } finally {
      setIsIngesting(false);
    }
  };

  const ingestAction =
    document?.status === "uploaded"
      ? { label: "Ingest", action: "ingest", icon: <Zap size={16} /> }
      : document?.status === "indexed"
        ? { label: "Reindex", action: "reindex", icon: <RefreshCw size={16} /> }
        : document?.status === "failed"
          ? { label: "Retry Ingest", action: "ingest", icon: <RefreshCw size={16} /> }
          : null;

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-kicker">Dokumen</p>
          <h1 className="mb-0 text-3xl font-semibold tracking-normal">
            {document?.title || "Detail Dokumen"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Lihat detail file dan perbarui metadata dokumen knowledge base.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button as={Link} icon={<ArrowLeft size={16} />} to="/admin/documents" variant="outline">
            Kembali
          </Button>
          {ingestAction ? (
            <Button
              disabled={!document || isIngesting || document.status === "processing"}
              icon={ingestAction.icon}
              onClick={() => handleIngest(ingestAction.action)}
              type="button"
              variant={ingestAction.action === "reindex" ? "secondary" : "default"}
            >
              {isIngesting ? "Memproses..." : ingestAction.label}
            </Button>
          ) : null}
          <Button
            disabled={!document || isSaving || isIngesting || document?.status === "processing"}
            icon={<Trash2 size={16} />}
            onClick={handleDelete}
            type="button"
            variant="destructive"
          >
            Hapus
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

      {isLoading ? <Loader label="Memuat detail dokumen" /> : null}

      {!isLoading && !document ? (
        <EmptyState title="Dokumen tidak ditemukan" description="Dokumen mungkin sudah dihapus atau ID tidak valid." />
      ) : null}

      {document ? (
        <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
          <Card className="p-5">
            <h2 className="mb-4 text-base font-semibold">Edit Metadata</h2>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <Input
                disabled={isSaving}
                error={formErrors.title}
                label="Judul"
                name="title"
                onChange={handleChange}
                value={form.title}
              />
              <Select
                disabled={isSaving}
                error={formErrors.source_type}
                label="Source Type"
                name="source_type"
                onChange={handleChange}
                value={form.source_type}
              >
                <option value="">Pilih source type</option>
                {SOURCE_TYPES.map((sourceType) => (
                  <option key={sourceType.value} value={sourceType.value}>
                    {sourceType.label}
                  </option>
                ))}
              </Select>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-foreground">Deskripsi</span>
                <textarea
                  className="min-h-32 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSaving}
                  name="description"
                  onChange={handleChange}
                  placeholder="Deskripsi singkat dokumen"
                  value={form.description}
                />
              </label>
              <Button disabled={isSaving} icon={<Save size={18} />} type="submit">
                {isSaving ? "Menyimpan..." : "Simpan Metadata"}
              </Button>
            </form>
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-base font-semibold">Informasi Dokumen</h2>
            <dl className="grid gap-3 text-sm">
              <div className="flex items-start justify-between gap-4 border-b pb-3">
                <dt className="text-muted-foreground">ID</dt>
                <dd className="font-mono">{document.id}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b pb-3">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <Badge tone={statusTone(document.status)}>{formatStatus(document.status)}</Badge>
                </dd>
              </div>
              <div className="grid gap-1 border-b pb-3">
                <dt className="text-muted-foreground">File</dt>
                <dd className="break-all font-medium">{document.file_name || "-"}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b pb-3">
                <dt className="text-muted-foreground">File Type</dt>
                <dd>{document.file_type || "-"}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b pb-3">
                <dt className="text-muted-foreground">Total Chunks</dt>
                <dd>{document.total_chunks ?? 0}</dd>
              </div>
              <div className="grid gap-1 border-b pb-3">
                <dt className="text-muted-foreground">Created At</dt>
                <dd>{formatDate(document.created_at)}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="text-muted-foreground">Updated At</dt>
                <dd>{formatDate(document.updated_at)}</dd>
              </div>
            </dl>
          </Card>
        </div>
      ) : null}
    </section>
  );
}

export default DocumentDetailPage;
