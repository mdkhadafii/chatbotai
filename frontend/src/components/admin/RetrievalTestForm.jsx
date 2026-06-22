import { Search } from "lucide-react";
import { useState } from "react";

import { retrievalService } from "../../services/retrievalService.js";
import { SOURCE_TYPES } from "../../utils/constants.js";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";

function scoreTone(score) {
  const normalizedScore = Number(score || 0);
  if (normalizedScore >= 0.75) return "success";
  if (normalizedScore >= 0.4) return "warning";
  return "neutral";
}

function formatScore(score) {
  return `${Math.round(Number(score || 0) * 100)}%`;
}

function RetrievalTestForm() {
  const [form, setForm] = useState({
    query: "",
    top_k: 5,
    source_type: "",
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const query = form.query.trim();
    const topK = Number(form.top_k);

    if (!query) {
      setErrorMessage("Query wajib diisi.");
      return;
    }

    if (!Number.isInteger(topK) || topK < 1 || topK > 20) {
      setErrorMessage("Top K harus berupa angka 1 sampai 20.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setResult(null);

    try {
      const data = await retrievalService.testRetrieval({
        query,
        top_k: topK,
        source_type: form.source_type || undefined,
      });
      setResult(data || null);
    } catch (error) {
      setErrorMessage(error.message || "Retrieval test gagal dijalankan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      <Card className="p-5">
        <form className="grid gap-4 lg:grid-cols-[1fr_140px_220px_auto]" onSubmit={handleSubmit}>
          <Input
            label="Query"
            name="query"
            onChange={handleChange}
            placeholder="Syarat pengajuan layanan informasi publik"
            value={form.query}
          />
          <Input
            label="Top K"
            max="20"
            min="1"
            name="top_k"
            onChange={handleChange}
            type="number"
            value={form.top_k}
          />
          <Select label="Source Type" name="source_type" onChange={handleChange} value={form.source_type}>
            <option value="">Semua source type</option>
            {SOURCE_TYPES.map((sourceType) => (
              <option key={sourceType.value} value={sourceType.value}>
                {sourceType.label}
              </option>
            ))}
          </Select>
          <div className="flex items-end">
            <Button className="w-full" disabled={isLoading} icon={<Search size={16} />} type="submit">
              {isLoading ? "Menguji..." : "Jalankan"}
            </Button>
          </div>
        </form>
      </Card>

      {errorMessage ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <Card className="p-5">
        <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="mb-0 text-base font-semibold">Hasil Retrieval</h2>
            <p className="mb-0 mt-1 text-sm text-muted-foreground">
              {result
                ? `${result.results?.length || 0} chunk ditemukan untuk "${result.query}"`
                : "Jalankan query untuk melihat hasil terdekat."}
            </p>
          </div>
          {result ? <Badge tone="info">Top {result.top_k}</Badge> : null}
        </div>

        {isLoading ? (
          <div className="rounded-md border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            Mengambil hasil retrieval...
          </div>
        ) : null}

        {!isLoading && result?.results?.length ? (
          <div className="grid gap-3">
            {result.results.map((item, index) => (
              <article key={item.chunk_id || index} className="rounded-md border bg-background p-4">
                <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="mb-1 font-medium">Chunk {index + 1}</p>
                    <p className="mb-0 break-all font-mono text-xs text-muted-foreground">
                      {item.chunk_id || "-"} - Dokumen #{item.document_id || "-"}
                    </p>
                  </div>
                  <Badge tone={scoreTone(item.score)}>Score {formatScore(item.score)}</Badge>
                </div>
                <p className="mb-3 whitespace-pre-line text-sm leading-6">{item.content || "-"}</p>
                <div className="grid gap-2 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground md:grid-cols-2">
                  <span>Title: {item.metadata?.title || "-"}</span>
                  <span>Source: {item.metadata?.source_type || "-"}</span>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {!isLoading && result && !result.results?.length ? (
          <div className="rounded-md border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            Tidak ada chunk yang cocok.
          </div>
        ) : null}
      </Card>
    </div>
  );
}

export default RetrievalTestForm;
