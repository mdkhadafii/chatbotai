import Button from "./Button.jsx";

function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-5" role="presentation">
      <section
        className="w-full max-w-xl rounded-lg border bg-card text-card-foreground shadow-soft"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="mb-0 text-lg font-semibold">{title}</h2>
          <Button variant="ghost" type="button" onClick={onClose}>
            Tutup
          </Button>
        </header>
        <div className="p-5">{children}</div>
      </section>
    </div>
  );
}

export default Modal;
