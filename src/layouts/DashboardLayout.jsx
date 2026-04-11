import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Users, UserPlus, LogOut, Menu, X, KeyRound, ChevronRight } from "lucide-react";
import Footer from "../components/Footer";

const navItems = [
  { to: "/",              label: "Dashboard",     icon: LayoutDashboard, end: true },
  { to: "/students",      label: "Students",      icon: Users },
  { to: "/add-student",   label: "Admit Student", icon: UserPlus },
  { to: "/reset-password",label: "Reset Password",icon: KeyRound },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="flex h-screen bg-slate-50">

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 flex flex-col
        bg-white border-r border-gray-100 shadow-xl
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">CC</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">CSC Center</p>
              <p className="text-xs text-gray-400">Partner Portal</p>
            </div>
          </div>
          <button className="md:hidden p-1 rounded-lg hover:bg-gray-100" onClick={() => setOpen(false)}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Center info */}
        <div className="mx-3 mt-3 mb-1 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white">
          <p className="text-xs font-semibold opacity-70 uppercase tracking-wide mb-1">Center</p>
          <p className="font-bold text-sm leading-tight truncate">{user?.center?.name || "My Center"}</p>
          {user?.center?.center_id && (
            <span className="inline-block mt-1.5 text-xs font-mono bg-white/20 px-2 py-0.5 rounded-md">
              {user.center.center_id}
            </span>
          )}
          <p className="text-xs opacity-60 mt-1.5 truncate">{user?.email}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"}
              `}>
              {({ isActive }) => (
                <>
                  <Icon size={17} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={14} className="opacity-60" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)} />
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 md:hidden shadow-sm">
          <button onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition">
            <Menu size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">CC</span>
            </div>
            <span className="font-semibold text-gray-700 text-sm">CSC Center Portal</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
