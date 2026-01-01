'use client';

import { useState, useEffect } from 'react';
import type { QuestionMatch as QuestionMatchType } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { KatexRenderer } from '@/components/ui/KatexRenderer';
import { cn } from '@/lib/utils';
import { useLessonStore } from '@/store/useLessonStore';

type Card = { id: string; content: string; type: 'tex' | 'code'; matchId: string };

interface QuestionMatchUIProps {
    question: QuestionMatchType;
    leftCards: Card[];
    rightCards: Card[];
    matchedIds: Set<string>;
    selectedId: string | null;
    errorIds: Set<string>;
    successIds: Set<string>;
    isCorrect: boolean | null;
    onCardClick: (id: string, matchId: string) => void;
}

export function QuestionMatchUI({ question, leftCards, rightCards, matchedIds, selectedId, errorIds, successIds, isCorrect, onCardClick }: QuestionMatchUIProps) {
    const renderCard = (card: Card) => {
        const isMatched = matchedIds.has(card.id);
        const isSelected = selectedId === card.id;
        const isError = errorIds.has(card.id);
        const isSuccess = successIds.has(card.id);

        return (
            <Button
                key={card.id}
                variant={isMatched ? 'ghost' : isSelected ? 'secondary' : 'outline'}
                className={cn(
                    "h-24 w-full text-lg transition-all duration-300",
                    isMatched && "opacity-0 pointer-events-none",
                    isError && "animate-shake bg-red-100 border-red-500 text-red-500 hover:bg-red-100 hover:text-red-500",
                    isSuccess && "bg-green-100 border-green-500 text-green-500 hover:bg-green-100 hover:text-green-500 scale-105"
                )}
                onClick={() => onCardClick(card.id, card.matchId)}
                disabled={(isCorrect !== null && !isMatched) || isError || isSuccess}
            >
                {card.type === 'tex' ? (
                    <KatexRenderer tex={card.content} className="text-xl" />
                ) : (
                    <code className="font-mono font-bold text-sm md:text-base">{card.content}</code>
                )}
            </Button>
        );
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-2xl font-bold text-duo-text text-left w-full mb-4">
                {question.prompt}
            </h2>

            <div className="grid grid-cols-2 gap-8 w-full">
                {/* Left Column: Code */}
                <div className="flex flex-col gap-4">
                    <div className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Code</div>
                    {leftCards.map(renderCard)}
                </div>

                {/* Right Column: Display */}
                <div className="flex flex-col gap-4">
                    <div className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Display</div>
                    {rightCards.map(renderCard)}
                </div>
            </div>
        </div>
    );
}

// Container Logic

interface QuestionMatchProps {
    question: QuestionMatchType;
    onStatusChange: (done: boolean) => void;
    onMistake?: () => void;
}

export function QuestionMatch({ question, onStatusChange, onMistake }: QuestionMatchProps) {
    const [leftCards, setLeftCards] = useState<Card[]>([]);
    const [rightCards, setRightCards] = useState<Card[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
    const [errorIds, setErrorIds] = useState<Set<string>>(new Set());
    const [successIds, setSuccessIds] = useState<Set<string>>(new Set());
    const { setSelection, isCorrect } = useLessonStore();

    useEffect(() => {
        const left: Card[] = [];
        const right: Card[] = [];

        question.pairs.forEach((pair, idx) => {
            left.push({ id: `p${idx}-code`, content: pair.code, type: 'code', matchId: `p${idx}` });
            right.push({ id: `p${idx}-tex`, content: pair.tex, type: 'tex', matchId: `p${idx}` });
        });

        setLeftCards(left.sort(() => Math.random() - 0.5));
        setRightCards(right.sort(() => Math.random() - 0.5));

        setMatchedIds(new Set());
        setSelectedId(null);
        setErrorIds(new Set());
        setSuccessIds(new Set());
        setSelection(false);
    }, [question, setSelection]);

    const handleCardClick = (id: string, matchId: string) => {
        if (isCorrect !== null) return; // Locked
        if (matchedIds.has(id)) return; // Already matched
        if (errorIds.has(id)) return; // Locked by error animation
        if (successIds.has(id)) return; // Locked by success animation

        if (!selectedId) {
            setSelectedId(id);
        } else {
            if (selectedId === id) {
                setSelectedId(null); // Deselect
                return;
            }

            // Check Match
            const allCards = [...leftCards, ...rightCards];
            const prevCard = allCards.find(c => c.id === selectedId);

            if (prevCard && prevCard.matchId === matchId) {
                // Match!
                const newSuccess = new Set<string>();
                newSuccess.add(id);
                newSuccess.add(selectedId);
                setSuccessIds(newSuccess);
                setSelectedId(null);

                // Delay hiding
                setTimeout(() => {
                    setMatchedIds(prev => {
                        const newMatched = new Set(prev);
                        newMatched.add(id);
                        newMatched.add(selectedId);

                        // Check if all done
                        if (newMatched.size === allCards.length) {
                            setSelection(true);
                            onStatusChange(true);
                        }
                        return newMatched;
                    });
                    setSuccessIds(new Set());
                }, 500);

            } else {
                // Mismatch Logic
                if (onMistake) onMistake();

                // Show Error Feedback
                const newErrors = new Set<string>();
                newErrors.add(id);
                newErrors.add(selectedId);
                setErrorIds(newErrors);

                // Clear error after animation
                setTimeout(() => {
                    setErrorIds(new Set());
                }, 800);

                // Reset selection
                setSelectedId(null);
            }
        }
    };

    return (
        <QuestionMatchUI
            question={question}
            leftCards={leftCards}
            rightCards={rightCards}
            matchedIds={matchedIds}
            selectedId={selectedId}
            errorIds={errorIds}
            successIds={successIds}
            isCorrect={isCorrect}
            onCardClick={handleCardClick}
        />
    );
}
