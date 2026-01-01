import { unit1 } from "@/lib/content/unit1";
import { unit2 } from "@/lib/content/unit2";
import { unit3 } from "@/lib/content/unit3";
import { ProblemList } from "@/components/admin/ProblemList";
import { Question } from "@/lib/types";

// Helper to extract keywords from question for better search later? 
// For now just plain aggregation.

function getAllQuestions(): Question[] {
    const allUnits = [unit1, unit2, unit3];
    const questions: Question[] = [];

    for (const unit of allUnits) {
        for (const lesson of unit.lessons) {
            questions.push(...lesson.questions);
        }
    }
    return questions;
}

export default function ProblemManagerPage() {
    const questions = getAllQuestions();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Problem Manager</h1>
                    <p className="text-gray-500">
                        Overview of all {questions.length} curriculum items across {3} units.
                        This view is currently read-only.
                    </p>
                </header>

                <main>
                    <ProblemList questions={questions} />
                </main>
            </div>
        </div>
    );
}
