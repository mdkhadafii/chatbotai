import { Link, NavLink, Outlet } from "react-router-dom";

import ThemeToggle from "../components/ui/ThemeToggle.jsx";
import { cn } from "../lib/utils.js";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex min-h-16 flex-col gap-3 border-b bg-background/95 px-4 py-4 backdrop-blur md:flex-row md:items-center md:justify-between md:px-8 md:py-0">
        <Link className="inline-flex items-center gap-2 font-bold" to="/">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            AI
          </span>
          <span>Chatbot RAG</span>
        </Link>
        <nav className="flex items-center gap-2 overflow-x-auto text-sm font-medium text-muted-foreground">
          <NavLink className={({ isActive }) => cn("rounded-md px-3 py-2", isActive && "bg-accent text-accent-foreground")} to="/">
            Beranda
          </NavLink>
          <NavLink className={({ isActive }) => cn("rounded-md px-3 py-2", isActive && "bg-accent text-accent-foreground")} to="/chatbot">
            Chatbot
          </NavLink>
          <NavLink className={({ isActive }) => cn("rounded-md px-3 py-2", isActive && "bg-accent text-accent-foreground")} to="/admin/login">
            Admin
          </NavLink>
          <ThemeToggle />
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-16">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
