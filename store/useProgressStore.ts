import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProgress } from '@/lib/types';

interface ProgressState extends UserProgress {
    setName: (name: string) => void;
    addXp: (amount: number) => void;
    decrementHeart: () => void;
    refillHearts: () => void;
    completeLesson: (lessonId: string, score: number) => void;
    updateStreak: () => void;
}

export const useProgressStore = create<ProgressState>()(
    persist(
        (set, get) => ({
            xp: 0,
            streak: 0,
            lastActiveDate: null,
            completedLessons: {},
            unlockedUnits: ['unit1'], // Unit 1 unlocked by default
            name: null,
            hearts: 5,
            maxHearts: 5,

            setName: (name) => set({ name }),

            addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

            decrementHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),

            refillHearts: () => set((state) => ({ hearts: state.maxHearts })),

            completeLesson: (lessonId, score) => set((state) => {
                const existing = state.completedLessons[lessonId];
                // Only update if better score or not exists
                if (!existing || score > existing.score) {
                    return {
                        completedLessons: {
                            ...state.completedLessons,
                            [lessonId]: { score, completedAt: new Date().toISOString() }
                        }
                    };
                }
                return state;
            }),

            updateStreak: () => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                const last = state.lastActiveDate ? state.lastActiveDate.split('T')[0] : null;

                if (today === last) return {}; // Already active today

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (last === yesterdayStr) {
                    // Streak continues
                    return { streak: state.streak + 1, lastActiveDate: new Date().toISOString() };
                } else {
                    // Streak broken (or first time)
                    return { streak: 1, lastActiveDate: new Date().toISOString() };
                }
            }),
        }),
        {
            name: 'tex-trainer-progress',
        }
    )
);
