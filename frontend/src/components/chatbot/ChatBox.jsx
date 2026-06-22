import { useEffect, useRef, useState } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

import { chatbotService } from "../../services/chatbotService.js";
import { CHATBOT_STORAGE_KEYS } from "../../utils/constants.js";
import Button from "../ui/Button.jsx";
import ChatInput from "./ChatInput.jsx";
import ChatMessage from "./ChatMessage.jsx";

const initialMessages = [
  {
    id: "welcome",
    role: "assistant",
    content: "Silakan ajukan pertanyaan seputar layanan dan informasi resmi instansi.",
    sources: [],
  },
];

function createSessionId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getStoredSessionId() {
  const storedSessionId = localStorage.getItem(CHATBOT_STORAGE_KEYS.sessionId);
  if (storedSessionId) return storedSessionId;

  const nextSessionId = createSessionId();
  localStorage.setItem(CHATBOT_STORAGE_KEYS.sessionId, nextSessionId);
  return nextSessionId;
}

function ChatBox() {
  const [messages, setMessages] = useState(initialMessages);
  const [question, setQuestion] = useState("");
  const [sessionId, setSessionId] = useState(() => getStoredSessionId());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  const handleResetSession = () => {
    const nextSessionId = createSessionId();
    localStorage.setItem(CHATBOT_STORAGE_KEYS.sessionId, nextSessionId);
    setSessionId(nextSessionId);
    setMessages(initialMessages);
    setQuestion("");
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedQuestion,
      sources: [],
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setQuestion("");
    setErrorMessage("");
    setIsLoading(true);

    try {
      const data = await chatbotService.sendMessage({
        session_id: sessionId,
        question: trimmedQuestion,
      });

      if (data?.session_id && data.session_id !== sessionId) {
        localStorage.setItem(CHATBOT_STORAGE_KEYS.sessionId, data.session_id);
        setSessionId(data.session_id);
      }

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data?.answer || "Maaf, jawaban belum tersedia.",
        sources: data?.sources || [],
        confidenceScore: data?.confidence_score,
      };

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    } catch (error) {
      setErrorMessage(error.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="section-kicker">Chatbot Publik</p>
          <h1 className="mb-0 text-3xl font-semibold tracking-normal md:text-5xl">
            Asisten Informasi Resmi
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            Ajukan pertanyaan tentang FAQ, SOP, layanan instansi, dan dokumen resmi
            yang sudah masuk knowledge base.
          </p>
        </div>
        <Button
          className="w-full md:w-auto"
          icon={<RotateCcw size={16} />}
          onClick={handleResetSession}
          type="button"
          variant="outline"
        >
          Sesi Baru
        </Button>
      </div>
      <div className="grid h-[calc(100svh-260px)] min-h-[420px] grid-rows-[1fr_auto] overflow-hidden rounded-lg border bg-card shadow-soft md:h-[620px] md:min-h-[520px]">
        <div className="flex min-h-0 flex-col gap-3 overflow-y-auto p-4 md:p-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading ? (
            <div className="max-w-[92%] self-start rounded-lg border bg-muted/50 px-4 py-3 text-sm text-muted-foreground md:max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span>Mencari jawaban dari dokumen resmi...</span>
              </div>
            </div>
          ) : null}
          {errorMessage ? (
            <div className="flex max-w-[92%] items-start gap-2 self-start rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive md:max-w-3xl">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : null}
          <div ref={messageEndRef} />
        </div>
        <ChatInput
          disabled={isLoading}
          onChange={setQuestion}
          onSubmit={handleSubmit}
          value={question}
        />
      </div>
      <p className="mb-0 text-xs text-muted-foreground">
        Session ID: <span className="font-mono">{sessionId}</span>
      </p>
    </section>
  );
}

export default ChatBox;
