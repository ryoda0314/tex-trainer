import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProgress } from '@/lib/types';

// Heart regeneration: 1 heart every 5 minutes (in milliseconds)
const HEART_REGEN_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_SHARE_HEARTS_PER_DAY = 3;

interface ProgressState extends UserProgress {
    lastHeartLossAt: string | null; // ISO timestamp when hearts were last lost
    shareHeartsToday: number; // Hearts earned from sharing today
    lastShareDate: string | null; // Date of last share (YYYY-MM-DD)

    setName: (name: string) => void;
    addXp: (amount: number) => void;
    decrementHeart: () => void;
    refillHearts: () => void;
    completeLesson: (lessonId: string, score: number) => void;
    updateStreak: () => void;
    checkHeartRegen: () => void; // Check and apply heart regeneration
    getTimeUntilNextHeart: () => number | null; // Returns ms until next heart, or null if full
    shareForHeart: () => { success: boolean; remaining: number }; // Share to earn heart
    getShareHeartsRemaining: () => number; // Get remaining share hearts for today
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
            lastHeartLossAt: null,

            setName: (name) => set({ name }),

            addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

            decrementHeart: () => set((state) => {
                if (state.hearts <= 0) return state;
                return {
                    hearts: state.hearts - 1,
                    lastHeartLossAt: new Date().toISOString()
                };
            }),

            refillHearts: () => set((state) => ({
                hearts: state.maxHearts,
                lastHeartLossAt: null // Clear timer when manually refilled
            })),

            checkHeartRegen: () => set((state) => {
                if (state.hearts >= state.maxHearts) return state;
                if (!state.lastHeartLossAt) return state;

                const now = Date.now();
                const lastLoss = new Date(state.lastHeartLossAt).getTime();
                const elapsed = now - lastLoss;
                const heartsToRegen = Math.floor(elapsed / HEART_REGEN_INTERVAL_MS);

                if (heartsToRegen > 0) {
                    const newHearts = Math.min(state.maxHearts, state.hearts + heartsToRegen);
                    const isFull = newHearts >= state.maxHearts;

                    return {
                        hearts: newHearts,
                        // Update lastHeartLossAt to account for partial time remaining
                        lastHeartLossAt: isFull ? null : new Date(lastLoss + heartsToRegen * HEART_REGEN_INTERVAL_MS).toISOString()
                    };
                }
                return state;
            }),

            getTimeUntilNextHeart: () => {
                const state = get();
                if (state.hearts >= state.maxHearts) return null;
                if (!state.lastHeartLossAt) return null;

                const now = Date.now();
                const lastLoss = new Date(state.lastHeartLossAt).getTime();
                const elapsed = now - lastLoss;
                const remaining = HEART_REGEN_INTERVAL_MS - (elapsed % HEART_REGEN_INTERVAL_MS);

                return remaining;
            },

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

            // Share for hearts
            shareHeartsToday: 0,
            lastShareDate: null,

            shareForHeart: () => {
                const state = get();
                const today = new Date().toISOString().split('T')[0];

                // Reset counter if new day
                let sharesToday = state.shareHeartsToday;
                if (state.lastShareDate !== today) {
                    sharesToday = 0;
                }

                // Check if limit reached
                if (sharesToday >= MAX_SHARE_HEARTS_PER_DAY) {
                    return { success: false, remaining: 0 };
                }

                // Check if hearts already full
                if (state.hearts >= state.maxHearts) {
                    return { success: false, remaining: MAX_SHARE_HEARTS_PER_DAY - sharesToday };
                }

                // Grant heart
                set({
                    hearts: Math.min(state.maxHearts, state.hearts + 1),
                    shareHeartsToday: sharesToday + 1,
                    lastShareDate: today
                });

                return { success: true, remaining: MAX_SHARE_HEARTS_PER_DAY - sharesToday - 1 };
            },

            getShareHeartsRemaining: () => {
                const state = get();
                const today = new Date().toISOString().split('T')[0];

                if (state.lastShareDate !== today) {
                    return MAX_SHARE_HEARTS_PER_DAY;
                }
                return Math.max(0, MAX_SHARE_HEARTS_PER_DAY - state.shareHeartsToday);
            },
        }),
        {
            name: 'tex-trainer-progress',
        }
    )
);

// Export the regen interval for UI usage
export const HEART_REGEN_INTERVAL = HEART_REGEN_INTERVAL_MS;
export const MAX_SHARE_HEARTS = MAX_SHARE_HEARTS_PER_DAY;

