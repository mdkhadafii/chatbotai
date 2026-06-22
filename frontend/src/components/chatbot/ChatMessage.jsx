import ChatSourceList from "./ChatSourceList.jsx";

function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <article
      className={
        isUser
          ? "max-w-[85%] self-end rounded-lg bg-primary px-4 py-3 text-sm text-primary-foreground md:max-w-3xl"
          : "max-w-[92%] self-start rounded-lg border bg-muted/50 px-4 py-3 text-sm text-foreground md:max-w-3xl"
      }
    >
      <p className="mb-0 whitespace-pre-wrap leading-relaxed">{message.content}</p>
      {typeof message.confidenceScore === "number" ? (
        <p className="mt-3 mb-0 text-xs text-muted-foreground">
          Confidence {Math.round(message.confidenceScore * 100)}%
        </p>
      ) : null}
      <ChatSourceList sources={message.sources || []} />
    </article>
  );
}

export default ChatMessage;
