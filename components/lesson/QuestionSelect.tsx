import { QuestionSelectCode, QuestionSelectFormula } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { KatexRenderer } from '@/components/ui/KatexRenderer';
import { cn } from '@/lib/utils';
import { useLessonStore } from '@/store/useLessonStore';

// UI Component (Pure, no store)
export interface QuestionSelectUIProps {
    question: QuestionSelectCode | QuestionSelectFormula;
    selectedAnswer: string | null;
    isCorrect: boolean | null;
    onSelect: (choice: string) => void;
}

export function QuestionSelectUI({ question, selectedAnswer, isCorrect, onSelect }: QuestionSelectUIProps) {
    const isSelected = (choice: string) => selectedAnswer === choice;

    // Logic to determine if we show Code or Math in the main display
    const isSelectCode = question.type === 'SELECT_CODE';
    const mainContent = isSelectCode
        ? <KatexRenderer tex={question.formula} block className="text-4xl" />
        : <code className="text-xl bg-gray-100 p-4 rounded-xl">{question.code}</code>;

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-duo-text text-left w-full">
                {question.prompt}
            </h2>

            <div className="min-h-[150px] flex items-center justify-center w-full">
                {mainContent}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {question.choices.map((choice, idx) => {
                    const choiceContent = isSelectCode
                        ? <code className="font-mono font-bold">{choice}</code>
                        : <KatexRenderer tex={choice} className="text-xl" />;

                    return (
                        <Button
                            key={idx}
                            variant={isSelected(choice) ? 'secondary' : 'outline'}
                            className={cn(
                                "h-auto py-6 md:py-8",
                                isSelected(choice) && "bg-duo-blue-face/20 border-duo-blue-side border-2"
                            )}
                            onClick={() => onSelect(choice)}
                            disabled={isCorrect !== null}
                        >
                            {choiceContent}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}

// Container Component (Connects to Store)
interface QuestionSelectProps {
    question: QuestionSelectCode | QuestionSelectFormula;
    onCheck: () => void;
}

export function QuestionSelect({ question, onCheck }: QuestionSelectProps) {
    const { selectedAnswer, setSelection, isCorrect } = useLessonStore();

    const handleSelect = (choice: string) => {
        if (isCorrect !== null) return; // Locked after check
        setSelection(choice);
    };

    return (
        <QuestionSelectUI
            question={question}
            selectedAnswer={selectedAnswer as string | null}
            isCorrect={isCorrect}
            onSelect={handleSelect}
        />
    );
}
