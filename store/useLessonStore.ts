import { create } from 'zustand';
import { Question } from '@/lib/types';

interface LessonState {
    currentQuestionIndex: number;
    // hearts: number; (Removed)
    isCorrect: boolean | null; // null = pending, true = correct, false = wrong
    feedbackMessage: string | null;
    selectedAnswer: any; // Generic to hold selection state
    lessonQuestions: Question[];
    mistakes: string[]; // IDs of missed questions

    initLesson: (questions: Question[]) => void;
    submitAnswer: (isCorrect: boolean, feedback?: string) => void;
    nextQuestion: () => void;
    setSelection: (selection: any) => void;
}

export const useLessonStore = create<LessonState>((set) => ({
    currentQuestionIndex: 0,
    // hearts: 3, (Removed)
    isCorrect: null,
    feedbackMessage: null,
    selectedAnswer: null,
    lessonQuestions: [],
    mistakes: [],

    initLesson: (questions) => set({
        currentQuestionIndex: 0,
        lessonQuestions: questions,
        isCorrect: null,
        feedbackMessage: null,
        selectedAnswer: null,
        mistakes: [],
        // Removed local hearts init
    }),

    submitAnswer: (isCorrect, feedback) => {
        // If incorrect, deduct global heart
        if (!isCorrect) {
            // We need to import the store directly to use it inside another store's action purely? 
            // Or just call it. accessing get()... isn't cross-store.
            // Best practice: Component calls both, OR import the store instance.
            // Since we are in a vanilla function inside create(), we can import the other store.
            const { useProgressStore } = require('./useProgressStore');
            useProgressStore.getState().decrementHeart();
        }

        set((state) => ({
            isCorrect,
            feedbackMessage: feedback || (isCorrect ? "Correct!" : "Try again"),
            mistakes: isCorrect ? state.mistakes : [...state.mistakes, state.lessonQuestions[state.currentQuestionIndex].id]
        }));
    },

    nextQuestion: () => set((state) => ({
        currentQuestionIndex: state.currentQuestionIndex + 1,
        isCorrect: null,
        feedbackMessage: null,
        selectedAnswer: null
    })),

    setSelection: (selection) => set({ selectedAnswer: selection })
}));
