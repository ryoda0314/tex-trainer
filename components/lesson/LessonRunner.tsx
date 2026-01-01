'use client';

import { useEffect, useState, useRef } from 'react';
import { useLessonStore } from '@/store/useLessonStore';
import { useProgressStore } from '@/store/useProgressStore';
import { Question } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { LessonHeader } from './LessonHeader';
import { FeedbackSheet } from './FeedbackSheet';
import { QuestionSelect } from '@/components/lesson/QuestionSelect';
import { QuestionMatch } from '@/components/lesson/QuestionMatch';
import { QuestionCloze } from '@/components/lesson/QuestionCloze';
import { QuestionArrange } from '@/components/lesson/QuestionArrange';
import { QuestionInput } from '@/components/lesson/QuestionInput';
import { GameOverScreen } from './GameOverScreen';
import { useRouter } from 'next/navigation';

interface LessonRunnerProps {
    lessonId: string;
    initialQuestions: Question[];
    onComplete: (score: number) => void;
}

export function LessonRunner({ lessonId, initialQuestions, onComplete }: LessonRunnerProps) {
    const router = useRouter();
    const {
        currentQuestionIndex, lessonQuestions, isCorrect, feedbackMessage,
        selectedAnswer, initLesson, submitAnswer, nextQuestion
    } = useLessonStore();

    const { hearts, decrementHeart, refillHearts } = useProgressStore();

    const [hasStarted, setHasStarted] = useState(false);
    const completionHandled = useRef(false);

    useEffect(() => {
        initLesson(initialQuestions);
        setHasStarted(true);
        completionHandled.current = false; // Reset on new lesson
    }, [lessonId, initialQuestions, initLesson]);

    const isFinished = currentQuestionIndex >= lessonQuestions.length;

    useEffect(() => {
        if (hasStarted && isFinished && !completionHandled.current) {
            completionHandled.current = true;
            onComplete(1.0);
        }
    }, [isFinished, onComplete, hasStarted]);

    if (!hasStarted) return null;

    // Game Over Check
    if (hearts <= 0) {
        return <GameOverScreen onRetry={() => {/* Hearts refilled in GameOverScreen, just re-render */ }} />;
    }

    const currentQuestion = lessonQuestions[currentQuestionIndex];

    if (isFinished) return <div className="p-10 flex justify-center">Lesson Complete!</div>;

    const handleCheck = () => {
        if (isCorrect !== null) return;

        if (!selectedAnswer) return;

        // Grading Logic
        let isAnsCorrect = false;

        switch (currentQuestion.type) {
            case 'SELECT_CODE':
            case 'SELECT_FORMULA':
                isAnsCorrect = selectedAnswer === currentQuestion.correctAnalysis;
                break;
            case 'MATCH':
                isAnsCorrect = selectedAnswer === true;
                break;
            case 'CLOZE':
                isAnsCorrect = checkGenericAnswer(currentQuestion, selectedAnswer);
                break;
            case 'ARRANGE':
                isAnsCorrect = checkGenericAnswer(currentQuestion, selectedAnswer);
                break;
            case 'INPUT':
                isAnsCorrect = checkGenericAnswer(currentQuestion, selectedAnswer);
                break;
        }

        submitAnswer(isAnsCorrect, isAnsCorrect ? undefined : "Incorrect, try again!");
    };

    const handleContinue = () => {
        if (isCorrect === true) {
            // Correct: move to next question
            nextQuestion();
        } else {
            // Incorrect: allow retry by resetting state (but don't advance)
            // Heart already deducted in submitAnswer
            useLessonStore.getState().resetForRetry();
        }
    };

    // Dispatcher
    const renderQuestion = () => {
        switch (currentQuestion.type) {
            case 'SELECT_CODE':
            case 'SELECT_FORMULA':
                return <QuestionSelect question={currentQuestion} onCheck={handleCheck} />;
            case 'MATCH':
                return (
                    <QuestionMatch
                        question={currentQuestion}
                        onStatusChange={(done: boolean) => { if (done) submitAnswer(true); }}
                        onMistake={() => decrementHeart()}
                    />
                );
            case 'CLOZE':
                return <QuestionCloze question={currentQuestion} />;
            case 'ARRANGE':
                return <QuestionArrange question={currentQuestion} />;
            case 'INPUT':
                return <QuestionInput question={currentQuestion} />;
            default:
                return <div>Unknown Type</div>;
        }
    };

    // Hide Check button for MATCH since it is auto-submitting on completion
    const showCheckButton = currentQuestion.type !== 'MATCH';

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <LessonHeader
                progress={currentQuestionIndex / lessonQuestions.length}
                hearts={hearts}
                onExit={() => router.push('/')}
            />

            <main className="flex-1 flex flex-col items-center justify-center p-4 pb-32 w-full max-w-4xl mx-auto">
                {renderQuestion()}
            </main>

            {isCorrect === null && (
                <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-white z-40">
                    <div className="max-w-2xl mx-auto">
                        {showCheckButton && <Button
                            variant={selectedAnswer ? "primary" : "locked"}
                            fullWidth
                            size="lg"
                            onClick={handleCheck}
                        >
                            CHECK
                        </Button>}
                    </div>
                </div>
            )}

            <FeedbackSheet
                status={isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : null}
                message={feedbackMessage || undefined}
                onContinue={handleContinue}
            />
        </div>
    );
}

function checkGenericAnswer(q: Question, answer: any): boolean {
    if (q.type === 'ARRANGE' && Array.isArray(answer)) {
        const answerStr = JSON.stringify(answer);

        // Check primary sequence
        if (answerStr === JSON.stringify(q.correctSequence)) {
            return true;
        }

        // Check alternative sequences (for partial order like a_n^2 / a^2_n)
        if (q.alternativeSequences) {
            for (const alt of q.alternativeSequences) {
                if (answerStr === JSON.stringify(alt)) {
                    return true;
                }
            }
        }

        // If orderMatters is false, check as unordered set
        if (q.orderMatters === false) {
            const sortedAnswer = [...answer].sort();
            const sortedCorrect = [...q.correctSequence].sort();
            return JSON.stringify(sortedAnswer) === JSON.stringify(sortedCorrect);
        }

        return false;
    }
    if (q.type === 'INPUT') {
        const normalized = (answer as string).replace(/\s+/g, '');
        return q.acceptable.some(acc => acc.replace(/\s+/g, '') === normalized);
    }
    if (q.type === 'CLOZE') {
        const userFilled = answer as Record<number, string>;
        if (!userFilled) return false;
        return q.segments.every((seg, idx) => {
            if (seg.type === 'blank') {
                return userFilled[idx] === seg.content;
            }
            return true;
        });
    }
    return false;
}
