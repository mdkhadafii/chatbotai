import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth.js";
import Button from "../ui/Button.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";

function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="flex min-h-16 flex-col gap-3 border-b bg-card px-4 py-4 md:flex-row md:items-center md:justify-between md:px-7 md:py-0">
      <div>
        <p className="mb-0 text-xs text-muted-foreground">Dashboard Admin</p>
        <h2 className="mb-0 text-lg font-semibold">{user?.name || "Admin Instansi"}</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        <ThemeToggle />
        <Button asChild variant="secondary">
          <Link to="/chatbot">Chatbot</Link>
        </Button>
        <Button type="button" variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}

export default Topbar;
