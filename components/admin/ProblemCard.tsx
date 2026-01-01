import { useState } from "react";
import { Question } from "@/lib/types";
import { Copy, Eye, Pencil } from "lucide-react";
import Link from 'next/link';
import { ProblemPreview } from "./ProblemPreview";
import { Modal } from "@/components/ui/Modal";

interface ProblemCardProps {
    question: Question;
}

export function ProblemCard({ question }: ProblemCardProps) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-xs font-mono rounded text-gray-600">
                            {question.type}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">{question.id}</span>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setIsPreviewOpen(true)}
                            className="p-1.5 rounded transition-colors text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                            title="Preview Problem"
                        >
                            <Eye size={14} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded" title="Copy ID">
                            <Copy size={14} />
                        </button>
                        <Link
                            href={`/admin/problems/${question.id}`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Problem"
                        >
                            <Pencil size={14} />
                        </Link>
                    </div>
                </div>

                <div className="mb-3">
                    <p className="font-medium text-gray-800">{question.prompt}</p>
                </div>

                <div className="flex-1 bg-gray-50 p-3 rounded text-sm text-gray-700 space-y-2 relative overflow-hidden">
                    {renderSpecificDetails(question)}
                </div>
            </div>

            {/* Modal Preview */}
            <Modal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                title={`Preview: ${question.id}`}
            >
                <ProblemPreview question={question} />
            </Modal>
        </>
    );
}

function renderSpecificDetails(question: Question) {
    switch (question.type) {
        case "SELECT_CODE":
            return (
                <>
                    <div className="flex gap-2">
                        <span className="font-semibold text-gray-500 text-xs uppercase w-12 shrink-0">
                            Formula
                        </span>
                        <code className="bg-white px-1 rounded border overflow-x-auto">{question.formula}</code>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold text-gray-500 text-xs uppercase w-12 shrink-0">
                            Answer
                        </span>
                        <code className="text-green-600 font-bold">{question.correctAnalysis}</code>
                    </div>
                </>
            );

        case "SELECT_FORMULA":
            return (
                <>
                    <div className="flex gap-2">
                        <span className="font-semibold text-gray-500 text-xs uppercase w-12 shrink-0">
                            Code
                        </span>
                        <code className="bg-white px-1 rounded border overflow-x-auto">{question.code}</code>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold text-gray-500 text-xs uppercase w-12 shrink-0">
                            Answer
                        </span>
                        <span className="text-green-600 font-serif italic">{question.correctAnalysis}</span>
                    </div>
                </>
            );

        case "MATCH":
            return (
                <div className="grid grid-cols-2 gap-2">
                    {question.pairs.map((pair, i) => (
                        <div key={i} className="flex justify-between border-b last:border-0 pb-1 border-gray-200">
                            <span className="font-serif">{pair.tex}</span>
                            <code className="text-xs bg-white px-1">{pair.code}</code>
                        </div>
                    ))}
                </div>
            );

        case "CLOZE":
            return (
                <>
                    <div className="flex gap-2">
                        <span className="font-semibold text-gray-500 text-xs uppercase w-12 shrink-0">
                            Template
                        </span>
                        <code className="bg-white px-1 rounded border break-all">{question.template}</code>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {question.segments.map((s, i) => (
                            <span key={i} className={`px-1 rounded text-xs border ${s.type === 'blank' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-gray-100 border-gray-200'}`}>
                                {s.content}
                            </span>
                        ))}
                    </div>
                </>
            );

        case "ARRANGE":
            return (
                <>
                    <div className="flex gap-2 items-center">
                        <span className="font-semibold text-gray-500 text-xs uppercase w-12 shrink-0">Target</span>
                        <div className="flex gap-1 flex-wrap">
                            {question.correctSequence.map((c, i) => (
                                <span key={i} className="px-1 bg-green-50 text-green-700 border border-green-200 rounded text-xs">{c}</span>
                            ))}
                        </div>
                    </div>
                </>
            )

        case "INPUT":
            return (
                <>
                    <div className="flex gap-2">
                        <span className="font-semibold text-gray-500 text-xs uppercase w-12 shrink-0">Formula</span>
                        <span className="font-serif">{question.formula || "(No visual)"}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <span className="font-semibold text-gray-500 text-xs uppercase w-12 shrink-0">Valid</span>
                        {question.acceptable.map((acc, i) => (
                            <code key={i} className="text-green-600 text-xs bg-green-50 px-1 rounded">{acc}</code>
                        ))}
                    </div>
                </>
            )

        default:
            return <div className="text-xs text-gray-400">Details not available for this type</div>;
    }
}
