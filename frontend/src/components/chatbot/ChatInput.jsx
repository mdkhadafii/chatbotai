import { Send } from "lucide-react";

import Button from "../ui/Button.jsx";

function ChatInput({ disabled = false, onSubmit, value, onChange }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form className="grid gap-3 border-t bg-background/60 p-4 md:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
      <input
        className="h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Tulis pertanyaan layanan publik..."
        disabled={disabled}
        maxLength={1000}
        onChange={(event) => onChange?.(event.target.value)}
        value={value}
      />
      <Button type="submit" disabled={disabled || !value?.trim()} icon={<Send size={18} />}>
        Kirim
      </Button>
    </form>
  );
}

export default ChatInput;
