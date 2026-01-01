import { unit1 } from "@/lib/content/unit1";
import { unit2 } from "@/lib/content/unit2";
import { unit3 } from "@/lib/content/unit3";
import { ProblemEditor } from "@/components/admin/ProblemEditor";
import { Question } from "@/lib/types";

// Helper to find question (same as in ProblemList context somewhat)
function getQuestionById(id: string): Question | undefined {
    const allUnits = [unit1, unit2, unit3];
    for (const unit of allUnits) {
        for (const lesson of unit.lessons) {
            const found = lesson.questions.find(q => q.id === id);
            if (found) return found;
        }
    }
    return undefined;
}

export default async function EditProblemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const question = getQuestionById(id);

    if (!question) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-400">
                Problem not found or invalid ID: {id}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-8">
            <ProblemEditor initialQuestion={question} />
        </div>
    );
}
