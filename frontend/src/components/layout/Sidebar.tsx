import { NavLink, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store/auth.store";

function Sidebar() {
  const navigate = useNavigate();

  const { user, logout} = useAuthStore();

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
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm transition ${
              isActive
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`
          }
        >
          Dashboard
        </NavLink>

        <button
          type="button"
          className="rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
        >
          All Notes
        </button>

        <button
          type="button"
          className="rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
        >
          Pending
        </button>

        <button
          type="button"
          className="rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
        >
          Completed
        </button>

        <button
          type="button"
          className="mt-4 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium transition hover:bg-indigo-500"
        >
          + New Note
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
          className="mb-2 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
        >
          Settings
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-950"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
