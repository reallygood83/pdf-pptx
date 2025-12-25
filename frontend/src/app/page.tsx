'use client';

import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Presentation, FileText, Layout, Zap, Github, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <main className="min-h-screen bg-[#F1F1F1] text-black selection:bg-[#A3FFAC]">
      {/* Navigation */}
      <nav className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-[#FFD046] border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Presentation size={24} />
            </div>
            <span className="font-black text-2xl tracking-tighter">NotePPT</span>
          </div>

          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="font-bold hidden sm:block">{user.displayName}님 환영합니다!</span>
                <Button variant="secondary" size="sm" onClick={handleLogout}>Log Out</Button>
              </div>
            ) : (
              <Button onClick={handleLogin}>Get Started</Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl sm:text-8xl font-black leading-none tracking-tighter mb-8">
              PDF TO <span className="bg-[#A3FFAC] border-4 border-black px-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">PPTX</span> <br />
              WITH <span className="text-[#FF90E8]">AI NOTES</span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold mb-10 max-w-lg leading-relaxed">
              NotebookLM에서 생성된 PDF를 단 몇 초 만에 편집 가능한 파워포인트로 변환하세요. AI가 당신을 위한 발표 대본까지 완벽하게 작성해줍니다.
            </p>
            <div className="flex flex-wrap gap-4">
              {user ? (
                <Link href="/dashboard">
                  <Button variant="primary" size="lg" className="flex items-center gap-2">
                    <Zap fill="black" /> Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Button variant="primary" size="lg" onClick={handleLogin}>Start for Free</Button>
              )}
              <Button variant="secondary" size="lg" className="flex items-center gap-2">
                Watch Demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <Card variant="yellow" className="relative z-10">
              <div className="aspect-video bg-white border-2 border-black flex items-center justify-center overflow-hidden">
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-[#FF90E8] border-2 border-black rotate-3 mx-auto mb-4 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Layout size={40} />
                  </div>
                  <h3 className="font-black text-2xl mb-2 underline decoration-4 decoration-[#A3FFAC]">Smart Conversion</h3>
                  <p className="font-bold">Drop your PDF here and watch the magic happen.</p>
                </div>
              </div>
            </Card>
            <div className="absolute top-4 left-4 w-full h-full bg-black -z-10 border-4 border-black"></div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y-4 border-black py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <Card variant="green">
            <Zap className="mb-4" size={32} />
            <h3 className="font-black text-2xl mb-2">Fast & Easy</h3>
            <p className="font-bold">Poppler 없이도 즉시 작동하는 새로운 엔진으로 속도를 극한까지 높였습니다.</p>
          </Card>
          <Card variant="pink">
            <FileText className="mb-4" size={32} />
            <h3 className="font-black text-2xl mb-2">AI Speaker Notes</h3>
            <p className="font-bold">최신 비전 AI가 슬라이드별 완벽한 발표 대본을 작성합니다.</p>
          </Card>
          <Card variant="yellow">
            <Layout className="mb-4" size={32} />
            <h3 className="font-black text-2xl mb-2">Editable PPTX</h3>
            <p className="font-bold">단순 이미지가 아닙니다. 텍스트와 레이아웃을 마음껏 수정할 수 있는 PPTX를 제공합니다.</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t-4 border-black mt-20 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <span className="font-black text-3xl tracking-tighter">NotePPT</span>
            <p className="font-bold mt-2">Create by 배움의 달인</p>
          </div>
          <div className="flex gap-6">
            <a href="https://youtube.com/@%EB%B0%B0%EC%9B%80%EC%9D%98%EB%8B%AC%EC%9D%B8-p5v" target="_blank" className="hover:scale-110 transition-transform">
              <Youtube size={32} />
            </a>
            <a href="https://x.com/reallygood83" target="_blank" className="hover:scale-110 transition-transform">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black rounded-sm border-2 border-black">𝕏</div>
            </a>
            <a href="https://github.com/reallygood83/lm-to-pptx" target="_blank" className="hover:scale-110 transition-transform">
              <Github size={32} />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
