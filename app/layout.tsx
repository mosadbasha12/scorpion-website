import type { Metadata } from "next";
import "./globals.css";
import "./dark-overrides.css";
import "./premium-overrides.css";
import "./motion-overrides.css";

export const metadata: Metadata = {
  title: "SCORPION — Digital systems & creative studio",
  description: "SCORPION builds digital systems, brand experiences and bold creative solutions for ambitious businesses."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
