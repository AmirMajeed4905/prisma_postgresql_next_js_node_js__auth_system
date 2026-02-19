"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().email("Enter Valid Email "),
  password: z.string().min(1, "Enter Password"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const user = await login(data.email, data.password);
      toast.success(`wellcome, ${user.name}! 🎉`);
      router.push(user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || " Login failed ";
      toast.error(msg);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Login to your account"
      bottomText="Have no account?"
      bottomLink="/register"
      bottomLinkText="Register now" 
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#ccccee" }}>Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="ali@example.com"
            className="input-glass w-full px-4 py-3 text-sm"
          />
          {errors.email && <p className="mt-1 text-xs" style={{ color: "#f472b6" }}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: "#ccccee" }}>Password</label>
            <a href="/forgot-password" className="text-xs hover:underline" style={{ color: "#a78bfa" }}>Forgotton ?</a>
          </div>
          <div className="relative">
            <input
              {...register("password")}
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              className="input-glass w-full px-4 py-3 text-sm pr-12"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "#8888aa" }}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs" style={{ color: "#f472b6" }}>{errors.password.message}</p>}
        </div>

        {/* Submit */}
        <button type="submit" disabled={isSubmitting}
          className="btn-gradient w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
          <span>{isSubmitting ? "Logging in..." : "Login"}</span>
        </button>

        {/* Demo accounts */}
        <div className="pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-xs text-center mb-3" style={{ color: "#8888aa" }}>Test accounts:</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "👑 Admin", email: "admin@test.com", pass: "Admin@123" },
              { label: "👤 User", email: "user@test.com", pass: "User@123" },
            ].map((acc) => (
              <button key={acc.email} type="button"
                onClick={() => {
                  const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
                  const passInput = document.querySelector('input[type="password"], input[type="text"]') as HTMLInputElement;
                  if (emailInput) emailInput.value = acc.email;
                  if (passInput) passInput.value = acc.pass;
                }}
                className="py-2 px-3 rounded-lg text-xs font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ccccee" }}>
                {acc.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
