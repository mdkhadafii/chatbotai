function EmptyState({ title = "Belum ada data", description }) {
  return (
    <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-muted-foreground">
      <h2 className="mb-2 text-lg font-semibold text-foreground">{title}</h2>
      {description ? <p className="mb-0 text-sm">{description}</p> : null}
    </div>
  );
}

export default EmptyState;
