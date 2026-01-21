import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HEMOPE - Sistema de Chamados",
  description: "Sistema de abertura de chamados técnicos do HEMOPE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen relative overflow-x-hidden selection:bg-red-500/30 selection:text-red-900`}>
        {/* Animated Background */}
        <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#8B0000] via-[#D32F2F] to-white animate-gradient-slow" />
        
        {/* Floating Decorative Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-red-600/30 blur-[100px] animate-float-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-white/40 blur-[120px] animate-float-delayed" />
          <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-red-400/20 blur-[80px] animate-pulse-slow" />
        </div>

        {children}
      </body>
    </html>
  );
}
