import { useState, useEffect } from 'react';
import type { QuestionCloze as QuestionClozeType } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { KatexRenderer } from '@/components/ui/KatexRenderer';
import { cn } from '@/lib/utils';
import { useLessonStore } from '@/store/useLessonStore';
import { ArrowDown } from 'lucide-react';

interface QuestionClozeUIProps {
    question: QuestionClozeType;
    filled: Record<number, string>;
    activeBlankIndex: number | null;
    isCorrect: boolean | null;
    onBlankClick: (idx: number) => void;
    onChoiceClick: (choice: string) => void;
}

export function QuestionClozeUI({ question, filled, activeBlankIndex, isCorrect, onBlankClick, onChoiceClick }: QuestionClozeUIProps) {
    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-duo-text text-left w-full">
                {question.prompt}
            </h2>

            {/* Target Model */}
            {question.model && (
                <div className="flex flex-col items-center gap-2 mb-4">
                    <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Goal</span>
                    <div className="text-3xl p-6 bg-white rounded-xl border-2 border-duo-gray-side px-10 shadow-sm min-w-[200px] text-center">
                        <KatexRenderer tex={question.model} />
                    </div>
                    <div className="text-duo-gray-side mt-2">
                        <ArrowDown size={28} />
                    </div>
                </div>
            )}

            {/* Render the equation with blanks/filled slots */}
            <div className="flex flex-wrap items-center justify-center gap-1 text-xl md:text-2xl min-h-[100px] p-6 bg-white border-2 border-duo-gray-face rounded-2xl w-full font-mono bg-gray-50/50">
                {question.segments.map((seg, i) => {
                    if (seg.type === 'static') {
                        return <span key={i} className="font-mono text-gray-700 mx-1">{seg.content}</span>;
                    } else {
                        const val = filled[i];
                        const isActive = activeBlankIndex === i;
                        return (
                            <div
                                key={i}
                                onClick={() => onBlankClick(i)}
                                className={cn(
                                    "min-w-[50px] h-[50px] md:h-[60px] border-b-4 flex items-center justify-center cursor-pointer px-2 transition-colors rounded-lg",
                                    isActive ? "border-duo-blue-side bg-duo-blue-face/10" : "border-duo-gray-side bg-duo-gray-face/20",
                                    val && "border-duo-green-side"
                                )}
                            >
                                {val ? (
                                    <code className="font-mono text-xl bg-gray-100 text-duo-green-text px-2 py-0.5 rounded">{val}</code>
                                ) : (
                                    <span className="opacity-0">_</span>
                                )}
                            </div>
                        );
                    }
                })}
            </div>

            {/* Choices */}
            <div className="grid grid-cols-4 gap-2 w-full">
                {question.choices.map((choice, idx) => (
                    <Button
                        key={idx}
                        variant="outline"
                        size="md"
                        onClick={() => onChoiceClick(choice)}
                        className="font-mono text-lg lowercase"
                        disabled={isCorrect !== null}
                    >
                        {choice}
                    </Button>
                ))}
            </div>
        </div>
    );
}

// Container Logic
interface QuestionClozeProps {
    question: QuestionClozeType;
}

export function QuestionCloze({ question }: QuestionClozeProps) {
    const { setSelection, isCorrect } = useLessonStore();

    const [filled, setFilled] = useState<Record<number, string>>({});
    const [activeBlankIndex, setActiveBlankIndex] = useState<number | null>(null);

    // Identify blank indices
    const blankSegmentIndices = question.segments
        .map((s, i) => s.type === 'blank' ? i : -1)
        .filter(i => i !== -1);

    useEffect(() => {
        setFilled({});
        setSelection(null);
        if (blankSegmentIndices.length > 0) setActiveBlankIndex(blankSegmentIndices[0]);
    }, [question, setSelection]);

    useEffect(() => {
        setSelection(Object.keys(filled).length === blankSegmentIndices.length ? filled : null);
    }, [filled, blankSegmentIndices.length, setSelection]);

    const handleChoice = (choice: string) => {
        if (isCorrect !== null) return;
        if (activeBlankIndex === null) return;

        const newFilled = { ...filled, [activeBlankIndex]: choice };
        setFilled(newFilled);

        const next = blankSegmentIndices.find(idx => !newFilled[idx] && idx !== activeBlankIndex);
        setActiveBlankIndex(next ?? activeBlankIndex);
    };

    const handleBlankClick = (idx: number) => {
        if (isCorrect !== null) return;
        setActiveBlankIndex(idx);
    };

    return (
        <QuestionClozeUI
            question={question}
            filled={filled}
            activeBlankIndex={activeBlankIndex}
            isCorrect={isCorrect}
            onBlankClick={handleBlankClick}
            onChoiceClick={handleChoice}
        />
    );
}
