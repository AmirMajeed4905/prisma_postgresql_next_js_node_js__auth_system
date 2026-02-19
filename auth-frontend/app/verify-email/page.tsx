"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { authApi } from "@/lib/api";
import AuthLayout from "@/components/layout/AuthLayout";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">(token ? "loading" : "idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) return;
    authApi.verifyEmail(token)
      .then(() => { setStatus("success"); setMessage("Email verify ho gaya!"); })
      .catch((err) => { setStatus("error"); setMessage(err.response?.data?.message || "Verification fail ho gaya"); });
  }, [token]);

  const resend = async () => {
    if (!email) return toast.error("Email daalein");
    setResending(true);
    try {
      await authApi.resendVerification(email);
      toast.success("Verification email dobara bhej diya gaya!");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error aa gaya");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout title="Email Verification" subtitle="Apna account verify karein">
      <div className="text-center py-4">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 size={48} className="animate-spin mx-auto" style={{ color: "#a78bfa" }} />
            <p style={{ color: "#8888aa" }}>Verify ho raha hai...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 animate-slide-up">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(52,211,153,0.1)" }}>
              <CheckCircle size={36} style={{ color: "#34d399" }} />
            </div>
            <h3 className="text-xl font-bold font-display" style={{ color: "#34d399" }}>Mubarak Ho! 🎉</h3>
            <p style={{ color: "#8888aa" }}>{message}</p>
            <button onClick={() => router.push("/login")}
              className="btn-gradient px-8 py-3 rounded-xl font-semibold text-white">
              Login Karein
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 animate-slide-up">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(244,114,182,0.1)" }}>
              <XCircle size={36} style={{ color: "#f472b6" }} />
            </div>
            <h3 className="text-xl font-bold font-display" style={{ color: "#f472b6" }}>Masla Aa Gaya</h3>
            <p style={{ color: "#8888aa" }}>{message}</p>
          </div>
        )}

        {/* Resend section */}
        {(status === "idle" || status === "error") && (
          <div className="mt-6 pt-6 border-t space-y-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2 justify-center mb-3" style={{ color: "#8888aa" }}>
              <Mail size={16} />
              <p className="text-sm">Verification email dobara bhejein:</p>
            </div>
            <input
              type="email"
              placeholder="apni_email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-glass w-full px-4 py-3 text-sm"
            />
            <button onClick={resend} disabled={resending}
              className="btn-gradient w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50">
              {resending ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
              <span>{resending ? "Bhej raha hai..." : "Dobara Bhejein"}</span>
            </button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
