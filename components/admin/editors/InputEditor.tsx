'use client';

import { QuestionInput } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Plus, Trash, Eye, ImageIcon, Type } from "lucide-react";
import { KatexRenderer } from "@/components/ui/KatexRenderer";

interface InputEditorProps {
    question: QuestionInput;
    onChange: (updated: QuestionInput) => void;
}

export function InputEditor({ question, onChange }: InputEditorProps) {
    const update = (updates: Partial<QuestionInput>) => {
        onChange({ ...question, ...updates });
    };

    const addAcceptable = () => {
        update({
            acceptable: [...question.acceptable, '']
        });
    };

    const removeAcceptable = (index: number) => {
        const newAcc = [...question.acceptable];
        newAcc.splice(index, 1);
        update({ acceptable: newAcc });
    };

    const updateAcceptable = (index: number, value: string) => {
        const newAcc = [...question.acceptable];
        newAcc[index] = value;
        update({ acceptable: newAcc });
    };

    return (
        <div className="space-y-6 border border-gray-100 rounded-xl p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-4">Input Question Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Target */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Eye size={16} /> Target Formula (Display)
                        </label>
                        <p className="text-xs text-gray-500">The LaTeX to show as the target to type.</p>
                        <input
                            type="text"
                            value={question.formula}
                            onChange={(e) => update({ formula: e.target.value })}
                            placeholder="\frac{...}"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                        />
                        <div className="p-6 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg min-h-[100px]">
                            {question.formula ? (
                                <KatexRenderer tex={question.formula} className="text-2xl" />
                            ) : (
                                <span className="text-gray-400 italic">Preview</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <ImageIcon size={16} /> Image URL (Optional)
                        </label>
                        <input
                            type="text"
                            value={question.image || ''}
                            onChange={(e) => update({ image: e.target.value || undefined })}
                            placeholder="/images/example.png"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Type size={16} /> Instruction (Optional)
                        </label>
                        <input
                            type="text"
                            value={question.instruction || ''}
                            onChange={(e) => update({ instruction: e.target.value || undefined })}
                            placeholder="Type the equation..."
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>
                </div>

                {/* Acceptable Answers */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-700">Acceptable Answers</label>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={addAcceptable}
                        >
                            <Plus size={14} className="mr-1" /> Add
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                        List all valid LaTeX variations that count as correct. Spaces are ignored during validation.
                    </p>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                        {question.acceptable.map((acc, index) => (
                            <div key={index} className="flex gap-2 group">
                                <input
                                    type="text"
                                    value={acc}
                                    onChange={(e) => updateAcceptable(index, e.target.value)}
                                    className="flex-1 p-2 border border-gray-200 rounded focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
                                    placeholder="Answer variation..."
                                />
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => removeAcceptable(index)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash size={14} />
                                </Button>
                            </div>
                        ))}
                        {question.acceptable.length === 0 && (
                            <div className="text-center p-4 border border-dashed rounded text-gray-400 text-sm">
                                No answers defined.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
