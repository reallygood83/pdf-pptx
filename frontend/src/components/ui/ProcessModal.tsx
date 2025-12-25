'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, FileText, Sparkles, Layout, CheckCircle2 } from 'lucide-react';

interface ProcessModalProps {
    isOpen: boolean;
    step?: 'uploading' | 'analyzing' | 'generating' | 'completed';
}

const steps = [
    { id: 'uploading', label: 'PDF 업로드 중...', icon: FileText, color: 'text-blue-500' },
    { id: 'analyzing', label: 'AI가 내용을 분석하고 있어요 (약 30초)', icon: Sparkles, color: 'text-purple-500' },
    { id: 'generating', label: 'PPTX 슬라이드 생성 중...', icon: Layout, color: 'text-orange-500' },
];

export default function ProcessModal({ isOpen }: ProcessModalProps) {
    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);

    // Simulate progress messages since we don't have real-time progress from backend yet
    useEffect(() => {
        if (!isOpen) {
            setCurrentMsgIndex(0);
            return;
        }

        const interval = setInterval(() => {
            setCurrentMsgIndex((prev) => (prev + 1) % steps.length);
        }, 4000); // Change message every 4 seconds

        return () => clearInterval(interval);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white border-4 border-black p-8 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                    >
                        {/* Header Decoration */}
                        <div className="absolute -top-3 -right-3 bg-[#FF90E8] border-2 border-black p-2 rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <Loader2 className="animate-spin" size={24} />
                        </div>

                        <div className="text-center space-y-6">
                            <h3 className="text-3xl font-black tracking-tighter">
                                MAGIC IN PROGRESS
                            </h3>

                            {/* Animated Icon Container */}
                            <div className="relative w-24 h-24 mx-auto bg-[#F1F1F1] border-4 border-black rounded-full flex items-center justify-center overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {steps.map((step, idx) => (
                                        idx === currentMsgIndex && (
                                            <motion.div
                                                key={step.id}
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -20, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="absolute inset-0 flex items-center justify-center"
                                            >
                                                <step.icon size={40} className={step.color} />
                                            </motion.div>
                                        )
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-4 bg-gray-200 border-2 border-black rounded-full overflow-hidden relative">
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-[#A3FFAC]"
                                    initial={{ width: "0%" }}
                                    animate={{ width: ["0%", "30%", "60%", "90%"] }}
                                    transition={{ duration: 15, repeat: Infinity }}
                                />
                                <div className="absolute inset-0 bg-[url('/stripe-pattern.png')] opacity-20"></div>
                            </div>

                            {/* Dynamic Text */}
                            <div className="h-8">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={currentMsgIndex}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="font-bold text-lg"
                                    >
                                        {steps[currentMsgIndex].label}
                                    </motion.p>
                                </AnimatePresence>
                            </div>

                            <p className="text-xs font-bold text-gray-500 mt-4">
                                💡 페이지를 닫지 말고 잠시만 기다려주세요.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
