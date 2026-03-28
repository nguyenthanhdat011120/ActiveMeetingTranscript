import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WorkFlowLoop | Meeting to Action Platform",
  description: "Automate your meeting transcription, insight extraction, and team delegation with a premium kinetic workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("dark font-sans", geist.variable)}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased selection:bg-primary/20",
          jakarta.variable,
          inter.variable,
          outfit.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col bg-background text-foreground">
          {/* Main Content Area */}
          <main id="main-content" className="flex-1 w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
