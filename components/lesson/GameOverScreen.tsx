'use client';

import { Button } from "@/components/ui/Button";
import { HeartCrack, LogOut, Clock, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProgressStore } from "@/store/useProgressStore";
import { HeartTimer } from "@/components/ui/HeartTimer";
import { useEffect, useState } from "react";

interface GameOverScreenProps {
    onRetry?: () => void;
}

export function GameOverScreen({ onRetry }: GameOverScreenProps) {
    const router = useRouter();
    const { hearts, checkHeartRegen, shareForHeart, getShareHeartsRemaining } = useProgressStore();
    const [shareRemaining, setShareRemaining] = useState(getShareHeartsRemaining());

    // Check for heart regeneration periodically
    useEffect(() => {
        const interval = setInterval(() => {
            checkHeartRegen();
            setShareRemaining(getShareHeartsRemaining());
        }, 1000);
        return () => clearInterval(interval);
    }, [checkHeartRegen, getShareHeartsRemaining]);

    // Auto-dismiss when hearts are back
    useEffect(() => {
        if (hearts > 0 && onRetry) {
            onRetry();
        }
    }, [hearts, onRetry]);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'TeX Trainer',
                    text: 'LaTeX記法を楽しく学べるアプリで勉強中！',
                    url: window.location.origin
                });

                // Grant heart after successful share
                const result = shareForHeart();
                setShareRemaining(result.remaining);
            } else {
                // Fallback: copy link
                await navigator.clipboard.writeText(window.location.origin);
                const result = shareForHeart();
                setShareRemaining(result.remaining);
                alert('リンクをコピーしました！ハートを1つゲット！');
            }
        } catch (err) {
            // User cancelled share - don't grant heart
            console.log('Share cancelled');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-6 max-w-md w-full text-center">
                <HeartCrack size={80} className="text-duo-gray-side animate-pulse" />

                <h2 className="text-3xl font-bold text-gray-800">
                    Out of hearts!
                </h2>
                <p className="text-lg text-gray-500">
                    ハートがなくなりました。時間が経つと回復します。
                </p>

                <div className="bg-red-50 p-6 rounded-xl border border-red-200 flex flex-col items-center gap-2">
                    <Clock size={24} className="text-red-500" />
                    <HeartTimer />
                    <span className="text-sm text-gray-500">5分ごとに1ハート回復</span>
                </div>

                <div className="w-full space-y-4 mt-4">
                    {shareRemaining > 0 && (
                        <Button
                            variant="primary"
                            fullWidth
                            size="lg"
                            onClick={handleShare}
                            className="bg-blue-500 border-blue-600 hover:bg-blue-600"
                        >
                            <Share2 className="mr-2" size={20} />
                            シェアして❤️ゲット（残り{shareRemaining}回）
                        </Button>
                    )}

                    <Button
                        variant="danger"
                        fullWidth
                        size="lg"
                        onClick={() => router.push('/')}
                    >
                        <LogOut className="mr-2" size={20} />
                        ホームに戻る
                    </Button>
                </div>
            </div>
        </div>
    );
}
