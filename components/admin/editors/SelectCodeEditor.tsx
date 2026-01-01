'use client';

import { QuestionSelectCode } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Plus, Trash, Eye, CheckCircle, Circle } from "lucide-react";
import { KatexRenderer } from "@/components/ui/KatexRenderer";
import { cn } from "@/lib/utils";

interface SelectCodeEditorProps {
    question: QuestionSelectCode;
    onChange: (updated: QuestionSelectCode) => void;
}

export function SelectCodeEditor({ question, onChange }: SelectCodeEditorProps) {
    const update = (updates: Partial<QuestionSelectCode>) => {
        onChange({ ...question, ...updates });
    };

    const addChoice = () => {
        update({
            choices: [...question.choices, '']
        });
    };

    const removeChoice = (index: number) => {
        const newChoices = [...question.choices];
        const removed = newChoices[index];
        newChoices.splice(index, 1);

        // If we removed the correct answer code, allow user to re-select
        // Ideally we might want to warn, but simple behavior is let it be invalid until fixed
        update({ choices: newChoices });
    };

    const updateChoice = (index: number, value: string) => {
        const newChoices = [...question.choices];
        // If this choice was the correct analysis, update that too if it matches exactly?
        // Actually correctAnalysis stores the value string.
        // If we change the value, we should probably update correctAnalysis if it matched the old value.
        const oldValue = newChoices[index];
        newChoices[index] = value;

        let newCorrect = question.correctAnalysis;
        if (question.correctAnalysis === oldValue) {
            newCorrect = value;
        }

        update({ choices: newChoices, correctAnalysis: newCorrect });
    };

    const setCorrect = (value: string) => {
        update({ correctAnalysis: value });
    };

    return (
        <div className="space-y-6 border border-gray-100 rounded-xl p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-4">Select Code Question Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Target */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Eye size={16} /> Target Formula (Display)
                        </label>
                        <p className="text-xs text-gray-500">The LaTeX to show as the prompt.</p>
                        <input
                            type="text"
                            value={question.formula}
                            onChange={(e) => update({ formula: e.target.value })}
                            placeholder="\frac{...}"
                            className="w-full p-2 border border-blue-200 bg-blue-50/50 rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                        />
                        <div className="p-6 flex items-center justify-center bg-white border border-gray-200 rounded-lg min-h-[120px]">
                            {question.formula ? (
                                <KatexRenderer tex={question.formula} className="text-3xl" />
                            ) : (
                                <span className="text-gray-400 italic">Preview</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Choices */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-700">Code Answer Choices</label>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={addChoice}
                        >
                            <Plus size={14} className="mr-1" /> Add Choice
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                        Add code options. Click the circle to mark the correct answer.
                    </p>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {question.choices.map((choice, index) => {
                            const isCorrect = question.correctAnalysis === choice;
                            return (
                                <div key={index} className={cn(
                                    "flex gap-2 items-center p-2 rounded-lg border transition-colors",
                                    isCorrect ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                                )}>
                                    <button
                                        onClick={() => setCorrect(choice)}
                                        className={cn(
                                            "flex-shrink-0 transition-colors",
                                            isCorrect ? "text-green-600" : "text-gray-300 hover:text-green-400"
                                        )}
                                        title="Mark as correct"
                                    >
                                        {isCorrect ? <CheckCircle size={20} /> : <Circle size={20} />}
                                    </button>

                                    <input
                                        type="text"
                                        value={choice}
                                        onChange={(e) => updateChoice(index, e.target.value)}
                                        className="flex-1 p-2 bg-transparent outline-none font-mono text-sm font-bold"
                                        placeholder="\code..."
                                    />

                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeChoice(index)}
                                        className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
                                    >
                                        <Trash size={14} />
                                    </Button>
                                </div>
                            );
                        })}
                        {question.choices.length === 0 && (
                            <div className="text-center p-4 border border-dashed rounded text-gray-400 text-sm">
                                No choices defined.
                            </div>
                        )}
                        {!question.correctAnalysis && question.choices.length > 0 && (
                            <div className="text-xs text-red-500 font-bold text-center animate-pulse">
                                Please select a correct answer!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
