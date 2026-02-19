"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, UserPlus, Loader2, Check } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import { authApi } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2, "Name should be at least 2 characters"),
  email: z.string().email("Enter Valid Email "),
  password: z
    .string()
    .min(8, "8 characters minimum")
    .regex(/[A-Z]/, "atleast one capital letter should be there")
    .regex(/[0-9]/, "atleast one number should be there")
    .regex(/[^A-Za-z0-9]/, "atleast one special character should be there"),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "USER" },
  });

  const password = watch("password", "");
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Capital letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
    { label: "Special character", ok: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = async (data: FormData) => {
    try {
      await authApi.register(data);
      toast.success("Account created successfully!check your email for verification link.");
      router.push("/login");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Registration failed";
      toast.error(msg);
    }
  };

  return (
    <AuthLayout
      title="make a new account"
      subtitle="Register your new account"
      bottomText="already have account?"
      bottomLink="/login"
      bottomLinkText="Login now"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#ccccee" }}>Naam</label>
          <input {...register("name")} placeholder="Enter your name" className="input-glass w-full px-4 py-3 text-sm" />
          {errors.name && <p className="mt-1 text-xs" style={{ color: "#f472b6" }}>{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#ccccee" }}>Email</label>
          <input {...register("email")} type="email" placeholder="example@example.com" className="input-glass w-full px-4 py-3 text-sm" />
          {errors.email && <p className="mt-1 text-xs" style={{ color: "#f472b6" }}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#ccccee" }}>Password</label>
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
          {/* Password strength */}
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

        {/* Role */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#ccccee" }}>Role</label>
          <div className="grid grid-cols-2 gap-2">
            {(["USER", "ADMIN"] as const).map((r) => (
              <label key={r} className="relative cursor-pointer">
                <input {...register("role")} type="radio" value={r} className="sr-only peer" />
                <div className="py-2.5 px-4 rounded-xl text-sm font-medium text-center transition-all peer-checked:border-purple-400"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#8888aa",
                  }}>
                  {r === "USER" ? "👤 User" : "👑 Admin"}
                </div>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}
          className="btn-gradient w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
          <span>{isSubmitting ? "Register ho raha hai..." : "Register Karein"}</span>
        </button>
      </form>
    </AuthLayout>
  );
}
