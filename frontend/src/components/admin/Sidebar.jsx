import {
  Activity,
  ClipboardList,
  Database,
  FileText,
  LayoutDashboard,
  MessageSquareText,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "../../lib/utils.js";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/documents", label: "Dokumen", icon: FileText },
  { to: "/admin/chat-history", label: "Riwayat Chat", icon: MessageSquareText },
  { to: "/admin/retrieval-test", label: "Retrieval Test", icon: Database },
  { to: "/admin/audit-logs", label: "Audit Log", icon: ClipboardList },
];

function Sidebar() {
  return (
    <aside className="border-b bg-card p-4 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:p-5">
      <div className="mb-5 inline-flex items-center gap-2 font-bold">
        <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
          AI
        </span>
        <span>Admin</span>
      </div>
      <nav className="flex gap-2 overflow-x-auto lg:grid lg:overflow-visible">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground",
                )
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto hidden items-center gap-2 pt-8 text-sm text-muted-foreground lg:flex">
        <Activity size={16} />
        <span>Monitoring siap</span>
      </div>
    </aside>
  );
}

export default Sidebar;
