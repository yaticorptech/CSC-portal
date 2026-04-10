import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Users, UserPlus, LogOut, Menu, X, KeyRound, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

const LMS_URL = "https://access.yaticorp.in/signin";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/students", label: "Students", icon: Users },
  { to: "/add-student", label: "Add Student", icon: UserPlus },
  { to: "/reset-password", label: "Reset Password", icon: KeyRound },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [lmsOpen, setLmsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h1 className="text-lg font-bold text-blue-700">CSC Center</h1>
            <p className="text-xs text-gray-400">Partner Portal</p>
          </div>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b bg-blue-50">
          <p className="text-sm font-semibold text-gray-700 truncate">
            {user?.center?.name || "My Center"}
          </p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          {/* ── AI Course Access Login dropdown ── */}
          <div className="pt-2">
            <button
              onClick={() => setLmsOpen(o => !o)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink size={16} />
                AI Course Access
              </span>
              {lmsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {lmsOpen && (
              <div className="mt-2 mx-1 rounded-xl border border-blue-200 overflow-hidden text-xs">
                {/* Note */}
                <div className="bg-yellow-50 border-b border-yellow-200 px-3 py-2 flex gap-2">
                  <span className="text-yellow-500 shrink-0">⚠️</span>
                  <p className="text-yellow-800 font-medium leading-snug">
                    To be completed by CSC Center — sign in with each student's credentials to enroll them.
                  </p>
                </div>

                <div className="bg-blue-50 p-3 space-y-2">
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
                    <p className="text-gray-400 mb-0.5">Login URL</p>
                    <a href={LMS_URL} target="_blank" rel="noreferrer"
                      className="text-blue-600 font-semibold hover:underline break-all leading-snug block">
                      {LMS_URL}
                    </a>
                  </div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
                    <p className="text-gray-400 mb-0.5">Email format</p>
                    <p className="font-mono font-bold text-gray-700">[card_no]@yaticorp.com</p>
                  </div>
                  <a href={LMS_URL} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                    Open Login →
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>

        <button
          onClick={handleLogout}
          className="m-4 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-4 py-3 flex items-center gap-3 md:hidden">
          <button onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
          <h1 className="font-semibold text-gray-700">CSC Center Portal</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
