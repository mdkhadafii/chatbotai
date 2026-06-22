import { useState } from "react";
import { AlertCircle, Upload } from "lucide-react";

import { documentService } from "../../services/documentService.js";
import { SOURCE_TYPES } from "../../utils/constants.js";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";

const allowedExtensions = ["pdf", "txt", "docx", "csv", "json", "html"];

function UploadDocumentForm({ onUploaded }) {
  const [form, setForm] = useState({
    title: "",
    source_type: "",
    description: "",
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: files ? files[0] || null : value,
    }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
    setErrorMessage("");
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

    if (!form.file) {
      nextErrors.file = "File wajib dipilih.";
    } else {
      const extension = form.file.name.split(".").pop()?.toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        nextErrors.file = "Format file harus pdf, txt, docx, csv, json, atau html.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm() || isSubmitting) return;

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("source_type", form.source_type);
    formData.append("description", form.description.trim());
    formData.append("file", form.file);

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const uploadedDocument = await documentService.uploadDocument(formData);
      setSuccessMessage("Dokumen berhasil diupload.");
      setForm({ title: "", source_type: "", description: "", file: null });
      event.target.reset();
      onUploaded?.(uploadedDocument);
    } catch (error) {
      setErrorMessage(error.message || "Upload dokumen gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      {errorMessage ? (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}
      {successMessage ? (
        <div className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
          {successMessage}
        </div>
      ) : null}

      <Input
        disabled={isSubmitting}
        error={errors.title}
        label="Judul"
        name="title"
        onChange={handleChange}
        placeholder="Contoh: SOP Layanan Informasi Publik"
        value={form.title}
      />
      <Select
        disabled={isSubmitting}
        error={errors.source_type}
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
          className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          name="description"
          onChange={handleChange}
          placeholder="Deskripsi singkat dokumen"
          value={form.description}
        />
      </label>
      <Input
        accept=".pdf,.txt,.docx,.csv,.json,.html"
        disabled={isSubmitting}
        error={errors.file}
        label="File"
        name="file"
        onChange={handleChange}
        type="file"
      />
      <p className="mb-0 text-xs text-muted-foreground">
        Format didukung: pdf, txt, docx, csv, json, html.
      </p>
      <Button disabled={isSubmitting} icon={<Upload size={18} />} type="submit">
        {isSubmitting ? "Mengupload..." : "Upload Dokumen"}
      </Button>
    </form>
  );
}

export default UploadDocumentForm;
