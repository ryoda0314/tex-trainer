'use client';

import { Question, QuestionCloze, QuestionMatch, QuestionInput, QuestionSelectCode, QuestionSelectFormula, QuestionArrange } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveProblem } from "@/app/actions/save-problem";
import { ClozeEditor } from "./editors/ClozeEditor";
import { MatchEditor } from "./editors/MatchEditor";
import { InputEditor } from "./editors/InputEditor";
import { SelectCodeEditor } from "./editors/SelectCodeEditor";
import { SelectFormulaEditor } from "./editors/SelectFormulaEditor";
import { ArrangeEditor } from "./editors/ArrangeEditor";

interface ProblemEditorProps {
    initialQuestion: Question;
}

export function ProblemEditor({ initialQuestion }: ProblemEditorProps) {
    const router = useRouter();
    const [question, setQuestion] = useState<Question>(initialQuestion);
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual');

    // We'll keep a separate text state for the "Specifics" JSON editing
    // to allow invalid JSON while typing
    const [specificsJson, setSpecificsJson] = useState(() => {
        const { id, type, prompt, ...rest } = initialQuestion;
        return JSON.stringify(rest, null, 2);
    });

    const handleSave = async () => {
        try {
            const parsedSpecifics = JSON.parse(specificsJson);
            const fullQuestion = {
                id: question.id,
                type: question.type,
                prompt: question.prompt,
                ...parsedSpecifics
            };

            // Server Action
            const result = await saveProblem(fullQuestion);
            if (result.success) {
                alert("Saved successfully! Reloading...");
                setQuestion(fullQuestion);
            } else {
                alert(`Error: ${result.message}`);
            }

        } catch (e) {
            setJsonError((e as Error).message);
            alert("Save failed (Check JSON or Console)");
        }
    };

    const handleSpecificsChange = (val: string) => {
        setSpecificsJson(val);
        try {
            JSON.parse(val);
            setJsonError(null);
        } catch (e) {
            setJsonError((e as Error).message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/problems" className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                            Edit Problem
                        </h1>
                        <p className="text-gray-500 font-mono text-sm">{question.id}</p>
                    </div>
                </div>
                <Button onClick={handleSave} className="gap-2">
                    <Save size={16} />
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Fields */}
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Prompt</label>
                        <input
                            type="text"
                            value={question.prompt}
                            onChange={(e) => setQuestion({ ...question, prompt: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    {/* Specifics Editor Switcher */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-sm font-semibold text-gray-700">Specific Details</label>
                            <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-medium">
                                <button
                                    onClick={() => setViewMode('visual')}
                                    className={`px-3 py-1.5 rounded-md transition-all ${viewMode === 'visual' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Visual
                                </button>
                                <button
                                    onClick={() => setViewMode('json')}
                                    className={`px-3 py-1.5 rounded-md transition-all ${viewMode === 'json' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    JSON
                                </button>
                            </div>
                        </div>

                        {viewMode === 'visual' ? (
                            <div className="mt-4">
                                {question.type === 'CLOZE' ? (
                                    <ClozeEditor
                                        question={question as QuestionCloze}
                                        onChange={(updated) => {
                                            setQuestion(updated);
                                            // Also update JSON mirror
                                            const { id, type, prompt, ...rest } = updated;
                                            setSpecificsJson(JSON.stringify(rest, null, 2));
                                        }}
                                    />
                                ) : question.type === 'MATCH' ? (
                                    <MatchEditor
                                        question={question as QuestionMatch}
                                        onChange={(updated) => {
                                            setQuestion(updated);
                                            const { id, type, prompt, ...rest } = updated;
                                            setSpecificsJson(JSON.stringify(rest, null, 2));
                                        }}
                                    />
                                ) : question.type === 'INPUT' ? (
                                    <InputEditor
                                        question={question as QuestionInput}
                                        onChange={(updated) => {
                                            setQuestion(updated);
                                            const { id, type, prompt, ...rest } = updated;
                                            setSpecificsJson(JSON.stringify(rest, null, 2));
                                        }}
                                    />
                                ) : question.type === 'SELECT_CODE' ? (
                                    <SelectCodeEditor
                                        question={question as QuestionSelectCode}
                                        onChange={(updated) => {
                                            setQuestion(updated);
                                            const { id, type, prompt, ...rest } = updated;
                                            setSpecificsJson(JSON.stringify(rest, null, 2));
                                        }}
                                    />
                                ) : question.type === 'SELECT_FORMULA' ? (
                                    <SelectFormulaEditor
                                        question={question as QuestionSelectFormula}
                                        onChange={(updated) => {
                                            setQuestion(updated);
                                            const { id, type, prompt, ...rest } = updated;
                                            setSpecificsJson(JSON.stringify(rest, null, 2));
                                        }}
                                    />
                                ) : question.type === 'ARRANGE' ? (
                                    <ArrangeEditor
                                        question={question as QuestionArrange}
                                        onChange={(updated) => {
                                            setQuestion(updated);
                                            const { id, type, prompt, ...rest } = updated;
                                            setSpecificsJson(JSON.stringify(rest, null, 2));
                                        }}
                                    />
                                ) : (
                                    <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                                        <p>Visual editor not available for <strong>{(question as { type: string }).type}</strong> yet.</p>
                                        <Button variant="ghost" onClick={() => setViewMode('json')}>Use JSON Editor</Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {jsonError && <span className="text-red-500 text-xs block text-right">{jsonError}</span>}
                                <textarea
                                    value={specificsJson}
                                    onChange={(e) => handleSpecificsChange(e.target.value)}
                                    className={`w-full h-[400px] font-mono text-sm p-4 border rounded-lg outline-none transition-all ${jsonError ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'}`}
                                />
                                <p className="text-xs text-gray-400">
                                    Edit type-specific fields like <code>model</code>, <code>choices</code>, etc. here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar / Meta */}
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-2">Metadata</h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-gray-500 block text-xs uppercase">Type</span>
                                <span className="font-mono bg-white px-2 py-0.5 rounded border">{question.type}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-xs uppercase">ID</span>
                                <span className="font-mono text-gray-700">{question.id}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                        <p>
                            <strong>Tip:</strong> Use the "Specific Details" JSON editor to modify lists, pairs, and complex structures.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
