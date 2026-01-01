import { create } from 'zustand';
import { Question } from '@/lib/types';

interface LessonState {
    currentQuestionIndex: number;
    hearts: number;
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
    hearts: 3, // Optional, can be infinite for this MVP
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
        hearts: 3
    }),

    submitAnswer: (isCorrect, feedback) => set((state) => ({
        isCorrect,
        hearts: isCorrect ? state.hearts : Math.max(0, state.hearts - 1),
        feedbackMessage: feedback || (isCorrect ? "Correct!" : "Try again"),
        mistakes: isCorrect ? state.mistakes : [...state.mistakes, state.lessonQuestions[state.currentQuestionIndex].id]
    })),

    nextQuestion: () => set((state) => ({
        currentQuestionIndex: state.currentQuestionIndex + 1,
        isCorrect: null,
        feedbackMessage: null,
        selectedAnswer: null
    })),

    setSelection: (selection) => set({ selectedAnswer: selection })
}));
