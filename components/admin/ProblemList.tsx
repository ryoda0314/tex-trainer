'use client';

import { Question, QuestionType } from "@/lib/types";
import { useState } from "react";
import { ProblemCard } from "./ProblemCard";
import { Filter, Layers } from "lucide-react";

interface ProblemListProps {
    questions: Question[];
}

const ALL_TYPES: (QuestionType | 'ALL')[] = [
    'ALL',
    'SELECT_CODE',
    'SELECT_FORMULA',
    'MATCH',
    'CLOZE',
    'ARRANGE',
    'INPUT'
];

export function ProblemList({ questions }: ProblemListProps) {
    const [filter, setFilter] = useState<QuestionType | 'ALL'>('ALL');

    const filteredQuestions = filter === 'ALL'
        ? questions
        : questions.filter(q => q.type === filter);

    // Group count for badges
    const counts = questions.reduce((acc, q) => {
        acc[q.type] = (acc[q.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-100">
                {ALL_TYPES.map(type => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`
                            px-4 py-2 rounded-full text-sm font-medium transition-all
                            flex items-center gap-2
                            ${filter === type
                                ? 'bg-primary text-white shadow-md ring-2 ring-primary/20'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}
                        `}
                    >
                        {type === 'ALL' ? <Layers size={14} /> : null}
                        {type === 'ALL' ? 'All Problems' : type.replace('_', ' ')}
                        <span className={`
                             ml-1 text-xs px-1.5 py-0.5 rounded-full
                             ${filter === type ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}
                        `}>
                            {type === 'ALL' ? questions.length : counts[type as string] || 0}
                        </span>
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredQuestions.map(q => (
                    <ProblemCard key={q.id} question={q} />
                ))}
            </div>

            {filteredQuestions.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <Filter size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No problems found for this category.</p>
                </div>
            )}
        </div>
    );
}
