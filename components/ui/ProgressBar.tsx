import { cn } from '@/lib/utils';

interface ProgressBarProps {
    progress: number; // 0 to 1
    className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
    return (
        <div className={cn("h-4 w-full bg-duo-gray-face rounded-full relative overflow-hidden", className)}>
            <div
                className="absolute top-0 left-0 h-full bg-duo-green-face rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(5, progress * 100)}%` }} // Min width for visibility
            />
            {/* Highlight/Shine effect */}
            <div
                className="absolute top-1 left-2 right-2 h-[4px] bg-white/20 rounded-full"
                style={{ width: `${Math.max(0, progress * 100 - 2)}%` }}
            />
        </div>
    );
}
