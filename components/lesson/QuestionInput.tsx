import { useState, useEffect, ChangeEvent } from 'react';
import type { QuestionInput as QuestionInputType } from '@/lib/types';
import { useLessonStore } from '@/store/useLessonStore';
import { KatexRenderer } from '@/components/ui/KatexRenderer';

// UI
export interface QuestionInputUIProps {
    question: QuestionInputType;
    value: string;
    isCorrect: boolean | null;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function QuestionInputUI({ question, value, isCorrect, onChange }: QuestionInputUIProps) {
    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-duo-text text-left w-full">
                {question.prompt}
            </h2>

            {question.instruction && (
                <p className="text-duo-gray-side text-lg w-full text-left -mt-6">{question.instruction}</p>
            )}

            {/* Visual Target if exists */}
            {question.formula ? (
                <div className="p-6 bg-white border-2 border-duo-gray-face rounded-xl min-w-[200px] flex justify-center">
                    <KatexRenderer tex={question.formula} block className="text-3xl" />
                </div>
            ) : null}

            <div className="w-full">
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder="Type LaTeX code..."
                    className="w-full p-4 text-xl border-2 border-duo-gray-side rounded-xl focus:border-duo-blue-side focus:outline-none bg-duo-gray-face/10 font-mono"
                    disabled={isCorrect !== null}
                    autoFocus
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                />
            </div>

            {/* Live Preview of Input */}
            {value && (
                <div className="w-full p-4 bg-duo-blue-face/10 rounded-xl flex flex-col gap-2">
                    <span className="text-sm font-bold text-duo-blue-side uppercase">Your Preview:</span>
                    <KatexRenderer tex={value} block className="text-2xl" />
                </div>
            )}
        </div>
    );
}

// Logic
interface QuestionInputProps {
    question: QuestionInputType;
}

export function QuestionInput({ question }: QuestionInputProps) {
    const { setSelection, isCorrect } = useLessonStore();
    const [value, setValue] = useState('');

    useEffect(() => {
        setValue('');
        setSelection(null);
    }, [question, setSelection]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setValue(v);
        setSelection(v.length > 0 ? v : null);
    };

    return (
        <QuestionInputUI
            question={question}
            value={value}
            isCorrect={isCorrect}
            onChange={handleChange}
        />
    );
}
