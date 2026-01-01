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
    isCorrect: boolean | null;
    onCardClick: (id: string, matchId: string) => void;
}

export function QuestionMatchUI({ question, leftCards, rightCards, matchedIds, selectedId, isCorrect, onCardClick }: QuestionMatchUIProps) {
    const renderCard = (card: Card) => {
        const isMatched = matchedIds.has(card.id);
        const isSelected = selectedId === card.id;

        return (
            <Button
                key={card.id}
                variant={isMatched ? 'ghost' : isSelected ? 'secondary' : 'outline'}
                className={cn(
                    "h-24 w-full text-lg transition-all duration-300",
                    isMatched && "opacity-0 pointer-events-none"
                )}
                onClick={() => onCardClick(card.id, card.matchId)}
                disabled={isCorrect !== null && !isMatched}
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
}

export function QuestionMatch({ question, onStatusChange }: QuestionMatchProps) {
    const [leftCards, setLeftCards] = useState<Card[]>([]);
    const [rightCards, setRightCards] = useState<Card[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
    const { setSelection, isCorrect } = useLessonStore();

    useEffect(() => {
        // Generate cards
        const left: Card[] = [];
        const right: Card[] = [];

        question.pairs.forEach((pair, idx) => {
            // Code on Left
            left.push({ id: `p${idx}-code`, content: pair.code, type: 'code', matchId: `p${idx}` });
            // TeX on Right
            right.push({ id: `p${idx}-tex`, content: pair.tex, type: 'tex', matchId: `p${idx}` });
        });

        // Shuffle independently
        setLeftCards(left.sort(() => Math.random() - 0.5));
        setRightCards(right.sort(() => Math.random() - 0.5));

        setMatchedIds(new Set());
        setSelectedId(null);
        setSelection(false);
    }, [question, setSelection]);

    const handleCardClick = (id: string, matchId: string) => {
        if (isCorrect !== null) return; // Locked
        if (matchedIds.has(id)) return; // Already matched

        if (!selectedId) {
            setSelectedId(id);
        } else {
            if (selectedId === id) {
                setSelectedId(null); // Deselect
                return;
            }

            // Check Match
            // We need to look in both lists to find the card object for selectedId, 
            // but we only need the matchId which we don't have stored in state directly except via the card object.
            // Actually, we pass matchId in the handler. Ideally we should compare matchId of current click with matchId of selectedId.
            // But we didn't store matchId of selectedId.
            // Let's find the card.
            const allCards = [...leftCards, ...rightCards];
            const prevCard = allCards.find(c => c.id === selectedId);

            if (prevCard && prevCard.matchId === matchId) {
                // Match!
                const newSet = new Set(matchedIds);
                newSet.add(id);
                newSet.add(selectedId);
                setMatchedIds(newSet);
                setSelectedId(null);

                // Check if all done
                if (newSet.size === allCards.length) {
                    setSelection(true);
                    onStatusChange(true);
                }
            } else {
                // Mismatch - just deselect, or maybe brief error?
                // For now just swap selection to the new one? Or deselect all?
                // Standard memory game often deselects both on mismatch after delay.
                // Here we essentially "Select A", "Select B". If mismatch, maybe just select B?
                // User logic: "oops wrong match".
                // Let's just switch selection to the new card, effectively "changing mind".
                // UNLESS they are trying to match.
                // Simple behavior: If 2nd click is wrong, Reset selection to null (forcing user to start over pair)
                // OR set selection to the new card.
                // Let's set selection to new card to allow rapid clicking.
                setSelectedId(id);
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
            // @ts-ignore
            isCorrect={isCorrect}
            onCardClick={handleCardClick}
        />
    );
}
