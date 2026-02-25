import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { UserProvider } from "@/context/UserContext";

import { ClientOnly } from "@/components/ClientOnly";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aprende Español",
  description: "Una aplicación divertida para aprender español con juegos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <div id="app-root" className="antialiased min-h-screen" suppressHydrationWarning={true}>
          <ClientOnly>
            <LanguageProvider>
              <UserProvider>
                {children}
              </UserProvider>
            </LanguageProvider>
          </ClientOnly>
        </div>
      </body>
    </html>
  );
}
