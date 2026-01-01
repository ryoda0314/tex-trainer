'use client';

import { Button } from "@/components/ui/Button";
import { HeartCrack, RefreshCw, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProgressStore } from "@/store/useProgressStore";

interface GameOverScreenProps {
    onRetry?: () => void;
}

export function GameOverScreen({ onRetry }: GameOverScreenProps) {
    const router = useRouter();
    const { refillHearts, hearts, maxHearts } = useProgressStore();

    const handleRefill = () => {
        refillHearts();
        if (onRetry) onRetry();
    };

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-6 max-w-md w-full text-center">
                <HeartCrack size={80} className="text-duo-gray-side animate-pulse" />

                <h2 className="text-3xl font-bold text-gray-800">
                    Out of hearts!
                </h2>
                <p className="text-lg text-gray-500">
                    You made too many mistakes. Refill your hearts to continue learning.
                </p>

                <div className="w-full space-y-4 mt-8">
                    <Button
                        variant="primary"
                        fullWidth
                        size="lg"
                        onClick={handleRefill}
                        className="bg-duo-blue-face border-duo-blue-side hover:bg-duo-blue-face/90"
                    >
                        <RefreshCw className="mr-2" size={20} />
                        Refill & Continue
                    </Button>

                    <Button
                        variant="danger"
                        fullWidth
                        size="lg"
                        onClick={() => router.push('/')}
                    >
                        <LogOut className="mr-2" size={20} />
                        Quit Lesson
                    </Button>
                </div>
            </div>
        </div>
    );
}
