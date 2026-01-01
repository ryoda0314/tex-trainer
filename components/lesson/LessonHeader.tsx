import { X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface LessonHeaderProps {
    progress: number;
    hearts: number;
    onExit: () => void;
}

export function LessonHeader({ progress, hearts, onExit }: LessonHeaderProps) {
    return (
        <div className="flex items-center gap-4 p-4 max-w-2xl mx-auto w-full">
            <Button variant="ghost" size="icon" onClick={onExit} aria-label="Quit">
                <X className="w-6 h-6 text-duo-gray-side hover:text-duo-gray-side/80" />
            </Button>

            <ProgressBar progress={progress} className="flex-1" />

            <div className="flex items-center gap-1 text-duo-red-face font-bold">
                <Heart className="w-6 h-6 fill-current" />
                <span className="text-xl">{hearts}</span>
            </div>
        </div>
    );
}
