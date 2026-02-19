"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Loader2, ArrowLeft, Send } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import { authApi } from "@/lib/api";
import Link from "next/link";

const schema = z.object({ email: z.string().email("Valid email daalein") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await authApi.forgotPassword(data.email);
      setSent(true);
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error");
    }
  };

  return (
    <AuthLayout
      title="forgotton password?"
      subtitle="Enter your registered email to get reset link"
      bottomText="remember?"
      bottomLink="/login"
      bottomLinkText="Login"
    >
      {!sent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#ccccee" }}>Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#8888aa" }} />
              <input
                {...register("email")}
                type="email"
                placeholder="apni_email@gmail.com"
                className="input-glass w-full pl-10 pr-4 py-3 text-sm"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs" style={{ color: "#f472b6" }}>{errors.email.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting}
            className="btn-gradient w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            <span>{isSubmitting ? "Bhej raha hai..." : "Reset Link Bhejein"}</span>
          </button>
        </form>
      ) : (
        <div className="text-center py-4 space-y-4 animate-slide-up">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto btn-gradient">
            <Mail size={28} className="text-white relative z-10" />
          </div>
          <h3 className="text-lg font-bold font-display gradient-text">Check your Email ! 📧</h3>
          <p className="text-sm" style={{ color: "#8888aa" }}>
          if mail sent successfully then you will receive a password reset link in your email inbox.
          </p>
         
          <p className="text-xs" style={{ color: "#555577" }}>
            check spam folder if you don't see the email in inbox. Link will expire in 15 minutes. If you didn't receive the email, you can try again.
          </p>
          <Link href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            style={{ color: "#a78bfa" }}>
            <ArrowLeft size={14} /> Login page
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
