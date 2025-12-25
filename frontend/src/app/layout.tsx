import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "NotePPT | PDF to PPTX with AI Notes",
  description: "NotebookLM에서 생성된 PDF를 스마트하게 PPTX로 변환하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${spaceGrotesk.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
