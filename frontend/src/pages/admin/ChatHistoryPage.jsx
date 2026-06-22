import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

import ChatHistoryTable from "../../components/admin/ChatHistoryTable.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import Loader from "../../components/ui/Loader.jsx";
import { chatbotService } from "../../services/chatbotService.js";

function ChatHistoryPage() {
  const [histories, setHistories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const params = useMemo(
    () => ({
      page: pagination.page,
      limit: pagination.limit,
    }),
    [pagination.limit, pagination.page],
  );

  const loadHistories = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await chatbotService.getChatHistory(params);
      setHistories(result.data || []);
      setPagination((currentPagination) => ({
        ...currentPagination,
        ...(result.pagination || {}),
      }));
    } catch (error) {
      setHistories([]);
      setErrorMessage(error.message || "Riwayat chat gagal dimuat.");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadHistories();
  }, [loadHistories]);

  const handleDelete = async (history) => {
    const confirmed = window.confirm(`Hapus riwayat chat ID ${history.id}?`);
    if (!confirmed) return;

    setErrorMessage("");
    setSuccessMessage("");

    try {
      await chatbotService.deleteChatHistory(history.id);
      setSuccessMessage("Riwayat chat berhasil dihapus.");
      loadHistories();
    } catch (error) {
      setErrorMessage(error.message || "Riwayat chat gagal dihapus.");
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
          <p className="section-kicker">Percakapan</p>
          <h1 className="mb-0 text-3xl font-semibold tracking-normal">Riwayat Chat</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pantau pertanyaan publik, jawaban chatbot, confidence score, dan sumber jawaban.
          </p>
        </div>
        <Button
          className="w-full md:w-auto"
          disabled={isLoading}
          icon={<RefreshCw size={16} />}
          onClick={loadHistories}
          type="button"
          variant="outline"
        >
          Refresh
        </Button>
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

      {isLoading ? <Loader label="Memuat riwayat chat" /> : null}
      <ChatHistoryTable histories={histories} isLoading={isLoading} onDelete={handleDelete} />

      <Card className="flex flex-col gap-3 p-4 text-sm md:flex-row md:items-center md:justify-between">
        <span className="text-muted-foreground">
          Total {pagination.total || 0} riwayat, halaman {pagination.page || 1} dari {pagination.total_pages || 1}
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
      </Card>
    </section>
  );
}

export default ChatHistoryPage;
