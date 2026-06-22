import { Link } from "react-router-dom";
import { ArrowRight, MessageSquareText, ShieldCheck } from "lucide-react";

import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";

function HomePage() {
  return (
    <section className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="section-kicker">Layanan Informasi Publik</p>
        <h1 className="mb-4 text-4xl font-semibold tracking-normal md:text-5xl">
          Chatbot AI RAG Instansi Pemerintah
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          Antarmuka untuk menjawab pertanyaan masyarakat berdasarkan dokumen resmi
          knowledge base instansi.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button as={Link} to="/chatbot" icon={<MessageSquareText size={18} />}>
            Buka Chatbot
          </Button>
          <Button as={Link} to="/admin/login" variant="outline" icon={<ShieldCheck size={18} />}>
            Masuk Admin
          </Button>
        </div>
      </div>
      <Card className="p-6">
        <div className="mb-5 flex items-center justify-between font-semibold">
          <span>Fitur Aplikasi</span>
          <ArrowRight size={18} />
        </div>
        <ul className="grid gap-3 pl-5 text-sm text-muted-foreground">
          <li>Chatbot publik dengan sumber jawaban dan session tersimpan.</li>
          <li>Dashboard admin untuk dokumen, ingest, dan monitoring sistem.</li>
          <li>Riwayat chat, retrieval test, dan audit log tersedia untuk evaluasi.</li>
          <li>Tampilan responsif dengan loading, error, dan empty state.</li>
        </ul>
      </Card>
    </section>
  );
}

export default HomePage;
