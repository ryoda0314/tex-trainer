'use client';

import { QuestionArrange, ArrangeTile } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Plus, Trash, ArrowUp, ArrowDown, Eye, Copy, Shuffle } from "lucide-react";
import { KatexRenderer } from "@/components/ui/KatexRenderer";
import { cn } from "@/lib/utils";

interface ArrangeEditorProps {
    question: QuestionArrange;
    onChange: (updated: QuestionArrange) => void;
}

export function ArrangeEditor({ question, onChange }: ArrangeEditorProps) {
    const update = (updates: Partial<QuestionArrange>) => {
        onChange({ ...question, ...updates });
    };

    // Helper to create a new tile
    const createTile = (content: string = ''): ArrangeTile => ({
        id: Math.random().toString(36).substr(2, 9),
        content,
        type: 'atom' // Default, simple logic
    });

    // -- Solution Tiles Management --
    const addSolutionTile = () => {
        const newTiles = [...question.initialTiles, createTile()];
        updateFromTiles(newTiles, question.distractors || []);
    };

    const removeSolutionTile = (index: number) => {
        const newTiles = [...question.initialTiles];
        newTiles.splice(index, 1);
        updateFromTiles(newTiles, question.distractors || []);
    };

    const updateSolutionTile = (index: number, content: string) => {
        const newTiles = [...question.initialTiles];
        newTiles[index] = { ...newTiles[index], content };
        updateFromTiles(newTiles, question.distractors || []);
    };

    const moveSolutionTile = (index: number, direction: 'up' | 'down') => {
        const newTiles = [...question.initialTiles];
        if (direction === 'up' && index > 0) {
            [newTiles[index], newTiles[index - 1]] = [newTiles[index - 1], newTiles[index]];
        } else if (direction === 'down' && index < newTiles.length - 1) {
            [newTiles[index], newTiles[index + 1]] = [newTiles[index + 1], newTiles[index]];
        }
        updateFromTiles(newTiles, question.distractors || []);
    };

    // -- Distractors Management --
    const addDistractor = () => {
        const currentDistractors = question.distractors || [];
        const newDistractors = [...currentDistractors, createTile()];
        updateFromTiles(question.initialTiles, newDistractors);
    };

    const removeDistractor = (index: number) => {
        const newDistractors = [...(question.distractors || [])];
        newDistractors.splice(index, 1);
        updateFromTiles(question.initialTiles, newDistractors);
    };

    const updateDistractor = (index: number, content: string) => {
        const newDistractors = [...(question.distractors || [])];
        newDistractors[index] = { ...newDistractors[index], content };
        updateFromTiles(question.initialTiles, newDistractors);
    };

    // Central update helper to keep correctSequence in sync with initialTiles
    const updateFromTiles = (tiles: ArrangeTile[], distractors: ArrangeTile[]) => {
        update({
            initialTiles: tiles,
            distractors: distractors,
            // correctSequence is directly derived from the order of initialTiles (the solution tiles)
            correctSequence: tiles.map(t => t.content)
        });
    };

    // -- Alternative Sequences Management --
    const addAlternativeSequence = () => {
        // Copy current sequence as a starting point
        const current = question.alternativeSequences || [];
        const newSeq = [...question.correctSequence];
        update({ alternativeSequences: [...current, newSeq] });
    };

    const removeAlternativeSequence = (index: number) => {
        const current = [...(question.alternativeSequences || [])];
        current.splice(index, 1);
        update({ alternativeSequences: current.length > 0 ? current : undefined });
    };

    const updateAlternativeSequence = (seqIndex: number, tileIndex: number, value: string) => {
        const current = [...(question.alternativeSequences || [])];
        const seq = [...current[seqIndex]];
        seq[tileIndex] = value;
        current[seqIndex] = seq;
        update({ alternativeSequences: current });
    };

    const moveAltTile = (seqIndex: number, tileIndex: number, direction: 'up' | 'down') => {
        const current = [...(question.alternativeSequences || [])];
        const seq = [...current[seqIndex]];
        if (direction === 'up' && tileIndex > 0) {
            [seq[tileIndex], seq[tileIndex - 1]] = [seq[tileIndex - 1], seq[tileIndex]];
        } else if (direction === 'down' && tileIndex < seq.length - 1) {
            [seq[tileIndex], seq[tileIndex + 1]] = [seq[tileIndex + 1], seq[tileIndex]];
        }
        current[seqIndex] = seq;
        update({ alternativeSequences: current });
    };

    // Derived preview of the goal
    const goalTeX = question.correctSequence.join('');

    return (
        <div className="space-y-6 border border-gray-100 rounded-xl p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-4">Arrange Question Details</h3>

            <div className="grid grid-cols-1 gap-6">

                {/* Goal Preview */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Eye size={16} /> Goal Preview
                    </label>
                    <p className="text-xs text-gray-500">This is what the "Goal" section will display based on the solution sequence.</p>
                    <div className="p-6 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg min-h-[100px]">
                        {goalTeX ? (
                            <KatexRenderer tex={goalTeX} className="text-2xl" />
                        ) : (
                            <span className="text-gray-400 italic">Add solution tiles to generate preview</span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Solution Sequence */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-700">Correct Sequence (Solution)</label>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:bg-blue-50"
                                onClick={addSolutionTile}
                            >
                                <Plus size={14} className="mr-1" /> Add Tile
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                            Define the correct order of tiles. These will form the goal.
                        </p>

                        <div className="space-y-2">
                            {question.initialTiles.map((tile, index) => (
                                <div key={tile.id} className="flex gap-2 items-center group">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => moveSolutionTile(index, 'up')}
                                            disabled={index === 0}
                                            className="text-gray-300 hover:text-blue-500 disabled:opacity-0 transition-colors"
                                        >
                                            <ArrowUp size={12} />
                                        </button>
                                        <button
                                            onClick={() => moveSolutionTile(index, 'down')}
                                            disabled={index === question.initialTiles.length - 1}
                                            className="text-gray-300 hover:text-blue-500 disabled:opacity-0 transition-colors"
                                        >
                                            <ArrowDown size={12} />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={tile.content}
                                        onChange={(e) => updateSolutionTile(index, e.target.value)}
                                        className="flex-1 p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm text-center font-bold"
                                        placeholder="x"
                                    />
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeSolutionTile(index)}
                                        className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
                                    >
                                        <Trash size={14} />
                                    </Button>
                                </div>
                            ))}
                            {question.initialTiles.length === 0 && (
                                <div className="text-center p-4 border border-dashed rounded text-gray-400 text-sm">
                                    No tiles. Add tiles to build the solution.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Distractors */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-700">Distractors (Fake Tiles)</label>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-orange-600 hover:bg-orange-50"
                                onClick={addDistractor}
                            >
                                <Plus size={14} className="mr-1" /> Add Distractor
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                            Extra tiles that are not part of the solution, used to confuse the user.
                        </p>

                        <div className="space-y-2">
                            {(question.distractors || []).map((tile, index) => (
                                <div key={tile.id} className="flex gap-2 items-center group">
                                    <input
                                        type="text"
                                        value={tile.content}
                                        onChange={(e) => updateDistractor(index, e.target.value)}
                                        className="flex-1 p-2 border border-orange-100 bg-orange-50/30 rounded focus:ring-2 focus:ring-orange-500 outline-none font-mono text-sm text-center font-bold text-gray-600"
                                        placeholder="y"
                                    />
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeDistractor(index)}
                                        className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
                                    >
                                        <Trash size={14} />
                                    </Button>
                                </div>
                            ))}
                            {(!question.distractors || question.distractors.length === 0) && (
                                <div className="text-center p-4 border border-dashed rounded text-gray-400 text-sm">
                                    No distractors.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Alternative Sequences */}
                <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Shuffle size={16} /> Alternative Sequences (順不同)
                        </label>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple-600 hover:bg-purple-50"
                            onClick={addAlternativeSequence}
                            disabled={question.correctSequence.length === 0}
                        >
                            <Copy size={14} className="mr-1" /> Add Alternative
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                        追加の正解パターン（例: a_n^2 と a^2_n の両方を正解にする場合）
                    </p>

                    <div className="space-y-4">
                        {(question.alternativeSequences || []).map((seq, seqIndex) => (
                            <div key={seqIndex} className="p-4 border border-purple-100 bg-purple-50/30 rounded-lg space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-purple-600">Alternative #{seqIndex + 1}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 font-mono">
                                            {seq.join('')}
                                        </span>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removeAlternativeSequence(seqIndex)}
                                            className="h-6 w-6 p-0"
                                        >
                                            <Trash size={12} />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {seq.map((tile, tileIndex) => (
                                        <div key={tileIndex} className="flex items-center gap-1">
                                            <button
                                                onClick={() => moveAltTile(seqIndex, tileIndex, 'up')}
                                                disabled={tileIndex === 0}
                                                className="text-gray-300 hover:text-purple-500 disabled:opacity-30"
                                            >
                                                ←
                                            </button>
                                            <input
                                                type="text"
                                                value={tile}
                                                onChange={(e) => updateAlternativeSequence(seqIndex, tileIndex, e.target.value)}
                                                className="w-16 p-1 border border-purple-200 rounded focus:ring-2 focus:ring-purple-500 outline-none font-mono text-xs text-center font-bold"
                                            />
                                            <button
                                                onClick={() => moveAltTile(seqIndex, tileIndex, 'down')}
                                                disabled={tileIndex === seq.length - 1}
                                                className="text-gray-300 hover:text-purple-500 disabled:opacity-30"
                                            >
                                                →
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {(!question.alternativeSequences || question.alternativeSequences.length === 0) && (
                            <div className="text-center p-4 border border-dashed border-purple-200 rounded text-gray-400 text-sm">
                                No alternative sequences. Add one to allow multiple correct orders.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

