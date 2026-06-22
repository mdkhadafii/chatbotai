import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, LogIn } from "lucide-react";

import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import ThemeToggle from "../../components/ui/ThemeToggle.jsx";
import { useAuth } from "../../hooks/useAuth.js";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = location.state?.from?.pathname || "/admin/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setFormErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
    setErrorMessage("");
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email wajib diisi.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Format email tidak valid.";
    }

    if (!form.password) {
      nextErrors.password = "Password wajib diisi.";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Login gagal. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-background p-6 text-foreground">
      <Card className="grid w-full max-w-md gap-6 p-7">
        <div className="flex items-center justify-between gap-3">
          <Link className="inline-flex items-center gap-2 font-bold" to="/">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-xs text-primary-foreground">
              AI
            </span>
            <span>Chatbot RAG</span>
          </Link>
          <ThemeToggle />
        </div>
        <div>
          <p className="section-kicker">Admin</p>
          <h1 className="mb-0 text-3xl font-semibold tracking-normal">Masuk Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gunakan akun admin untuk mengelola knowledge base dan melihat status sistem.
          </p>
        </div>
        {errorMessage ? (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : null}
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Input
            autoComplete="email"
            disabled={isSubmitting}
            error={formErrors.email}
            label="Email"
            name="email"
            onChange={handleChange}
            placeholder="admin@example.com"
            type="email"
            value={form.email}
          />
          <Input
            autoComplete="current-password"
            disabled={isSubmitting}
            error={formErrors.password}
            label="Password"
            name="password"
            onChange={handleChange}
            placeholder="Masukkan password"
            type="password"
            value={form.password}
          />
          <Button disabled={isSubmitting} icon={<LogIn size={18} />} type="submit">
            {isSubmitting ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </Card>
    </main>
  );
}

export default LoginPage;
