import { useState, useEffect } from 'react';
import type { QuestionArrange as QuestionArrangeType } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { useLessonStore } from '@/store/useLessonStore';
import { cn } from '@/lib/utils';
import { KatexRenderer } from '@/components/ui/KatexRenderer';
import { ArrowDown } from 'lucide-react';

// UI
export interface QuestionArrangeUIProps {
    question: QuestionArrangeType;
    solutionTiles: QuestionArrangeType['initialTiles'];
    bankTiles: QuestionArrangeType['initialTiles'];
    isCorrect: boolean | null;
    onToggleTile: (tile: QuestionArrangeType['initialTiles'][0], from: 'bank' | 'solution') => void;
}

export function QuestionArrangeUI({ question, solutionTiles, bankTiles, isCorrect, onToggleTile }: QuestionArrangeUIProps) {
    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-duo-text text-left w-full">
                {question.prompt}
            </h2>

            {/* Target Model */}
            <div className="flex flex-col items-center gap-2 mb-4">
                <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Goal</span>
                <div className="text-3xl p-6 bg-white rounded-xl border-2 border-duo-gray-side px-10 shadow-sm min-w-[200px] text-center">
                    <KatexRenderer tex={question.correctSequence.join('')} />
                </div>
                <div className="text-duo-gray-side mt-2">
                    <ArrowDown size={28} />
                </div>
            </div>

            {/* Solution Line - Acts as display */}
            <div className="w-full min-h-[80px] border-b-2 border-duo-gray-face flex flex-wrap items-center gap-2 p-2">
                {solutionTiles.map(tile => (
                    <Button
                        key={tile.id}
                        variant="outline"
                        size="sm"
                        className="text-lg lowercase px-3 py-1 bg-white shadow-sm"
                        onClick={() => onToggleTile(tile, 'solution')}
                        disabled={isCorrect !== null}
                    >
                        {tile.content}
                    </Button>
                ))}
            </div>

            {/* Bank */}
            <div className="flex flex-wrap justify-center gap-2 w-full">
                {bankTiles.map(tile => (
                    <Button
                        key={tile.id}
                        variant="outline"
                        size="sm"
                        className="text-lg lowercase px-3 py-1"
                        onClick={() => onToggleTile(tile, 'bank')}
                        disabled={isCorrect !== null}
                    >
                        {tile.content}
                    </Button>
                ))}
            </div>
        </div>
    );
}

// Logic
interface QuestionArrangeProps {
    question: QuestionArrangeType;
}

export function QuestionArrange({ question }: QuestionArrangeProps) {
    const { setSelection, isCorrect } = useLessonStore();

    // State: Tiles in "Solution Line" and "Bank"
    // Each tile needs unique ID.
    const [solutionTiles, setSolutionTiles] = useState<typeof question.initialTiles>([]);
    // Bank initially has all tiles + distractors
    const [bankTiles, setBankTiles] = useState<typeof question.initialTiles>([]);

    useEffect(() => {
        // Reset on new question
        const all = [...question.initialTiles, ...(question.distractors || [])];
        setBankTiles(all.sort(() => Math.random() - 0.5));
        setSolutionTiles([]);
    }, [question]);

    useEffect(() => {
        // Report answer to store
        const currentSeq = solutionTiles.map(t => t.content);
        setSelection(currentSeq.length > 0 ? currentSeq : null);
    }, [solutionTiles, setSelection]);

    const toggleTile = (tile: typeof question.initialTiles[0], from: 'bank' | 'solution') => {
        if (isCorrect !== null) return; // Locked

        if (from === 'bank') {
            setBankTiles(prev => prev.filter(t => t.id !== tile.id));
            setSolutionTiles(prev => [...prev, tile]);
        } else {
            setSolutionTiles(prev => prev.filter(t => t.id !== tile.id));
            setBankTiles(prev => [...prev, tile]);
        }
    };

    return (
        <QuestionArrangeUI
            question={question}
            solutionTiles={solutionTiles}
            bankTiles={bankTiles}
            isCorrect={isCorrect}
            onToggleTile={toggleTile}
        />
    );
}
