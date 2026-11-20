import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/language/LanguageProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sarjomexam.in"),
  title: {
    default: "SARJOM EXAM | PYQ Practice, Syllabus & Mock Tests",
    template: "%s | SARJOM EXAM",
  },
  description: "Competitive exam preparation, previous year questions, and syllabus practice platform.",
  openGraph: {
    type: "website",
    url: "https://www.sarjomexam.in",
    siteName: "SARJOM EXAM",
    title: "SARJOM EXAM | PYQ Practice, Syllabus & Mock Tests",
    description: "Competitive exam preparation, previous year questions, and syllabus practice platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LanguageProvider>
            <Header />
            {children}
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}