'use client';

import { useEffect, useState } from 'react';
import { useProgressStore, HEART_REGEN_INTERVAL } from '@/store/useProgressStore';
import { Clock } from 'lucide-react';

export function HeartTimer() {
    const { hearts, maxHearts, getTimeUntilNextHeart, checkHeartRegen } = useProgressStore();
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        // Check for regeneration on mount and periodically
        checkHeartRegen();

        const interval = setInterval(() => {
            checkHeartRegen();
            const remaining = getTimeUntilNextHeart();
            setTimeLeft(remaining);
        }, 1000);

        return () => clearInterval(interval);
    }, [checkHeartRegen, getTimeUntilNextHeart]);

    // Don't show if hearts are full
    if (hearts >= maxHearts) return null;
    if (timeLeft === null) return null;

    // Format time as mm:ss
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return (
        <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={12} />
            <span>次のハートまで {formatted}</span>
        </div>
    );
}
