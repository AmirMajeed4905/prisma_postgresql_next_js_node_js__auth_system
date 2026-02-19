"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { userApi } from "@/lib/api";
import { toast } from "sonner";
import { Users, Trash2, Shield, User, ChevronLeft, ChevronRight, Search, Loader2, CheckCircle, XCircle } from "lucide-react";
import { User as UserType } from "@/types";

export default function AdminUsersPage() {
  const { user: me, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!me || !isAdmin)) router.replace("/dashboard");
  }, [me, isAdmin, loading, router]);

  const fetchUsers = useCallback(async (page = 1) => {
    setFetching(true);
    try {
      const { data } = await userApi.getAllUsers(page, 10);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch { toast.error("Users load nahi hue"); }
    finally { setFetching(false); }
  }, []);

  useEffect(() => { if (isAdmin) fetchUsers(); }, [isAdmin, fetchUsers]);

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure ? User will be deleted.")) return;
    setDeletingId(id);
    try {
      await userApi.deleteUser(id);
      toast.success("User deleted successfully");
      fetchUsers(pagination.page);
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "user not deleted");
    } finally { setDeletingId(null); }
  };

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    setUpdatingId(id);
    try {
      await userApi.updateRole(id, newRole);
      toast.success(`Role ${newRole} kar diya gaya`);
      fetchUsers(pagination.page);
    } catch { toast.error("Role update nahi hua"); }
    finally { setUpdatingId(null); }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAdmin) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold font-display gradient-text-warm">Users Management</h1>
          <p className="text-sm mt-1" style={{ color: "#8888aa" }}>Total {pagination.total} users</p>
        </div>
      </div>

      {/* Search */}
      <div className="glass p-4 animate-slide-up delay-100">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#8888aa" }} />
          <input
            type="text"
            placeholder="Naam ya email se search karein..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-glass w-full pl-10 pr-4 py-3 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass overflow-hidden animate-slide-up delay-200">
        {fetching ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin" style={{ color: "#a78bfa" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Users size={36} style={{ color: "#555577" }} />
            <p style={{ color: "#8888aa" }}>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["User", "Email", "Role", "Verified", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "#8888aa" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id} className="transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", animationDelay: `${i * 0.05}s` }}>
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ background: "linear-gradient(135deg, #f472b6, #a78bfa)" }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm" style={{ color: "#f0f0ff" }}>{u.name}</p>
                          {u.id === me?.id && <span className="text-xs" style={{ color: "#a78bfa" }}>You</span>}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-mono" style={{ color: "#8888aa" }}>{u.email}</p>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                        style={{
                          background: u.role === "ADMIN" ? "rgba(251,146,60,0.15)" : "rgba(167,139,250,0.15)",
                          color: u.role === "ADMIN" ? "#fb923c" : "#a78bfa",
                        }}>
                        {u.role === "ADMIN" ? "👑 Admin" : "👤 User"}
                      </span>
                    </td>

                    {/* Verified */}
                    <td className="px-5 py-4">
                      {u.isEmailVerified
                        ? <CheckCircle size={16} style={{ color: "#34d399" }} />
                        : <XCircle size={16} style={{ color: "#f472b6" }} />}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {u.id !== me?.id && (
                          <>
                            <button onClick={() => toggleRole(u.id, u.role)} disabled={!!updatingId}
                              title={`${u.role === "ADMIN" ? "User" : "Admin"} banao`}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10 disabled:opacity-50"
                              style={{ color: u.role === "ADMIN" ? "#fb923c" : "#a78bfa" }}>
                              {updatingId === u.id ? <Loader2 size={14} className="animate-spin" /> : u.role === "ADMIN" ? <User size={14} /> : <Shield size={14} />}
                            </button>
                            <button onClick={() => deleteUser(u.id)} disabled={!!deletingId}
                              title="Delete karein"
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/10 disabled:opacity-50"
                              style={{ color: "#f472b6" }}>
                              {deletingId === u.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between animate-slide-up delay-300">
          <p className="text-sm" style={{ color: "#8888aa" }}>
            Page {pagination.page} / {pagination.totalPages} — Total {pagination.total} users
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchUsers(pagination.page - 1)} disabled={pagination.page === 1}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
              style={{ background: "rgba(255,255,255,0.05)", color: "#8888aa" }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => fetchUsers(pagination.page + 1)} disabled={pagination.page === pagination.totalPages}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
              style={{ background: "rgba(255,255,255,0.05)", color: "#8888aa" }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
