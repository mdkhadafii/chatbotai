import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import AuditLogPage from "../pages/admin/AuditLogPage.jsx";
import ChatHistoryDetailPage from "../pages/admin/ChatHistoryDetailPage.jsx";
import ChatHistoryPage from "../pages/admin/ChatHistoryPage.jsx";
import DashboardPage from "../pages/admin/DashboardPage.jsx";
import DocumentDetailPage from "../pages/admin/DocumentDetailPage.jsx";
import DocumentsPage from "../pages/admin/DocumentsPage.jsx";
import LoginPage from "../pages/admin/LoginPage.jsx";
import RetrievalTestPage from "../pages/admin/RetrievalTestPage.jsx";
import ChatbotPage from "../pages/public/ChatbotPage.jsx";
import HomePage from "../pages/public/HomePage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Route>

      <Route path="/admin/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="documents/:id" element={<DocumentDetailPage />} />
        <Route path="chat-history" element={<ChatHistoryPage />} />
        <Route path="chat-history/:id" element={<ChatHistoryDetailPage />} />
        <Route path="retrieval-test" element={<RetrievalTestPage />} />
        <Route path="audit-logs" element={<AuditLogPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
