import RetrievalTestForm from "../../components/admin/RetrievalTestForm.jsx";

function RetrievalTestPage() {
  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-kicker">ChromaDB</p>
          <h1 className="mb-0 text-3xl font-semibold tracking-normal">Retrieval Test</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Uji query embedding terhadap index ChromaDB dan cek ranking chunk yang dikembalikan.
          </p>
        </div>
      </div>
      <RetrievalTestForm />
    </section>
  );
}

export default RetrievalTestPage;
