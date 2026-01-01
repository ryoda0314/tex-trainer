'use client';

import { QuestionMatch } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Plus, Trash, Eye } from "lucide-react";
import { KatexRenderer } from "@/components/ui/KatexRenderer";

interface MatchEditorProps {
    question: QuestionMatch;
    onChange: (updated: QuestionMatch) => void;
}

export function MatchEditor({ question, onChange }: MatchEditorProps) {
    const update = (updates: Partial<QuestionMatch>) => {
        onChange({ ...question, ...updates });
    };

    const addPair = () => {
        update({
            pairs: [...question.pairs, { tex: '', code: '' }]
        });
    };

    const removePair = (index: number) => {
        const newPairs = [...question.pairs];
        newPairs.splice(index, 1);
        update({ pairs: newPairs });
    };

    const updatePair = (index: number, field: 'tex' | 'code', value: string) => {
        const newPairs = [...question.pairs];
        newPairs[index] = { ...newPairs[index], [field]: value };
        update({ pairs: newPairs });
    };

    return (
        <div className="space-y-6 border border-gray-100 rounded-xl p-6 bg-white shadow-sm">
            <div className="flex justify-between items-center border-b pb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Match Pairs</h3>
                    <p className="text-sm text-gray-500">Create pairs of LaTeX code and their visual representation.</p>
                </div>
            </div>

            <div className="space-y-4">
                {question.pairs.map((pair, index) => (
                    <div key={index} className="flex flex-col gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg relative group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => removePair(index)}
                                className="h-8 w-8 p-0"
                            >
                                <Trash size={14} />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Code Side (Left) */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    Code (Left Column)
                                </label>
                                <input
                                    type="text"
                                    value={pair.code}
                                    placeholder="\frac{...}"
                                    onChange={(e) => updatePair(index, 'code', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                />
                                <div className="h-8 flex items-center bg-white px-2 rounded border border-dashed border-gray-200 text-xs text-gray-400 overflow-hidden font-mono">
                                    Preview: {pair.code}
                                </div>
                            </div>

                            {/* TeX Side (Right) */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    Display (Right Column) <Eye size={12} />
                                </label>
                                <input
                                    type="text"
                                    value={pair.tex}
                                    placeholder="\frac{...}"
                                    onChange={(e) => updatePair(index, 'tex', e.target.value)}
                                    className="w-full p-2 border border-blue-200 bg-blue-50/50 rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                />
                                <div className="h-12 flex items-center justify-center bg-white rounded border border-gray-200 overflow-hidden">
                                    {pair.tex ? (
                                        <KatexRenderer tex={pair.tex} className="text-lg" />
                                    ) : (
                                        <span className="text-xs text-gray-300 italic">No latex</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Button
                variant="ghost"
                className="w-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 dashed border-2 border-gray-200 border-dashed py-6"
                onClick={addPair}
            >
                <Plus size={16} className="mr-2" /> Add New Pair
            </Button>
        </div>
    );
}
