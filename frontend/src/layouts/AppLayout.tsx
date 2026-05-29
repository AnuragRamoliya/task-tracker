import { LayoutDashboard, LogOut, FolderKanban, ListTodo } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { useAuthStore } from "../store/authStore";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-brand text-white" : "text-ink hover:bg-white"}`;

export function AppLayout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout().catch(() => undefined);
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-line bg-mist p-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Task Tracker</h1>
          <p className="text-sm text-ink/60">{user?.role}</p>
        </div>
        <nav className="grid gap-2">
          <NavLink to="/" className={linkClass}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/tasks" className={linkClass}>
            <ListTodo size={18} /> Tasks
          </NavLink>
          <NavLink to="/projects" className={linkClass}>
            <FolderKanban size={18} /> Projects
          </NavLink>
        </nav>
        <button onClick={onLogout} className="mt-8 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-white">
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <main className="p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
