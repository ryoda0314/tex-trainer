'use client';

import { Button } from "@/components/ui/Button";
import { HeartCrack, LogOut, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProgressStore } from "@/store/useProgressStore";
import { HeartTimer } from "@/components/ui/HeartTimer";
import { useEffect } from "react";

interface GameOverScreenProps {
    onRetry?: () => void;
}

export function GameOverScreen({ onRetry }: GameOverScreenProps) {
    const router = useRouter();
    const { hearts, checkHeartRegen } = useProgressStore();

    // Check for heart regeneration periodically
    useEffect(() => {
        const interval = setInterval(() => {
            checkHeartRegen();
        }, 1000);
        return () => clearInterval(interval);
    }, [checkHeartRegen]);

    // Auto-dismiss when hearts are back
    useEffect(() => {
        if (hearts > 0 && onRetry) {
            onRetry();
        }
    }, [hearts, onRetry]);

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
