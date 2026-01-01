import { Unit } from '@/lib/types';

export const unit3: Unit = {
    id: 'unit3',
    title: 'Unit 3',
    description: 'Square Roots',
    lessons: [
        {
            id: 'u3-l1',
            title: 'Root Basics',
            description: 'The \\sqrt command',
            threshold: 0.8,
            questions: [
                { id: 'u3-l1-q1', type: 'SELECT_CODE', prompt: 'Which command?', formula: '\\sqrt{x}', choices: ['\\sqrt{x}', '\\root{x}', '\\sq{x}'], correctAnalysis: '\\sqrt{x}' },
                { id: 'u3-l1-q2', type: 'SELECT_FORMULA', prompt: 'What matches?', code: '\\sqrt{2}', choices: ['\\sqrt{2}', '2^2', '2'], correctAnalysis: '\\sqrt{2}' },
                { id: 'u3-l1-q3', type: 'MATCH', prompt: 'Match', pairs: [{ tex: '\\sqrt{x}', code: '\\sqrt{x}' }, { tex: 'x^2', code: 'x^2' }] },
                { id: 'u3-l1-q4', type: 'ARRANGE', prompt: 'Build root x', initialTiles: [{ id: '1', content: '\\sqrt', type: 'command' }, { id: '2', content: '{x}', type: 'group' }], correctSequence: ['\\sqrt', '{x}'] },
                { id: 'u3-l1-q5', type: 'CLOZE', prompt: 'Fill', model: '\\sqrt{2}', template: '\\Box {2}', segments: [{ type: 'blank', content: '\\sqrt' }, { type: 'static', content: '{2}' }], choices: ['\\sqrt', '\\frac'] },
                { id: 'u3-l1-q6', type: 'INPUT', prompt: 'Type', formula: '\\sqrt{a}', acceptable: ['\\sqrt{a}'] },
                { id: 'u3-l1-q7', type: 'INPUT', prompt: 'Type', formula: '\\sqrt{2}', acceptable: ['\\sqrt{2}'] },
                { id: 'u3-l1-q8', type: 'ARRANGE', prompt: 'Order', initialTiles: [{ id: '1', content: '\\sqrt', type: 'command' }, { id: '2', content: '{a+b}', type: 'group' }], correctSequence: ['\\sqrt', '{a+b}'] }
            ]
        },
        {
            id: 'u3-l2',
            title: 'Roots & Powers',
            description: 'Mixing roots and exponents',
            threshold: 0.8,
            questions: [
                { id: 'u3-l2-q1', type: 'SELECT_FORMULA', prompt: 'Identify', code: '\\sqrt{x^2}', choices: ['\\sqrt{x^2}', '\\sqrt{x}^2', 'x'], correctAnalysis: '\\sqrt{x^2}' },
                { id: 'u3-l2-q2', type: 'MATCH', prompt: 'Match', pairs: [{ tex: '\\sqrt{x^2}', code: '\\sqrt{x^2}' }, { tex: '(\\sqrt{x})^2', code: '(\\sqrt{x})^2' }] },
                { id: 'u3-l2-q3', type: 'ARRANGE', prompt: 'Build', initialTiles: [{ id: '1', content: '\\sqrt', type: 'command' }, { id: '2', content: '{x^2}', type: 'group' }], correctSequence: ['\\sqrt', '{x^2}'] },
                {
        id: 'u3-l2-q4',
        type: 'CLOZE',
        prompt: 'Fill',
        model: '\\sqrt{x^2}',
        template: '\\sqrt {\\Box}',
        segments: [
            {
                type: 'static',
                content: '\\sqrt{'
            },
            {
                type: 'blank',
                content: 'x^2'
            },
            {
                type: 'static',
                content: '}'
            }
        ],
        choices: [ 'x^2', '2x', 'x*2', 'x2' ]
    },
                { id: 'u3-l2-q5', type: 'INPUT', prompt: 'Type', formula: '\\sqrt{x^2}', acceptable: ['\\sqrt{x^2}', '\\sqrt{x^{2}}'] },
                { id: 'u3-l2-q6', type: 'INPUT', prompt: 'Type', formula: '\\sqrt{n+1}', acceptable: ['\\sqrt{n+1}'] },
                { id: 'u3-l2-q7', type: 'MATCH', prompt: 'Match', pairs: [{ tex: '\\sqrt{a}', code: '\\sqrt{a}' }, { tex: '\\frac{1}{2}', code: '\\frac{1}{2}' }] },
                { id: 'u3-l2-q8', type: 'ARRANGE', prompt: 'Complex', initialTiles: [{ id: '1', content: '\\sqrt', type: 'command' }, { id: '2', content: '{a^2+b^2}', type: 'group' }], correctSequence: ['\\sqrt', '{a^2+b^2}'] }
            ]
        },
        {
            id: 'u3-l3',
            title: 'All Together',
            description: 'Fractions, Roots, Exponents',
            threshold: 0.8,
            questions: [
                { id: 'u3-l3-q1', type: 'INPUT', prompt: 'Type Quadratic Formula Part', formula: '\\sqrt{b^2-4ac}', acceptable: ['\\sqrt{b^2-4ac}', '\\sqrt{b^{2}-4ac}'] },
                { id: 'u3-l3-q2', type: 'INPUT', prompt: 'Type', formula: '\\frac{1}{\\sqrt{2}}', acceptable: ['\\frac{1}{\\sqrt{2}}'] },
                { id: 'u3-l3-q3', type: 'ARRANGE', prompt: 'Build', initialTiles: [{ id: '1', content: '\\frac', type: 'command' }, { id: '2', content: '{1}', type: 'group' }, { id: '3', content: '{\\sqrt{2}}', type: 'group' }], correctSequence: ['\\frac', '{1}', '{\\sqrt{2}}'] },
                { id: 'u3-l3-q4', type: 'MATCH', prompt: 'Final Check', pairs: [{ tex: '\\sqrt{\\frac{1}{2}}', code: '\\sqrt{\\frac{1}{2}}' }, { tex: '\\frac{1}{\\sqrt{2}}', code: '\\frac{1}{\\sqrt{2}}' }] },
                { id: 'u3-l3-q5', type: 'INPUT', prompt: 'Type', formula: 'x^{\\frac{1}{2}}', acceptable: ['x^{\\frac{1}{2}}', 'x^\\frac{1}{2}'] }, // checking brace handling
                { id: 'u3-l3-q6', type: 'SELECT_CODE', prompt: 'Select', formula: '\\sqrt{1+x}', choices: ['\\sqrt{1+x}', '\\sqrt{1}+x'], correctAnalysis: '\\sqrt{1+x}' },
                { id: 'u3-l3-q7', type: 'INPUT', prompt: 'Type', formula: '\\sqrt{x}', acceptable: ['\\sqrt{x}'] },
                { id: 'u3-l3-q8', type: 'INPUT', prompt: 'Type', formula: '\\frac{\\sqrt{3}}{2}', acceptable: ['\\frac{\\sqrt{3}}{2}'] }
            ]
        }
    ]
};
