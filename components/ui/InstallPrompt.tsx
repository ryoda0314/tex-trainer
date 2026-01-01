'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Share, Plus, Smartphone } from 'lucide-react';

const INSTALL_PROMPT_KEY = 'tex-trainer-install-prompt-shown';

export function InstallPrompt() {
    const [show, setShow] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if already shown
        const alreadyShown = localStorage.getItem(INSTALL_PROMPT_KEY);

        // Check if running as standalone PWA
        const standalone = window.matchMedia('(display-mode: standalone)').matches
            || (window.navigator as any).standalone === true;
        setIsStandalone(standalone);

        // Detect iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(iOS);

        // Show prompt only if: first time, not standalone, on mobile
        if (!alreadyShown && !standalone) {
            // Slight delay for better UX
            const timer = setTimeout(() => setShow(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem(INSTALL_PROMPT_KEY, 'true');
        setShow(false);
    };

    if (!show || isStandalone) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white relative">
                    <button
                        onClick={handleDismiss}
                        className="absolute top-4 right-4 text-white/70 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                    <Smartphone size={48} className="mb-4" />
                    <h2 className="text-2xl font-bold">アプリとして使おう！</h2>
                    <p className="text-white/90 mt-2">
                        ホーム画面に追加すると、アプリのように快適に使えます
                    </p>
                </div>

                {/* Instructions */}
                <div className="p-6 space-y-4">
                    {isIOS ? (
                        // iOS instructions
                        <>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                                    1
                                </div>
                                <div>
                                    <p className="font-medium">下のメニューから</p>
                                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                                        <Share size={20} />
                                        <span>共有ボタンをタップ</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                                    2
                                </div>
                                <div>
                                    <p className="font-medium">「ホーム画面に追加」を選択</p>
                                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                                        <Plus size={20} />
                                        <span>ホーム画面に追加</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Android/Other instructions
                        <>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                                    1
                                </div>
                                <div>
                                    <p className="font-medium">ブラウザのメニューから</p>
                                    <p className="text-gray-500">︙（右上のメニュー）をタップ</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                                    2
                                </div>
                                <div>
                                    <p className="font-medium">「ホーム画面に追加」または</p>
                                    <p className="text-gray-500">「アプリをインストール」を選択</p>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="pt-4 border-t">
                        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                            ✨ オフラインでも使えるようになります！
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={handleDismiss}
                    >
                        あとで
                    </Button>
                </div>
            </div>
        </div>
    );
}
