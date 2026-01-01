'use client';

import { QuestionCloze } from "@/lib/types";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Wand2 } from "lucide-react";
import { KatexRenderer } from "@/components/ui/KatexRenderer";

interface ClozeEditorProps {
    question: QuestionCloze;
    onChange: (q: QuestionCloze) => void;
}

export function ClozeEditor({ question, onChange }: ClozeEditorProps) {
    // Local state to handle inputs before propagating
    const update = (patch: Partial<QuestionCloze>) => {
        onChange({ ...question, ...patch });
    };

    const generateSegments = () => {
        // Simple parser: split by \Box
        // e.g. "x \Box {2}" -> static(x ) -> blank(?) -> static({2})
        // This is heuristic.
        const parts = question.template.split('\\Box');
        const newSegments: QuestionCloze['segments'] = [];

        parts.forEach((part, i) => {
            if (part) {
                newSegments.push({ type: 'static', content: part.trim() });
            }
            if (i < parts.length - 1) {
                newSegments.push({ type: 'blank', content: '' }); // User must fill correct answer
            }
        });
        update({ segments: newSegments });
    };

    return (
        <div className="space-y-6 border border-gray-100 rounded-xl p-6 bg-white shadow-sm">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Cloze Settings</h3>
                <span className="text-xs bg-duo-green-face text-white px-2 py-1 rounded">CLOZE</span>
            </div>

            {/* Model Match */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">
                    Goal Model (LaTeX)
                </label>
                <div className="flex gap-4 items-center">
                    <input
                        className="flex-1 p-2 border rounded font-mono text-sm"
                        value={question.model || ''}
                        onChange={e => update({ model: e.target.value })}
                        placeholder="\frac{1}{2}"
                    />
                    <div className="p-2 bg-gray-50 rounded min-w-[100px] flex justify-center">
                        {question.model ? <KatexRenderer tex={question.model} /> : <span className="text-gray-300">-</span>}
                    </div>
                </div>
            </div>

            {/* Template */}
            <div className="space-y-2">
                <div className="flex justify-between">
                    <label className="text-sm font-semibold text-gray-600">Template (with \Box)</label>
                    <Button variant="outline" size="sm" onClick={generateSegments} className="h-6 text-xs gap-1">
                        <Wand2 size={12} /> Auto-Gen Segments
                    </Button>
                </div>
                <input
                    className="w-full p-2 border rounded font-mono text-sm"
                    value={question.template}
                    onChange={e => update({ template: e.target.value })}
                    placeholder="x \Box {2}"
                />
            </div>

            {/* Segments Editor */}
            <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-600">Segments</label>
                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                    {question.segments.map((seg, idx) => (
                        <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded border border-gray-100 shadow-sm">
                            <select
                                className="text-xs font-semibold uppercase p-1 rounded bg-gray-100 border-none outline-none cursor-pointer"
                                value={seg.type}
                                onChange={e => {
                                    const newSegs = [...question.segments];
                                    newSegs[idx] = { ...seg, type: e.target.value as 'static' | 'blank' };
                                    update({ segments: newSegs });
                                }}
                            >
                                <option value="static">STATIC</option>
                                <option value="blank">BLANK</option>
                            </select>

                            <input
                                className={`flex-1 p-1 text-sm border-b focus:border-blue-500 outline-none font-mono ${seg.type === 'blank' ? 'text-green-600 font-bold' : 'text-gray-700'
                                    }`}
                                value={seg.content}
                                onChange={e => {
                                    const newSegs = [...question.segments];
                                    newSegs[idx] = { ...seg, content: e.target.value };
                                    update({ segments: newSegs });
                                }}
                                placeholder={seg.type === 'blank' ? 'Correct Answer' : 'Visible TeX'}
                            />

                            <button
                                onClick={() => {
                                    const newSegs = question.segments.filter((_, i) => i !== idx);
                                    update({ segments: newSegs });
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    <Button
                        variant="ghost"
                        className="w-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 dashed border-2 border-gray-200 border-dashed"
                        onClick={() => update({ segments: [...question.segments, { type: 'static', content: '' }] })}
                    >
                        <Plus size={16} /> Add Segment
                    </Button>
                </div>
            </div>

            {/* Choices */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Choices</label>
                <div className="flex flex-wrap gap-2">
                    {question.choices.map((choice, idx) => (
                        <div key={idx} className="flex items-center bg-gray-50 rounded-lg pl-2 pr-1 py-1 border border-gray-200">
                            <span className="font-mono text-sm">{choice}</span>
                            <button
                                onClick={() => {
                                    const newChoices = question.choices.filter((_, i) => i !== idx);
                                    update({ choices: newChoices });
                                }}
                                className="ml-2 p-1 text-gray-400 hover:text-red-500"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        className="flex-1 p-2 border rounded text-sm font-mono"
                        placeholder="Add choice..."
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                const target = e.currentTarget;
                                if (target.value) {
                                    update({ choices: [...question.choices, target.value] });
                                    target.value = '';
                                }
                            }
                        }}
                    />
                    <Button
                        variant="secondary"
                        onClick={() => {
                            // Find blank segments correct answers and add them if missing
                            const answers = question.segments
                                .filter(s => s.type === 'blank')
                                .map(s => s.content)
                                .filter(c => c && !question.choices.includes(c));
                            if (answers.length > 0) {
                                update({ choices: [...question.choices, ...answers] });
                            }
                        }}
                        title="Add blank answers"
                    >
                        Auto-Fill
                    </Button>
                </div>
            </div>
        </div>
    );
}
