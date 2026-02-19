"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Loader2, Check } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import { authApi } from "@/lib/api";

const schema = z.object({
  password: z
    .string()
    .min(8, "8 characters minimum")
    .regex(/[A-Z]/, "Capital letter chahiye")
    .regex(/[0-9]/, "Number chahiye")
    .regex(/[^A-Za-z0-9]/, "Special character chahiye"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords match nahi kar rahe", path: ["confirm"] });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [showPass, setShowPass] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password", "");
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Capital letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
    { label: "Special character", ok: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = async (data: FormData) => {
    if (!token) return toast.error("Reset token nahi mila");
    try {
      await authApi.resetPassword(token, data.password);
      toast.success("Password reset ho gaya! 🎉");
      router.push("/login");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Reset fail ho gaya");
    }
  };

  return (
    <AuthLayout
      title="Naya Password"
      subtitle="Apna naya password set karein"
      bottomText="Yaad aa gaya?"
      bottomLink="/login"
      bottomLinkText="Login karein"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* New Password */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#ccccee" }}>Naya Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              className="input-glass w-full px-4 py-3 text-sm pr-12"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#8888aa" }}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {password && (
            <div className="mt-2 grid grid-cols-2 gap-1">
              {checks.map((c) => (
                <div key={c.label} className="flex items-center gap-1">
                  <Check size={12} style={{ color: c.ok ? "#34d399" : "#555577" }} />
                  <span className="text-xs" style={{ color: c.ok ? "#34d399" : "#555577" }}>{c.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirm */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#ccccee" }}>Confirm Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#8888aa" }} />
            <input
              {...register("confirm")}
              type="password"
              placeholder="••••••••"
              className="input-glass w-full pl-10 pr-4 py-3 text-sm"
            />
          </div>
          {errors.confirm && <p className="mt-1 text-xs" style={{ color: "#f472b6" }}>{errors.confirm.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting || !token}
          className="btn-gradient w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50">
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
          <span>{isSubmitting ? "Reset ho raha hai..." : "Password Reset Karein"}</span>
        </button>

        {!token && (
          <p className="text-xs text-center" style={{ color: "#f472b6" }}>
            ⚠️ Token nahi mila. Forgot password se dobara try karein.
          </p>
        )}
      </form>
    </AuthLayout>
  );
}
