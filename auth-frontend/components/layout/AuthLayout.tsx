"use client";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  bottomText?: string;
  bottomLink?: string;
  bottomLinkText?: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  bottomText,
  bottomLink,
  bottomLinkText,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Mesh background */}
      <div className="mesh-bg">
        <div className="mesh-orb w-96 h-96 top-0 left-0 opacity-20" style={{ background: "radial-gradient(circle, #f472b6, transparent 70%)" }} />
        <div className="mesh-orb w-80 h-80 bottom-0 right-0 opacity-15" style={{ background: "radial-gradient(circle, #a78bfa, transparent 70%)" }} />
        <div className="mesh-orb w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)" }} />
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
      }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 btn-gradient">
            <span className="text-2xl relative z-10">🔐</span>
          </div>
          <h1 className="text-3xl font-bold font-display gradient-text mb-2">{title}</h1>
          <p style={{ color: "#8888aa" }} className="text-sm">{subtitle}</p>
        </div>

        {/* Card */}
        <div className="glass p-8 animate-slide-up delay-100">
          {children}
        </div>

        {/* Bottom link */}
        {bottomText && bottomLink && (
          <p className="text-center mt-6 text-sm animate-slide-up delay-200" style={{ color: "#8888aa" }}>
            {bottomText}{" "}
            <Link href={bottomLink} className="font-medium hover:underline transition-all" style={{ color: "#a78bfa" }}>
              {bottomLinkText}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
