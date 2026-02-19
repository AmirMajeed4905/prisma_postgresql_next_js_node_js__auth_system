"use client";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Mail, Calendar, User, CheckCircle, XCircle } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const stats = [
    { label: "Role", value: user.role, icon: Shield, color: user.role === "ADMIN" ? "#fb923c" : "#a78bfa" },
    { label: "Email Status", value: user.isEmailVerified ? "Verified" : "Pending", icon: user.isEmailVerified ? CheckCircle : XCircle, color: user.isEmailVerified ? "#34d399" : "#f472b6" },
    { label: "Member Since", value: new Date(user.createdAt).toLocaleDateString("ur-PK"), icon: Calendar, color: "#22d3ee" },
    { label: "Account", value: "Active", icon: User, color: "#34d399" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold font-display">
        HI , <span className="gradient-text">{user.name}!</span> 👋
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#8888aa" }}>Welcome to your dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className="glass p-5 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium" style={{ color: "#8888aa" }}>{s.label}</p>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <p className="font-bold text-lg font-display" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* User info card */}
      <div className="glass p-6 animate-slide-up delay-300">
        <h2 className="font-bold font-display text-lg mb-4 gradient-text">Account Details</h2>
        <div className="space-y-4">
          {[
            { label: "Name", value: user.name, icon: User },
            { label: "Email", value: user.email, icon: Mail },
            { label: "Role", value: user.role, icon: Shield },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(167,139,250,0.1)" }}>
                <item.icon size={16} style={{ color: "#a78bfa" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "#8888aa" }}>{item.label}</p>
                <p className="font-medium text-sm" style={{ color: "#f0f0ff" }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up delay-400">
        <a href="/dashboard/profile"
          className="glass p-5 flex items-center gap-4 hover:border-purple-400/30 transition-all cursor-pointer group">
          <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
            <User size={18} className="text-white relative z-10" />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: "#f0f0ff" }}>Profile Edit</p>
            <p className="text-xs" style={{ color: "#8888aa" }}>update your name</p>
          </div>
        </a>

        {user.role === "ADMIN" && (
          <a href="/admin/users"
            className="glass p-5 flex items-center gap-4 hover:border-orange-400/30 transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #fb923c, #f472b6)" }}>
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#f0f0ff" }}>Users Manage</p>
              <p className="text-xs" style={{ color: "#8888aa" }}>Open Admin panel </p>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
