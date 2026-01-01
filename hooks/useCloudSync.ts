'use client';

import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useProgressStore } from '@/store/useProgressStore';
import type { User } from '@supabase/supabase-js';

interface CloudProgress {
    xp: number;
    streak: number;
    last_active_date: string | null;
    completed_lessons: Record<string, { score: number; completedAt: string }>;
    unlocked_units: string[];
    hearts: number;
    max_hearts: number;
    name: string | null;
}

export function useCloudSync() {
    const store = useProgressStore();

    const syncToCloud = useCallback(async (user: User) => {
        const { error } = await supabase
            .from('user_progress')
            .upsert({
                user_id: user.id,
                xp: store.xp,
                streak: store.streak,
                last_active_date: store.lastActiveDate,
                completed_lessons: store.completedLessons,
                unlocked_units: store.unlockedUnits,
                hearts: store.hearts,
                max_hearts: store.maxHearts,
                name: store.name,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

        if (error) {
            console.error('Failed to sync to cloud:', error);
            return false;
        }
        return true;
    }, [store]);

    const syncFromCloud = useCallback(async (user: User) => {
        const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No record found, create one with local data
                await syncToCloud(user);
                return true;
            }
            console.error('Failed to sync from cloud:', error);
            return false;
        }

        if (data) {
            const cloudData = data as CloudProgress & { user_id: string; updated_at: string };
            // Restore from cloud
            useProgressStore.setState({
                xp: cloudData.xp,
                streak: cloudData.streak,
                lastActiveDate: cloudData.last_active_date,
                completedLessons: cloudData.completed_lessons,
                unlockedUnits: cloudData.unlocked_units,
                hearts: cloudData.hearts,
                maxHearts: cloudData.max_hearts,
                name: cloudData.name,
            });
        }
        return true;
    }, [syncToCloud]);

    return { syncToCloud, syncFromCloud };
}
