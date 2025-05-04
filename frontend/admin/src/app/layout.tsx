import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";



export const metadata: Metadata = {
  title: "Austral Solar",
  description: "Renewable energy solutions for Sri Lanka's progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative">
          <Header />
          <div className="ml-64">
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}

