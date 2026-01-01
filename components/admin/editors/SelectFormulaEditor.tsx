'use client';

import { QuestionSelectFormula } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Plus, Trash, CheckCircle, Circle, Code } from "lucide-react";
import { KatexRenderer } from "@/components/ui/KatexRenderer";
import { cn } from "@/lib/utils";

interface SelectFormulaEditorProps {
    question: QuestionSelectFormula;
    onChange: (updated: QuestionSelectFormula) => void;
}

export function SelectFormulaEditor({ question, onChange }: SelectFormulaEditorProps) {
    const update = (updates: Partial<QuestionSelectFormula>) => {
        onChange({ ...question, ...updates });
    };

    const addChoice = () => {
        update({
            choices: [...question.choices, '']
        });
    };

    const removeChoice = (index: number) => {
        const newChoices = [...question.choices];
        newChoices.splice(index, 1);
        update({ choices: newChoices });
    };

    const updateChoice = (index: number, value: string) => {
        const newChoices = [...question.choices];
        // If this choice was the correct analysis (value match), update correctAnalysis too
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
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-4">Select Formula Question Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Target (The Code Prompt) */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Code size={16} /> Target Code (Prompt)
                        </label>
                        <p className="text-xs text-gray-500">The LaTeX code to show as the prompt.</p>
                        <input
                            type="text"
                            value={question.code}
                            onChange={(e) => update({ code: e.target.value })}
                            placeholder="\frac{...}"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                        />
                        <div className="p-6 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg min-h-[120px]">
                            {question.code ? (
                                <code className="text-xl bg-white p-4 rounded shadow-sm border border-gray-200 font-bold text-gray-700">
                                    {question.code}
                                </code>
                            ) : (
                                <span className="text-gray-400 italic">Preview Code</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Choices (Formulas) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-700">Formula Answer Choices</label>
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
                        Add formula options (TeX). Click the circle to mark the correct answer.
                    </p>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {question.choices.map((choice, index) => {
                            const isCorrect = question.correctAnalysis === choice;
                            return (
                                <div key={index} className={cn(
                                    "flex flex-col gap-2 p-3 rounded-lg border transition-colors",
                                    isCorrect ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                                )}>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setCorrect(choice)}
                                            className={cn(
                                                "flex-shrink-0 transition-colors",
                                                isCorrect ? "text-green-600" : "text-gray-300 hover:text-green-400"
                                            )}
                                            title="Mark as correct"
                                        >
                                            {isCorrect ? <CheckCircle size={24} /> : <Circle size={24} />}
                                        </button>

                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={choice}
                                                onChange={(e) => updateChoice(index, e.target.value)}
                                                className="w-full p-1 bg-transparent border-b border-dashed border-gray-300 outline-none font-mono text-xs mb-2 focus:border-blue-400 transition-colors"
                                                placeholder="\tex..."
                                            />
                                            <div className="min-h-[40px] flex items-center justify-start overflow-hidden">
                                                {choice ? <KatexRenderer tex={choice} className="text-lg" /> : <span className="text-xs text-gray-300">preview</span>}
                                            </div>
                                        </div>

                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removeChoice(index)}
                                            className="h-8 w-8 p-0 opacity-50 hover:opacity-100 self-start"
                                        >
                                            <Trash size={14} />
                                        </Button>
                                    </div>
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
