'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Presentation, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ProcessModal from '@/components/ui/ProcessModal';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Form state
    const [file, setFile] = useState<File | null>(null);
    const [provider, setProvider] = useState('gemini');
    const [apiKey, setApiKey] = useState('');
    const [status, setStatus] = useState<'idle' | 'uploading' | 'converting' | 'completed' | 'error'>('idle');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [removeWatermark, setRemoveWatermark] = useState(true);
    const [generateNotes, setGenerateNotes] = useState(true);
    const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser && !loading) {
                router.push('/');
            }
            setUser(currentUser);
            setLoading(false);

            if (currentUser) {
                // Fetch saved keys status
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/get-keys`, {
                        headers: { 'uid': currentUser.uid }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setSavedKeys(data);
                    }
                } catch (e) {
                    console.error("Failed to fetch keys", e);
                }
            }
        });
        return () => unsubscribe();
    }, [loading, router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F1F1F1]">
            <Loader2 className="animate-spin" size={48} />
        </div>
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSaveKey = async () => {
        if (!user || !apiKey) return;
        setIsSaving(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/save-keys`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'uid': user.uid
                },
                body: JSON.stringify({
                    provider: provider,
                    api_key: apiKey
                })
            });
            if (res.ok) {
                setSavedKeys(prev => ({ ...prev, [provider]: true }));
                setApiKey('');
                alert(`${provider} 키가 암호화되어 안전하게 저장되었습니다.`);
            }
        } catch (e) {
            alert("키 저장 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleConvert = async () => {
        if (!file || !user) return;

        setStatus('converting');
        setErrorMessage('');

        const formData = new FormData();
        formData.append('pdf_file', file);
        formData.append('provider', provider);
        formData.append('remove_watermark', String(removeWatermark));
        formData.append('generate_notes', String(generateNotes));
        if (apiKey) formData.append('api_key', apiKey);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/convert`, {
                method: 'POST',
                headers: {
                    'uid': user.uid
                },
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `converted_${new Date().getTime()}.pptx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                setStatus('completed');
            } else {
                let msg = '변환에 실패했습니다.';
                try {
                    const errorData = await response.json();
                    msg = errorData.detail || errorData.error || msg;
                } catch (e) {
                    msg = await response.text();
                }
                throw new Error(msg);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(error instanceof Error ? error.message : '변환에 실패했습니다.');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F1F1] text-black pb-20">
            {/* Mini Nav */}
            <nav className="border-b-4 border-black bg-white p-4 mb-10">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 font-black text-xl hover:text-[#FF90E8] transition-colors">
                        <Presentation /> NotePPT Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        {user?.photoURL && (
                            <img
                                src={user.photoURL}
                                alt={user.displayName || "User profile"}
                                className="w-8 h-8 rounded-full border-2 border-black"
                            />
                        )}
                        <span className="font-bold hidden sm:block">{user?.displayName}</span>
                        <Button variant="secondary" size="sm" onClick={handleLogout}>
                            Log Out
                        </Button>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4">
                <header className="mb-10">
                    <h2 className="text-4xl font-black tracking-tight mb-2">무엇을 변환할까요?</h2>
                    <p className="font-bold text-gray-600">NotebookLM에서 받은 PDF를 업로드하고 AI 설정을 선택하세요.</p>
                </header>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Section 1: Upload */}
                    <Card className="md:col-span-2">
                        <h3 className="font-black text-xl mb-4 flex items-center gap-2">
                            <Upload size={20} /> 1. PDF 파일 업로드
                        </h3>

                        <div
                            className={`border-4 border-dashed border-black p-10 text-center transition-colors
                  ${file ? 'bg-[#A3FFAC]' : 'bg-gray-50'}`}
                        >
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="pdf-upload"
                            />
                            <label htmlFor="pdf-upload" className="cursor-pointer">
                                {file ? (
                                    <div className="flex flex-col items-center">
                                        <CheckCircle2 size={48} className="mb-2" />
                                        <span className="font-black text-lg">{file.name}</span>
                                        <span className="text-sm font-bold">변경하려면 클릭하세요</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Upload size={48} className="mb-2 text-gray-400" />
                                        <span className="font-black text-lg">파일을 선택하거나 여기로 드래그하세요</span>
                                        <span className="text-sm font-bold text-gray-500">Only PDF up to 20MB</span>
                                    </div>
                                )}
                            </label>
                        </div>

                        {status === 'completed' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-6 bg-[#A3FFAC] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <h4 className="font-black text-xl mb-2 flex items-center gap-2">
                                    <CheckCircle2 /> 변환 완료!
                                </h4>
                                <p className="font-bold mb-4">파일이 자동으로 다운로드되었습니다.<br />(다운로드 폴더를 확인해주세요)</p>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <div className="mt-6 p-4 bg-[#FF90E8] border-4 border-black">
                                <h4 className="font-black flex items-center gap-2"><AlertCircle /> 오류 발생</h4>
                                <p className="font-bold">{errorMessage}</p>
                            </div>
                        )}
                    </Card>

                    {/* Section 2: Settings */}
                    <div className="flex flex-col gap-6">
                        <Card variant="yellow">
                            <h3 className="font-black text-lg mb-4">2. AI 분석 설정</h3>

                            <div className="mb-4">
                                <label className="block font-black text-sm mb-1">AI 프로바이더</label>
                                <select
                                    value={provider}
                                    onChange={(e) => setProvider(e.target.value)}
                                    className="w-full border-2 border-black p-2 font-bold focus:outline-none focus:bg-[#A3FFAC]"
                                >
                                    <option value="gemini">Google Gemini</option>
                                    <option value="openai">OpenAI GPT</option>
                                    <option value="anthropic">Anthropic Claude</option>
                                    <option value="grok">xAI Grok</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block font-black text-sm mb-1 flex justify-between">
                                    API 키 입력 (선택)
                                    {savedKeys[provider] && (
                                        <span className="text-[10px] text-green-600 flex items-center gap-1">
                                            <CheckCircle2 size={10} /> 저장됨
                                        </span>
                                    )}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        placeholder="sk-..."
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        className="flex-1 border-2 border-black p-2 font-bold focus:outline-none text-sm"
                                    />
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={handleSaveKey}
                                        disabled={!apiKey || isSaving}
                                    >
                                        {isSaving ? '...' : '저장'}
                                    </Button>
                                </div>
                                <p className="text-[10px] font-bold mt-1 text-gray-600">
                                    키를 저장하면 다음 번에는 입력하지 않아도 됩니다. (AES-256 암호화 저장)
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 mb-6">
                                <label className="flex items-center gap-2 font-bold cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={removeWatermark}
                                        onChange={(e) => setRemoveWatermark(e.target.checked)}
                                        className="w-4 h-4 accent-black"
                                    />
                                    워터마크 자동 제거
                                </label>
                                <label className="flex items-center gap-2 font-bold cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={generateNotes}
                                        onChange={(e) => setGenerateNotes(e.target.checked)}
                                        className="w-4 h-4 accent-black"
                                    />
                                    AI 스피커 노트 생성
                                </label>
                            </div>

                            <Button
                                className="w-full mt-4"
                                onClick={handleConvert}
                                disabled={!file || status === 'converting'}
                            >
                                {status === 'converting' ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin" size={18} /> 변환 중...
                                    </span>
                                ) : '🎬 변환 시작하기'}
                            </Button>
                        </Card>

                        <Card variant="pink">
                            <h4 className="font-black text-sm mb-2">💡 Tip</h4>
                            <p className="text-xs font-bold leading-relaxed">
                                변환된 파일은 파워포인트에서 직접 텍스트를 수정할 수 있습니다.
                                AI가 작성한 스피커 노트는 슬라이드 하단 영역에서 확인하세요.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>

            <ProcessModal isOpen={status === 'converting'} />
        </div>
    );
}
