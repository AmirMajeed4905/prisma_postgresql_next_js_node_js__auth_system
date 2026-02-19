"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { userApi } from "@/lib/api";
import { Users, Shield, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, verified: 0, admins: 0, users: 0 });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/dashboard");
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    userApi.getAllUsers(1, 100).then(({ data }) => {
      const all = data.users;
      setStats({
        total: data.pagination.total,
        verified: all.filter((u: { isEmailVerified: boolean }) => u.isEmailVerified).length,
        admins: all.filter((u: { role: string }) => u.role === "ADMIN").length,
        users: all.filter((u: { role: string }) => u.role === "USER").length,
      });
    }).catch(() => {});
  }, []);

  if (!isAdmin) return null;

  const cards = [
    { label: "Total Users", value: stats.total, icon: Users, color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
    { label: "Verified", value: stats.verified, icon: CheckCircle, color: "#34d399", bg: "rgba(52,211,153,0.1)" },
    { label: "Admins", value: stats.admins, icon: Shield, color: "#fb923c", bg: "rgba(251,146,60,0.1)" },
    { label: "Normal Users", value: stats.users, icon: XCircle, color: "#22d3ee", bg: "rgba(34,211,238,0.1)" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #fb923c, #f472b6)" }}>
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display gradient-text-warm">Admin Panel</h1>
            <p className="text-xs" style={{ color: "#8888aa" }}>System overview</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={c.label} className="glass p-5 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs" style={{ color: "#8888aa" }}>{c.label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c.bg }}>
                <c.icon size={14} style={{ color: c.color }} />
              </div>
            </div>
            <p className="text-3xl font-bold font-display" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="glass p-6 animate-slide-up delay-300">
        <h2 className="font-semibold font-display mb-4" style={{ color: "#f0f0ff" }}>Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/admin/users"
            className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(167,139,250,0.15)" }}>
              <Users size={18} style={{ color: "#a78bfa" }} />
            </div>
            <div>
              <p className="font-medium text-sm" style={{ color: "#f0f0ff" }}>Users Manage Karein</p>
              <p className="text-xs" style={{ color: "#8888aa" }}>Delete, role change</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
