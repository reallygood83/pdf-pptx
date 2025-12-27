import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "NotePPT | PDF to PPTX with AI Notes",
  description: "NotebookLM에서 생성된 PDF를 AI 발표자 노트가 포함된 PPTX로 스마트하게 변환하세요. Gemini, GPT-4o, Claude, Grok 중 선택하여 각 슬라이드에 맞춤형 발표 노트를 자동 생성합니다.",
  keywords: ["PDF to PPTX", "NotebookLM", "AI 발표자 노트", "프레젠테이션 변환", "Gemini", "GPT-4o", "Claude", "슬라이드 변환"],
  authors: [{ name: "NotePPT" }],
  creator: "NotePPT",
  publisher: "NotePPT",
  robots: "index, follow",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://noteppt.vercel.app",
    siteName: "NotePPT",
    title: "NotePPT | PDF를 AI 발표 노트가 포함된 PPTX로 변환",
    description: "NotebookLM PDF를 AI가 생성한 발표자 노트와 함께 PPTX로 변환하세요. Gemini, GPT-4o, Claude, Grok 지원.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NotePPT - AI 기반 PDF to PPTX 변환기",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "NotePPT | PDF를 AI 발표 노트가 포함된 PPTX로 변환",
    description: "NotebookLM PDF를 AI가 생성한 발표자 노트와 함께 PPTX로 변환하세요.",
    images: ["/og-image.png"],
    creator: "@noteppt",
  },

  // Additional meta
  metadataBase: new URL("https://noteppt.vercel.app"),
  alternates: {
    canonical: "/",
  },
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
