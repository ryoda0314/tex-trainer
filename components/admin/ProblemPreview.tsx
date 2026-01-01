import { useState, ChangeEvent } from 'react';
import { Question } from '@/lib/types';
import { QuestionSelectUI } from '@/components/lesson/QuestionSelect';
import { QuestionMatchUI } from '@/components/lesson/QuestionMatch';
import { QuestionClozeUI } from '@/components/lesson/QuestionCloze';
import { QuestionArrangeUI } from '@/components/lesson/QuestionArrange';
import { QuestionInputUI } from '@/components/lesson/QuestionInput';

interface ProblemPreviewProps {
    question: Question;
}

export function ProblemPreview({ question }: ProblemPreviewProps) {
    // We need to manage state for all types here, or have sub-components.
    // Since this is a preview, simple state per type is fine.

    // -- SELECT_CODE & SELECT_FORMULA --
    const [selectedSelect, setSelectedSelect] = useState<string | null>(null);

    // -- MATCH --
    const [matchLeftCards, setMatchLeftCards] = useState<any[]>([]);
    const [matchRightCards, setMatchRightCards] = useState<any[]>([]);
    const [matchSelectedId, setMatchSelectedId] = useState<string | null>(null);
    const [matchMatchedIds, setMatchMatchedIds] = useState<Set<string>>(new Set());

    // -- CLOZE --
    const [clozeFilled, setClozeFilled] = useState<Record<number, string>>({});
    const [clozeActiveIndex, setClozeActiveIndex] = useState<number | null>(null);

    // -- ARRANGE --
    const [arrangeSolution, setArrangeSolution] = useState<any[]>([]);
    const [arrangeBank, setArrangeBank] = useState<any[]>([]);

    // -- INPUT --
    const [inputValue, setInputValue] = useState('');

    // Initialization effects (mocking what the containers did)
    // We can use a key on the component to reset state when question changes, 
    // but the parent ProblemCard usually mounts this fresh.

    // Initializers
    if (question.type === 'MATCH' && matchLeftCards.length === 0) {
        // init match
        const left: any[] = [];
        const right: any[] = [];
        question.pairs.forEach((pair, idx) => {
            left.push({ id: `p${idx}-code`, content: pair.code, type: 'code', matchId: `p${idx}` });
            right.push({ id: `p${idx}-tex`, content: pair.tex, type: 'tex', matchId: `p${idx}` });
        });
        setMatchLeftCards(left.sort(() => Math.random() - 0.5));
        setMatchRightCards(right.sort(() => Math.random() - 0.5));
    }

    if (question.type === 'ARRANGE' && arrangeBank.length === 0 && arrangeSolution.length === 0) {
        // init arrange
        const all = [...question.initialTiles, ...(question.distractors || [])];
        setArrangeBank(all.sort(() => 0.5 - Math.random())); // Simple shuffle for preview
    }

    // -- HANDLERS --

    // Select
    const handleSelect = (choice: string) => setSelectedSelect(choice);

    // Match
    const handleMatchClick = (id: string, matchId: string) => {
        if (matchMatchedIds.has(id)) return;
        if (!matchSelectedId) {
            setMatchSelectedId(id);
        } else {
            if (matchSelectedId === id) {
                setMatchSelectedId(null);
                return;
            }
            // Check match - need to find card to get matchId if we didn't pass it? 
            // Oh handler receives matchId. Good.

            // But we need to check if they match.
            // Actually the handler logic in QuestionMatch checked if `prevCard.matchId === matchId`.
            // We need to implement that check here.
            // Problem: we don't know the matchId of the *selected* card easily without looking it up.

            const all = [...matchLeftCards, ...matchRightCards];
            const prevCard = all.find(c => c.id === matchSelectedId);

            if (prevCard && prevCard.matchId === matchId) {
                const newSet = new Set(matchMatchedIds);
                newSet.add(id);
                newSet.add(matchSelectedId);
                setMatchMatchedIds(newSet);
                setMatchSelectedId(null);
            } else {
                setMatchSelectedId(null);
            }
        }
    };

    // Cloze
    const handleClozeBlankClick = (idx: number) => setClozeActiveIndex(idx);
    const handleClozeChoiceClick = (choice: string) => {
        if (clozeActiveIndex === null) {
            return;
        }
        setClozeFilled({ ...clozeFilled, [clozeActiveIndex]: choice });
        setClozeActiveIndex(null);
    };

    // Arrange
    const handleArrangeToggle = (tile: any, from: 'bank' | 'solution') => {
        if (from === 'bank') {
            setArrangeBank(prev => prev.filter(t => t.id !== tile.id));
            setArrangeSolution(prev => [...prev, tile]);
        } else {
            setArrangeSolution(prev => prev.filter(t => t.id !== tile.id));
            setArrangeBank(prev => [...prev, tile]);
        }
    };

    // Input
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };


    // RENDER
    switch (question.type) {
        case 'SELECT_CODE':
        case 'SELECT_FORMULA':
            return (
                <QuestionSelectUI
                    question={question}
                    selectedAnswer={selectedSelect}
                    isCorrect={null}
                    onSelect={handleSelect}
                />
            );
        case 'MATCH':
            return (
                <QuestionMatchUI
                    question={question}
                    leftCards={matchLeftCards}
                    rightCards={matchRightCards}
                    matchedIds={matchMatchedIds}
                    selectedId={matchSelectedId}
                    errorIds={new Set()}
                    successIds={new Set()}
                    isCorrect={null}
                    onCardClick={handleMatchClick}
                />
            );
        case 'CLOZE':
            return (
                <QuestionClozeUI
                    question={question}
                    filled={clozeFilled}
                    activeBlankIndex={clozeActiveIndex}
                    isCorrect={null}
                    onBlankClick={handleClozeBlankClick} // Fix: Used generic handleClozeBlankClick
                    onChoiceClick={handleClozeChoiceClick}
                />
            );
        case 'ARRANGE':
            return (
                <QuestionArrangeUI
                    question={question}
                    solutionTiles={arrangeSolution}
                    bankTiles={arrangeBank}
                    isCorrect={null}
                    onToggleTile={handleArrangeToggle}
                />
            );
        case 'INPUT':
            return (
                <QuestionInputUI
                    question={question}
                    value={inputValue}
                    isCorrect={null}
                    onChange={handleInputChange}
                />
            );
        default:
            return <div>Preview not available</div>;
    }
}
