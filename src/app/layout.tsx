import type { Metadata, Viewport } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VM. | Finance",
  description: "Controle financeiro pessoal autoral",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VM Finance",
  },
};

export const viewport: Viewport = {
  themeColor: "#D81176",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${anton.variable} font-sans antialiased selection:bg-primary selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
