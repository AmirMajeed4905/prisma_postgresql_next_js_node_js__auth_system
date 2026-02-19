"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, LogOut, User, Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
];

const adminItems = [
  { href: "/admin", icon: Shield, label: "Admin Panel" },
  { href: "/admin/users", icon: Users, label: "Users" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logout ho gaye!");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "#a78bfa", borderTopColor: "transparent" }} />
    </div>
  );

  if (!user) return null;

  const allNavItems = [...navItems, ...(isAdmin ? adminItems : [])];

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0a0f" }}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 lg:translate-x-0 lg:relative lg:flex lg:flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "#0d0d14", borderRight: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center">
              <span className="text-lg relative z-10">🔐</span>
            </div>
            <span className="font-bold font-display gradient-text text-lg">Auth System</span>
          </div>
        </div>

        {/* User info */}
        <div className="p-4 mx-3 mt-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #f472b6, #a78bfa)" }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate" style={{ color: "#f0f0ff" }}>{user.name}</p>
              <span className="text-xs px-1.5 py-0.5 rounded-md font-medium"
                style={{ background: isAdmin ? "rgba(251,146,60,0.15)" : "rgba(167,139,250,0.15)", color: isAdmin ? "#fb923c" : "#a78bfa" }}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 mt-2">
          {allNavItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? "rgba(167,139,250,0.15)" : "transparent",
                  color: active ? "#a78bfa" : "#8888aa",
                  border: active ? "1px solid rgba(167,139,250,0.2)" : "1px solid transparent",
                }}>
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-red-500/10"
            style={{ color: "#f472b6", border: "1px solid transparent" }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4"
          style={{ background: "rgba(13,13,20,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: "#8888aa" }}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #f472b6, #a78bfa)" }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
