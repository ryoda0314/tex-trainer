'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useProgressStore } from '@/store/useProgressStore';
import { useEffect } from 'react';
import { CircleCheck, Zap } from 'lucide-react';

export default function ResultPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const score = parseFloat(searchParams.get('score') || '0');
    const { addXp, updateStreak, xp, streak } = useProgressStore();

    useEffect(() => {
        // Award XP on mount (once)
        // Ideally prevent double counting via strict mode or logic.
        // For MVP simple:
        addXp(15);
        updateStreak();
    }, []); // Run once

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white gap-8 text-center">
            <div className="animate-in zoom-in duration-500">
                <div className="w-32 h-32 rounded-full bg-duo-green-side/20 flex items-center justify-center mb-6 mx-auto">
                    <CircleCheck className="w-20 h-20 text-duo-green-face" />
                </div>
                <h1 className="text-4xl font-bold text-duo-green-face mb-2">Lesson Complete!</h1>
                <p className="text-duo-gray-side text-xl">Good job cleaning up that math.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className="bg-duo-yellow-face/10 border-2 border-duo-yellow-side rounded-2xl p-4 flex flex-col items-center">
                    <span className="text-sm font-bold text-duo-yellow-side uppercase">Total XP</span>
                    <span className="text-3xl font-black text-duo-yellow-face">{xp}</span>
                </div>
                <div className="bg-duo-red-face/10 border-2 border-duo-red-side rounded-2xl p-4 flex flex-col items-center">
                    <span className="text-sm font-bold text-duo-red-side uppercase">Streak</span>
                    <div className="flex items-center gap-1">
                        <Zap className="fill-current text-duo-red-face" />
                        <span className="text-3xl font-black text-duo-red-face">{streak}</span>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-sm mt-8">
                <Button variant="primary" fullWidth size="lg" onClick={() => router.push('/')}>
                    CONTINUE
                </Button>
            </div>
        </div>
    );
}
