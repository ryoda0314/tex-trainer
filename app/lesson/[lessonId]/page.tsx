'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { unit1 } from '@/lib/content/unit1';
import { unit2 } from '@/lib/content/unit2';
import { unit3 } from '@/lib/content/unit3';
import { Lesson } from '@/lib/types';
import { LessonRunner } from '@/components/lesson/LessonRunner';
import { useProgressStore } from '@/store/useProgressStore';

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const { completeLesson, xp } = useProgressStore();

    // Find Lesson
    // Hardcoded lookup for MVP
    const allLessons = [
        ...unit1.lessons,
        ...unit2.lessons,
        ...unit3.lessons
    ];

    const lessonId = params.lessonId as string;
    const [lesson, setLesson] = useState<Lesson | null>(null);

    useEffect(() => {
        const found = allLessons.find(l => l.id === lessonId);
        if (found) {
            setLesson(found);
        }
    }, [lessonId]);

    if (!lesson) return <div className="p-10">Loading Lesson {lessonId}...</div>;

    const handleComplete = (score: number) => {
        completeLesson(lessonId, score);
        // Navigate to results
        router.push(`/result/${lessonId}?score=${score}`);
    };

    return <LessonRunner lessonId={lesson.id} initialQuestions={lesson.questions} onComplete={handleComplete} />;
}
