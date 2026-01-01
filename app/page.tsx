'use client';

import { useProgressStore } from '@/store/useProgressStore';
import { unit1 } from '@/lib/content/unit1';
import { unit2 } from '@/lib/content/unit2';
import { unit3 } from '@/lib/content/unit3';
import { Button } from '@/components/ui/Button';
import { Lock, Star, Zap, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Unit } from '@/lib/types';
import { useEffect, useState } from 'react';

// Unit Component
function UnitSection({ unit, unlocked, completedLessons }: { unit: Unit, unlocked: boolean, completedLessons: Record<string, any> }) {
  const router = useRouter();

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-md mx-auto mb-10", !unlocked && "opacity-60 grayscale")}>
      <div className={cn("p-4 rounded-2xl text-white flex justify-between items-center shadow-lg",
        unlocked ? "bg-duo-green-face" : "bg-duo-gray-side")}>
        <div>
          <h2 className="text-xl font-bold">{unit.title}</h2>
          <p className="opacity-90">{unit.description}</p>
        </div>
        {!unlocked && <Lock />}
      </div>

      <div className="flex flex-col items-center gap-4 relative">
        {unit.lessons.map((lesson, idx) => {
          const isCompleted = completedLessons[lesson.id]?.score >= lesson.threshold;
          // Logic for unlocking next: assuming sequential for now or previous completed
          // For MVP simplicity: Lesson 1 always open in Unit 1. 
          // Subsequent lessons open if previous completed.

          // But in UnitSection prop we know if UNIT is unlocked.
          // If unit unlocked, check lesson sequence.
          // Lesson 0 always open. Lesson N open if Lesson N-1 completed.

          // Global logic:
          let isAvailable = unlocked;
          if (idx > 0) {
            const prevId = unit.lessons[idx - 1].id;
            if (!completedLessons[prevId] || completedLessons[prevId].score < 0.8) {
              isAvailable = false;
            }
          }

          return (
            <div key={lesson.id} className="relative z-10">
              <Button
                variant={isCompleted ? 'correct' : isAvailable ? 'primary' : 'locked'}
                className={cn("w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-xl border-b-8 mb-2 ring-8 ring-white",
                  !isAvailable && "bg-duo-gray-face text-duo-gray-side border-duo-gray-side"
                )}
                onClick={() => {
                  if (isAvailable) router.push(`/lesson/${lesson.id}`);
                }}
              >
                {isCompleted ? <Star className="fill-white" /> : (idx + 1)}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  // Prevent hydration mismatch by waiting for mount
  const [mounted, setMounted] = useState(false);
  const { xp, streak, completedLessons } = useProgressStore();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="p-10">Loading...</div>;

  const units = [unit1, unit2, unit3];
  // Unlock logic: Unit 1 open. Unit 2 open if Unit 1 finished.
  // Finished unit = all lessons completed > 0.8?
  const isUnitCompleted = (u: Unit) => u.lessons.every(l => (completedLessons[l.id]?.score || 0) >= 0.8);

  const unit1Done = isUnitCompleted(unit1);
  const unit2Done = isUnitCompleted(unit2);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 bg-white/90 backdrop-blur border-b z-50 px-4 py-2 flex justify-center gap-8">
        <Link href="/admin/problems" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <Shield size={20} />
        </Link>
        <div className="flex items-center gap-2">
          <Star className="text-duo-yellow-face fill-current" />
          <span className="font-bold text-duo-yellow-face">{xp} XP</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="text-duo-red-face fill-current" />
          <span className="font-bold text-duo-red-face">{streak}</span>
        </div>
      </div>

      <main className="p-6 pt-10">
        <UnitSection unit={unit1} unlocked={true} completedLessons={completedLessons} />
        <UnitSection unit={unit2} unlocked={unit1Done} completedLessons={completedLessons} />
        <UnitSection unit={unit3} unlocked={unit2Done} completedLessons={completedLessons} />
      </main>
    </div>
  );
}
