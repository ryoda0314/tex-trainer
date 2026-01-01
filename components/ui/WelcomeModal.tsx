'use client';

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useProgressStore } from "@/store/useProgressStore";

// Minimal Dialog UI since we don't have a full UI library setup for it yet
// Or we can build a custom modal using fixed positioning if Dialog is not available.
// Given previous files imports, I don't see shadcn Dialog in the file list I've explored deeply,
// but let's check if I can implement a simple custom modal to avoid dependencies issues.

export function WelcomeModal() {
    const { name, setName } = useProgressStore();
    const [tempName, setTempName] = useState("");

    // If name is already set, don't show
    if (name) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tempName.trim()) {
            setName(tempName.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-duo-green-face p-6 text-center">
                    <h2 className="text-2xl font-bold text-white">Welcome!</h2>
                    <p className="text-white/90 mt-2">Let's get verified.</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-bold text-gray-700 uppercase tracking-widest">
                                What's your name?
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="w-full text-lg p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-duo-blue-face outline-none transition-colors text-center font-bold text-gray-700"
                                placeholder="Your Name"
                                autoFocus
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-4 text-xl shadow-lg border-b-4"
                            disabled={!tempName.trim()}
                        >
                            Start Learning
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
