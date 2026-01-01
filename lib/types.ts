export type QuestionType =
    | 'SELECT_CODE'
    | 'SELECT_FORMULA'
    | 'MATCH'
    | 'CLOZE'
    | 'ARRANGE'
    | 'INPUT';

export interface BaseQuestion {
    id: string;
    type: QuestionType;
    prompt: string; // "Choose the code", "Arrange the tiles", etc.
}

export interface QuestionSelectCode extends BaseQuestion {
    type: 'SELECT_CODE';
    formula: string; // The TeX to render
    choices: string[]; // Code options
    correctAnalysis: string;
}

export interface QuestionSelectFormula extends BaseQuestion {
    type: 'SELECT_FORMULA';
    code: string; // The code to show
    choices: string[]; // Formula options (TeX)
    correctAnalysis: string;
}

export interface QuestionMatch extends BaseQuestion {
    type: 'MATCH';
    pairs: { tex: string; code: string }[];
}

export interface QuestionCloze extends BaseQuestion {
    type: 'CLOZE';
    model?: string; // Target LaTeX to display as an example
    template: string; // e.g. "x \Box {2}"
    segments: {
        type: 'static' | 'blank';
        content: string; // static text or correct answer for blank
        id?: string;
    }[];
    choices: string[]; // Options to fill blanks
}

// Tile Arrangement
export interface ArrangeTile {
    id: string;
    content: string; // "x", "^", "{n}"
    type: 'command' | 'operator' | 'group' | 'atom';
}

export interface QuestionArrange extends BaseQuestion {
    type: 'ARRANGE';
    initialTiles: ArrangeTile[];
    correctSequence: string[]; // Array of content strings in order
    distractors?: ArrangeTile[];
}

export interface QuestionInput extends BaseQuestion {
    type: 'INPUT';
    formula: string; // The visual target (or instructions if empty)
    image?: string; // Optional image fallback
    acceptable: string[]; // List of valid canonical answers
    instruction?: string; // e.g. "Type a_{n+1}"
}

export type Question =
    | QuestionSelectCode
    | QuestionSelectFormula
    | QuestionMatch
    | QuestionCloze
    | QuestionArrange
    | QuestionInput;

export interface Lesson {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    threshold: number; // 0.8
}

export interface Unit {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
}

export interface UserProgress {
    xp: number;
    streak: number;
    lastActiveDate: string | null;
    completedLessons: Record<string, {
        score: number; // 0-1
        completedAt: string;
    }>;
    unlockedUnits: string[];
    name: string | null;
    hearts: number;
    maxHearts: number;
}
