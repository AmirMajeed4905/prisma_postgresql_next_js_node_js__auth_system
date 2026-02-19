import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Auth System",
  description: "Full Stack Authentication System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#1c1c26",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f0f0ff",
            },
          }}
        />
      </body>
    </html>
  );
}