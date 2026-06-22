import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarClock, Hash, MessageSquareText, Trash2 } from "lucide-react";

import ChatSourceList from "../../components/chatbot/ChatSourceList.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Loader from "../../components/ui/Loader.jsx";
import { chatbotService } from "../../services/chatbotService.js";
import { formatDate } from "../../utils/formatDate.js";

function confidenceTone(score) {
  if (score >= 0.75) return "success";
  if (score >= 0.4) return "warning";
  return "neutral";
}

function formatConfidence(score) {
  return `${Math.round(Number(score || 0) * 100)}%`;
}

function ChatHistoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await chatbotService.getChatHistoryById(id);
      setHistory(data);
    } catch (error) {
      setHistory(null);
      setErrorMessage(error.message || "Detail chat gagal dimuat.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDelete = async () => {
    if (!history) return;
    const confirmed = window.confirm(`Hapus riwayat chat ID ${history.id}?`);
    if (!confirmed) return;

    try {
      await chatbotService.deleteChatHistory(history.id);
      navigate("/admin/chat-history", { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Riwayat chat gagal dihapus.");
    }
  };

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-kicker">Percakapan</p>
          <h1 className="mb-0 text-3xl font-semibold tracking-normal">Detail Chat</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Detail pertanyaan publik, jawaban chatbot, confidence score, dan sumber dokumen.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button as={Link} icon={<ArrowLeft size={16} />} to="/admin/chat-history" variant="outline">
            Kembali
          </Button>
          <Button
            disabled={!history}
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

      {isLoading ? <Loader label="Memuat detail chat" /> : null}

      {!isLoading && !history ? (
        <EmptyState title="Riwayat chat tidak ditemukan" description="Data mungkin sudah dihapus atau ID tidak valid." />
      ) : null}

      {history ? (
        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-primary" />
                <h2 className="mb-0 text-base font-semibold">Pertanyaan</h2>
              </div>
              <p className="mb-0 whitespace-pre-wrap leading-relaxed">{history.question}</p>
            </Card>

            <Card className="p-5">
              <h2 className="mb-4 text-base font-semibold">Jawaban Chatbot</h2>
              <p className="mb-0 whitespace-pre-wrap leading-relaxed text-sm">{history.answer}</p>
              <ChatSourceList sources={history.sources || []} />
            </Card>
          </div>

          <Card className="p-5">
            <h2 className="mb-4 text-base font-semibold">Metadata</h2>
            <dl className="grid gap-3 text-sm">
              <div className="flex items-start justify-between gap-4 border-b pb-3">
                <dt className="inline-flex items-center gap-2 text-muted-foreground">
                  <Hash size={14} />
                  ID
                </dt>
                <dd className="font-mono">{history.id}</dd>
              </div>
              <div className="grid gap-1 border-b pb-3">
                <dt className="text-muted-foreground">Session ID</dt>
                <dd className="break-all font-mono text-xs">{history.session_id}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b pb-3">
                <dt className="text-muted-foreground">Confidence</dt>
                <dd>
                  <Badge tone={confidenceTone(history.confidence_score)}>
                    {formatConfidence(history.confidence_score)}
                  </Badge>
                </dd>
              </div>
              <div className="grid gap-1 border-b pb-3">
                <dt className="inline-flex items-center gap-2 text-muted-foreground">
                  <CalendarClock size={14} />
                  Tanggal
                </dt>
                <dd>{formatDate(history.created_at)}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Jumlah Sumber</dt>
                <dd>{history.sources?.length || 0}</dd>
              </div>
            </dl>
          </Card>
        </div>
      ) : null}
    </section>
  );
}

export default ChatHistoryDetailPage;
