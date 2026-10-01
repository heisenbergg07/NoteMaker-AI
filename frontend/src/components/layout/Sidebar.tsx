import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  List,
  CircleDashed,
  CircleCheck,
  Plus,
  Settings,
  LogOut,
} from "lucide-react";

import { useAuthStore } from "../../store/auth.store";

function Sidebar() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 p-5 text-white">

      {/* Logo */}

      <div className="mb-8">
        <h1 className="text-xl font-bold">
          NoteMaker AI
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Your intelligent workspace
        </p>
      </div>

      {/* Navigation */}

      <nav className="flex flex-1 flex-col gap-2">

        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              isActive
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/dashboard?filter=all"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
        >
          <List size={18} />
          All Notes
        </NavLink>

        <NavLink
          to="/dashboard?filter=pending"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
        >
          <CircleDashed size={18} />
          Pending
        </NavLink>

        <NavLink
          to="/dashboard?filter=completed"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
        >
          <CircleCheck size={18} />
          Completed
        </NavLink>

        <button
          type="button"
          onClick={() => navigate("/dashboard?create=true")}
          className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium transition hover:bg-indigo-500"
        >
          <Plus size={18} />
          New Note
        </button>

      </nav>

      {/* User */}

      <div className="border-t border-slate-800 pt-4">

        <div className="mb-4">
          <p className="text-sm font-medium">
            {user?.name ?? "User"}
          </p>

          <p className="truncate text-xs text-slate-500">
            {user?.email}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
        >
          <Settings size={18} />
          Settings
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-400 transition hover:bg-red-950"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;