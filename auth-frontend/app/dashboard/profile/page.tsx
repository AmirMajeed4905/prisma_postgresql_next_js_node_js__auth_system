"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { User, Lock, Trash2, Loader2, Save, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { userApi, authApi } from "@/lib/api";
import { useRouter } from "next/navigation";

const nameSchema = z.object({ name: z.string().min(2, "2+ characters chahiye") });
const passSchema = z.object({
  currentPassword: z.string().min(1, "Enter Current password "),
  newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
  confirm: z.string(),
}).refine((d) => d.newPassword === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

export default function ProfilePage() {
  const { user, refetch } = useAuth();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const nameForm = useForm({ resolver: zodResolver(nameSchema), values: { name: user?.name || "" } });
  const passForm = useForm({ resolver: zodResolver(passSchema) });

  const updateName = async (data: { name: string }) => {
    try {
      await userApi.updateProfile(data);
      await refetch();
      toast.success("Name updated successfully!");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Update failed");
    }
  };

  const changePass = async (data: { currentPassword: string; newPassword: string; confirm: string }) => {
    try {
      await authApi.changePassword(data.currentPassword, data.newPassword);
      toast.success("Password changed successfully! Please login again.");
      passForm.reset();
      router.push("/login");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error");
    }
  };

  const deleteAccount = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    try {
      await userApi.deleteAccount();
      toast.success("Account deleted successfully");
      router.push("/login");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Delete failed");
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold font-display gradient-text">Profile Settings</h1>
        <p className="text-sm mt-1" style={{ color: "#8888aa" }}>Manage your profile settings</p>
      </div>

      {/* Update Name */}
      <div className="glass p-6 animate-slide-up delay-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center">
            <User size={16} className="text-white relative z-10" />
          </div>
          <h2 className="font-semibold font-display">Update Name</h2>
        </div>
        <form onSubmit={nameForm.handleSubmit(updateName)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#ccccee" }}>Name</label>
            <input {...nameForm.register("name")} className="input-glass w-full px-4 py-3 text-sm" />
            {nameForm.formState.errors.name && (
              <p className="mt-1 text-xs" style={{ color: "#f472b6" }}>{nameForm.formState.errors.name.message}</p>
            )}
          </div>
          <button type="submit" disabled={nameForm.formState.isSubmitting}
            className="btn-gradient px-6 py-2.5 rounded-xl font-semibold text-sm text-white flex items-center gap-2 disabled:opacity-50">
            {nameForm.formState.isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Changes
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="glass p-6 animate-slide-up delay-200">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(167,139,250,0.15)" }}>
            <Lock size={16} style={{ color: "#a78bfa" }} />
          </div>
          <h2 className="font-semibold font-display">Change Password</h2>
        </div>
        <form onSubmit={passForm.handleSubmit(changePass as any)} className="space-y-4">
          {[
            { name: "currentPassword" as const, label: "Current Password", placeholder: "••••••••" },
            { name: "newPassword" as const, label: "New Password", placeholder: "••••••••" },
            { name: "confirm" as const, label: "Confirm Password", placeholder: "••••••••" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium mb-2" style={{ color: "#ccccee" }}>{f.label}</label>
              <div className="relative">
                <input {...passForm.register(f.name)} type={showPass ? "text" : "password"}
                  placeholder={f.placeholder} className="input-glass w-full px-4 py-3 text-sm pr-12" />
                {f.name === "currentPassword" && (
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#8888aa" }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
              {passForm.formState.errors[f.name] && (
                <p className="mt-1 text-xs" style={{ color: "#f472b6" }}>
                  {passForm.formState.errors[f.name]?.message as string}
                </p>
              )}
            </div>
          ))}
          <button type="submit" disabled={passForm.formState.isSubmitting}
            className="btn-gradient px-6 py-2.5 rounded-xl font-semibold text-sm text-white flex items-center gap-2 disabled:opacity-50">
            {passForm.formState.isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
            Change Password
          </button>
        </form>
      </div>

      {/* Delete Account */}
      <div className="glass p-6 animate-slide-up delay-300" style={{ borderColor: "rgba(244,114,182,0.2)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(244,114,182,0.1)" }}>
            <Trash2 size={16} style={{ color: "#f472b6" }} />
          </div>
          <h2 className="font-semibold font-display">Delete Account</h2>
        </div>
        <p className="text-sm mb-4" style={{ color: "#8888aa" }}>This action cannot be undone. All data will be deleted.</p>
        {confirmDelete && (
          <p className="text-sm mb-3 font-medium" style={{ color: "#f472b6" }}>⚠️ Are you sure you want to delete your account?</p>
        )}
        <button onClick={deleteAccount} disabled={deleting}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
          style={{ background: confirmDelete ? "#f472b6" : "rgba(244,114,182,0.1)", color: confirmDelete ? "white" : "#f472b6", border: "1px solid rgba(244,114,182,0.3)" }}>
          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          {confirmDelete ? "Haan, Delete Karein" : "Account Delete Karein"}
        </button>
      </div>
    </div>
  );
}
