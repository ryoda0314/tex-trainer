import { Unit } from '@/lib/types';

export const unit2: Unit = {
    id: 'unit2',
    title: 'Unit 2',
    description: 'Fractions',
    lessons: [
        {
            id: 'u2-l1',
            title: 'Fraction Basics',
            description: 'The \\frac command',
            threshold: 0.8,
            questions: [
                {
                    id: 'u2-l1-q1', type: 'SELECT_CODE', prompt: 'Which command makes a fraction?',
                    formula: '\\frac{a}{b}', choices: ['\\frac{a}{b}', '\\fraction{a}{b}', 'a/b'], correctAnalysis: '\\frac{a}{b}'
                },
                {
        id: 'u2-l1-q2',
        type: 'MATCH',
        prompt: 'Match pieces',
        pairs: [
            {
                tex: '\\frac{1}{2}',
                code: '\\frac{1}{2}'
            },
            {
                tex: '\\frac{a}{b}',
                code: '\\frac{a}{b}'
            }
        ]
    },
                {
                    id: 'u2-l1-q3', type: 'ARRANGE', prompt: 'Build 1/2',
                    initialTiles: [
                        { id: '1', content: '\\frac', type: 'command' },
                        { id: '2', content: '{1}', type: 'group' },
                        { id: '3', content: '{2}', type: 'group' }
                    ],
                    correctSequence: ['\\frac', '{1}', '{2}']
                },
                {
                    id: 'u2-l1-q4', type: 'CLOZE', prompt: 'Fill the code',
                    model: '\\frac{a}{b}',
                    template: '\\Box {a} {b}',
                    segments: [{ type: 'blank', content: '\\frac' }, { type: 'static', content: '{a}{b}' }],
                    choices: ['\\frac', '\\sqrt', '\\sum']
                },
                {
                    id: 'u2-l1-q5', type: 'INPUT', prompt: 'Type a fraction',
                    formula: '\\frac{x}{y}', acceptable: ['\\frac{x}{y}']
                },
                { id: 'u2-l1-q6', type: 'SELECT_CODE', prompt: 'Select correct form', formula: '\\frac{1}{n}', choices: ['\\frac{1}{n}', '1 over n'], correctAnalysis: '\\frac{1}{n}' },
                { id: 'u2-l1-q7', type: 'MATCH', prompt: 'Pairs', pairs: [{ tex: '\\frac{x}{2}', code: '\\frac{x}{2}' }, { tex: '\\frac{2}{x}', code: '\\frac{2}{x}' }] },
                { id: 'u2-l1-q8', type: 'ARRANGE', prompt: 'Build a/b', initialTiles: [{ id: '1', content: '\\frac', type: 'command' }, { id: '2', content: '{a}', type: 'group' }, { id: '3', content: '{b}', type: 'group' }], correctSequence: ['\\frac', '{a}', '{b}'] }
            ]
        },
        {
            id: 'u2-l2',
            title: 'Fraction Content',
            description: 'Complex numerators',
            threshold: 0.8,
            questions: [
                {
                    id: 'u2-l2-q1', type: 'ARRANGE', prompt: 'Build (n+1)/2',
                    initialTiles: [
                        { id: '1', content: '\\frac', type: 'command' },
                        { id: '2', content: '{n+1}', type: 'group' },
                        { id: '3', content: '{2}', type: 'group' }
                    ],
                    correctSequence: ['\\frac', '{n+1}', '{2}']
                },
                {
                    id: 'u2-l2-q2', type: 'INPUT', prompt: 'Type:', formula: '\\frac{a+b}{2}', acceptable: ['\\frac{a+b}{2}']
                },
                {
                    id: 'u2-l2-q3', type: 'CLOZE', prompt: 'Complete', model: '\\frac{x}{y}', template: '\\frac {x} \\Box',
                    segments: [{ type: 'static', content: '\\frac{x}' }, { type: 'blank', content: '{y}' }], choices: ['{y}', 'y']
                },
                // Filler questions to reach 8
                { id: 'u2-l2-q4', type: 'SELECT_FORMULA', prompt: 'Read code', code: '\\frac{1}{x+1}', choices: ['\\frac{1}{x+1}', '\\frac{1}{x}+1'], correctAnalysis: '\\frac{1}{x+1}' },
                { id: 'u2-l2-q5', type: 'MATCH', prompt: 'Match', pairs: [{ tex: '\\frac{1}{n}', code: '\\frac{1}{n}' }, { tex: '\\frac{n}{1}', code: '\\frac{n}{1}' }] },
                { id: 'u2-l2-q6', type: 'INPUT', prompt: 'Type', formula: '\\frac{1}{2}', acceptable: ['\\frac{1}{2}'] },
                { id: 'u2-l2-q7', type: 'ARRANGE', prompt: 'Order', initialTiles: [{ id: '1', content: '\\frac', type: 'command' }, { id: '2', content: '{x}', type: 'group' }, { id: '3', content: '{y}', type: 'group' }], correctSequence: ['\\frac', '{x}', '{y}'] },
                { id: 'u2-l2-q8', type: 'INPUT', prompt: 'Type', formula: '\\frac{n}{2}', acceptable: ['\\frac{n}{2}'] }
            ]
        },
        {
            id: 'u2-l3',
            title: 'Mastery',
            description: 'Fractions with exponents',
            threshold: 0.8,
            questions: [
                { id: 'u2-l3-q1', type: 'ARRANGE', prompt: 'Combine \\frac and ^', initialTiles: [{ id: '1', content: '\\frac', type: 'command' }, { id: '2', content: '{x^2}', type: 'group' }, { id: '3', content: '{2}', type: 'group' }], correctSequence: ['\\frac', '{x^2}', '{2}'] },
                { id: 'u2-l3-q2', type: 'INPUT', prompt: 'Type', formula: '\\frac{x^2}{2}', acceptable: ['\\frac{x^2}{2}', '\\frac{x^{2}}{2}'] },
                { id: 'u2-l3-q3', type: 'INPUT', prompt: 'Type', formula: '\\frac{1}{x^2}', acceptable: ['\\frac{1}{x^2}', '\\frac{1}{x^{2}}'] },
                { id: 'u2-l3-q4', type: 'MATCH', prompt: 'Mix', pairs: [{ tex: '\\frac{a}{b}', code: '\\frac{a}{b}' }, { tex: 'x^2', code: 'x^2' }] },
                {
        id: 'u2-l3-q5',
        type: 'CLOZE',
        prompt: 'Fill',
        model: '\\frac{n}{2}',
        template: '\\frac \\Box \\Box',
        segments: [
            {
                type: 'static',
                content: '\\frac'
            },
            {
                type: 'blank',
                content: '{n}'
            },
            {
                type: 'blank',
                content: '{2}'
            }
        ],
        choices: [ '{n}', 'n', '2', '{2}' ]
    },
                { id: 'u2-l3-q6', type: 'ARRANGE', prompt: 'Build', initialTiles: [{ id: '1', content: '\\frac', type: 'command' }, { id: '2', content: '{1}', type: 'group' }, { id: '3', content: '{n+1}', type: 'group' }], correctSequence: ['\\frac', '{1}', '{n+1}'] },
                { id: 'u2-l3-q7', type: 'INPUT', prompt: 'Type', formula: '\\frac{a_n}{2}', acceptable: ['\\frac{a_n}{2}', '\\frac{a_{n}}{2}'] },
                { id: 'u2-l3-q8', type: 'INPUT', prompt: 'Type', formula: '\\frac{n+1}{2}', acceptable: ['\\frac{n+1}{2}'] }
            ]
        }
    ]
};
