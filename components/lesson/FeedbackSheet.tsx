import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { KatexRenderer } from '../ui/KatexRenderer';

interface FeedbackSheetProps {
    status: 'correct' | 'incorrect' | null;
    message?: string;
    onContinue: () => void;
}

export function FeedbackSheet({ status, message, onContinue }: FeedbackSheetProps) {
    if (!status) return null;

    const isCorrect = status === 'correct';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className={cn(
                    "fixed bottom-0 left-0 right-0 p-4 pb-8 border-t-2 z-50",
                    isCorrect ? "bg-duo-green-side/10 border-transparent" : "bg-duo-red-face/10 border-transparent"
                )}
            >
                <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-4 justify-between">

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center shrink-0 bg-white",
                            isCorrect ? "text-duo-green-face" : "text-duo-red-face"
                        )}>
                            {isCorrect ? <Check size={40} strokeWidth={4} /> : <X size={40} strokeWidth={4} />}
                        </div>

                        <div className="flex flex-col">
                            <h2 className={cn("text-2xl font-bold", isCorrect ? "text-duo-green-face" : "text-duo-red-face")}>
                                {isCorrect ? 'Nicely done!' : 'Correct solution:'}
                            </h2>
                            {!isCorrect && message && (
                                <div className="text-duo-red-side font-medium">
                                    {/* Reuse Katex if message contains math, simpler for now just text */}
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>

                    <Button
                        variant={isCorrect ? 'correct' : 'danger'}
                        className="w-full md:w-auto min-w-[150px]"
                        onClick={onContinue}
                    >
                        CONTINUE
                    </Button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
