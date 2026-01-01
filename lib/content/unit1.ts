import { Unit } from '@/lib/types';

export const unit1: Unit = {
    id: 'unit1',
    title: 'Unit 1',
    description: 'Superscripts and Subscripts',
    lessons: [
        {
            id: 'lesson1',
            title: 'Basics: Up and Down',
            description: 'Learn to recognize ^ and _',
            threshold: 0.8,
            questions: [
                {
        id: 'u1-l1-q1',
        type: 'SELECT_CODE',
        prompt: 'Which code creates this superscript?',
        formula: 'x^2',
        choices: [ 'x^2', 'x_2', 'x*2' ],
        correctAnalysis: 'x^2'
    },
                {
                    id: 'u1-l1-q2',
                    type: 'SELECT_CODE',
                    prompt: 'Which code creates this subscript?',
                    formula: 'a_n',
                    choices: ['a^n', 'a_n', 'a-n'],
                    correctAnalysis: 'a_n'
                },
                {
        id: 'u1-l1-q3',
        type: 'SELECT_FORMULA',
        prompt: 'What does this code produce?',
        code: 'x^2',
        choices: [ 'x^2', 'x_2', 'x+2' ],
        correctAnalysis: 'x^2'
    },
                {
                    id: 'u1-l1-q4',
                    type: 'SELECT_FORMULA',
                    prompt: 'What does this code produce?',
                    code: 'a_n',
                    choices: ['a_n', 'a^n', 'an'],
                    correctAnalysis: 'a_n'
                },
                {
                    id: 'u1-l1-q5',
                    type: 'MATCH',
                    prompt: 'Match the math to the code',
                    pairs: [
                        { tex: 'x^2', code: 'x^2' },
                        { tex: 'a_n', code: 'a_n' },
                        { tex: 'a_{n+1}', code: 'a_{n+1}' }
                    ]
                },
                {
                    id: 'u1-l1-q6',
                    type: 'MATCH',
                    prompt: 'Match the math to the code',
                    pairs: [
                        { tex: 'x^3', code: 'x^3' },
                        { tex: 'a_i', code: 'a_i' },
                        { tex: 'a_{k+1}', code: 'a_{k+1}' }
                    ]
                },
                {
                    id: 'u1-l1-q7',
                    type: 'CLOZE',
                    prompt: 'Fill in for superscript',
                    model: 'x^2',
                    template: 'x \\Box {2}',
                    segments: [
                        { type: 'static', content: 'x' },
                        { type: 'blank', content: '^' },
                        { type: 'static', content: '{2}' }
                    ],
                    choices: ['^', '_']
                },
                {
                    id: 'u1-l1-q8',
                    type: 'CLOZE',
                    prompt: 'Fill in for subscript',
                    model: 'a_n',
                    template: 'a \\Box {n}',
                    segments: [
                        { type: 'static', content: 'a' },
                        { type: 'blank', content: '_' },
                        { type: 'static', content: '{n}' }
                    ],
                    choices: ['_', '^']
                }
            ]
        },
        {
            id: 'lesson2',
            title: 'Groups & Structure',
            description: 'Building blocks with braces',
            threshold: 0.8,
            questions: [
                {
                    id: 'u1-l2-q1',
                    type: 'SELECT_FORMULA',
                    prompt: 'Review: Which is correct?',
                    code: 'a_{n+1}',
                    choices: ['a_{n+1}', 'a_{n}+1', 'a^{n+1}'],
                    correctAnalysis: 'a_{n+1}'
                },
                {
        id: 'u1-l2-q2',
        type: 'MATCH',
        prompt: 'Match the items',
        pairs: [
            {
                tex: 'x^n',
                code: 'x^n'
            },
            {
                tex: 'x_{n+1}',
                code: 'x_{n+1}'
            },
            {
                tex: 'x^{n+1}',
                code: 'x^{n+1}'
            },
            {
                tex: 'a_{n}',
                code: 'a_{n}'
            }
        ]
    },
                {
                    id: 'u1-l2-q3',
                    type: 'CLOZE',
                    prompt: 'Complete the groups',
                    model: 'a_{n}, x^2',
                    template: 'a _ \\Box, x ^ \\Box',
                    segments: [
                        { type: 'static', content: 'a_' },
                        { type: 'blank', content: '{n}' },
                        { type: 'static', content: ', x^' },
                        { type: 'blank', content: '{2}' }
                    ],
                    choices: ['{n}', '{2}', 'n', '2']
                },
                {
        id: 'u1-l2-q4',
        type: 'CLOZE',
        prompt: 'Select the correct operator',
        model: 'x^2, a_n',
        template: '\\Box ^ {2}, \\Box _ {n}',
        segments: [
            {
                type: 'blank',
                content: 'x'
            },
            {
                type: 'static',
                content: '^{2}, '
            },
            {
                type: 'blank',
                content: 'a'
            },
            {
                type: 'static',
                content: '_{n}'
            }
        ],
        choices: [ 'x', 'a', 'n', '^' ]
    },
                {
                    id: 'u1-l2-q5',
                    type: 'ARRANGE',
                    prompt: 'Construct x^2',
                    initialTiles: [
                        { id: '1', content: 'x', type: 'atom' },
                        { id: '2', content: '^', type: 'operator' },
                        { id: '3', content: '{2}', type: 'group' }
                    ],
                    correctSequence: ['x', '^', '{2}']
                },
                {
                    id: 'u1-l2-q6',
                    type: 'ARRANGE',
                    prompt: 'Construct a_n',
                    initialTiles: [
                        { id: '1', content: 'a', type: 'atom' },
                        { id: '2', content: '_', type: 'operator' },
                        { id: '3', content: '{n}', type: 'group' }
                    ],
                    correctSequence: ['a', '_', '{n}']
                },
                {
        id: 'u1-l2-q7',
        type: 'ARRANGE',
        prompt: 'Construct a_{n+1}',
        initialTiles: [
            {
                id: '1',
                content: 'a',
                type: 'atom'
            },
            {
                id: '2',
                content: '_',
                type: 'operator'
            },
            {
                id: '3',
                content: '{n+1}',
                type: 'group'
            }
        ],
        correctSequence: [ 'a', '_', '{n+1}' ]
    },
                {
                    id: 'u1-l2-q8',
                    type: 'ARRANGE',
                    prompt: 'Construct x_n (Be careful of ^ vs _)',
                    initialTiles: [
                        { id: '1', content: 'x', type: 'atom' },
                        { id: '2', content: '_', type: 'operator' },
                        { id: '3', content: '{n}', type: 'group' }
                    ],
                    distractors: [
                        { id: '4', content: '^', type: 'operator' }
                    ],
                    correctSequence: ['x', '_', '{n}']
                }
            ]
        },
        {
            id: 'lesson3',
            title: 'Synthesis',
            description: 'Mixing it all together',
            threshold: 0.8,
            questions: [
                {
                    id: 'u1-l3-q1',
                    type: 'MATCH',
                    prompt: 'Match mixed items',
                    pairs: [
                        { tex: 'a_n', code: 'a_n' },
                        { tex: 'x^2', code: 'x^2' },
                        { tex: 'a_{n+1}', code: 'a_{n+1}' },
                        { tex: 'x^{2n}', code: 'x^{2n}' }
                    ]
                },
                {
                    id: 'u1-l3-q2',
                    type: 'CLOZE',
                    prompt: 'Complete the combined form',
                    model: 'a_{n}^{2}',
                    template: 'a _ \\Box ^ \\Box',
                    segments: [
                        { type: 'static', content: 'a_' },
                        { type: 'blank', content: '{n}' },
                        { type: 'static', content: '^' },
                        { type: 'blank', content: '{2}' }
                    ],
                    choices: ['{n}', '{2}', '{a}', 'n']
                },
                {
                    id: 'u1-l3-q3',
                    type: 'ARRANGE',
                    prompt: 'Construct a_n^2',
                    initialTiles: [
                        { id: 't1', content: 'a', type: 'atom' },
                        { id: 't2', content: '_', type: 'operator' },
                        { id: 't3', content: '{n}', type: 'group' },
                        { id: 't4', content: '^', type: 'operator' },
                        { id: 't5', content: '{2}', type: 'group' }
                    ],
                    correctSequence: ['a', '_', '{n}', '^', '{2}'],
                    alternativeSequences: [['a', '^', '{2}', '_', '{n}']]
                },
                {
                    id: 'u1-l3-q4',
                    type: 'ARRANGE',
                    prompt: 'Construct x^{n+1}',
                    initialTiles: [
                        { id: 't1', content: 'x', type: 'atom' },
                        { id: 't2', content: '^', type: 'operator' },
                        { id: 't3', content: '{n+1}', type: 'group' }
                    ],
                    correctSequence: ['x', '^', '{n+1}']
                },
                {
                    id: 'u1-l3-q5',
                    type: 'ARRANGE',
                    prompt: 'Construct a_n (Select correct operator)',
                    initialTiles: [
                        { id: 't1', content: 'a', type: 'atom' },
                        { id: 't2', content: '_', type: 'operator' },
                        { id: 't3', content: '{n}', type: 'group' }
                    ],
                    distractors: [
                        { id: 'd1', content: '^', type: 'operator' },
                        { id: 'd2', content: '{2}', type: 'group' }
                    ],
                    correctSequence: ['a', '_', '{n}']
                },
                {
                    id: 'u1-l3-q6',
                    type: 'CLOZE',
                    prompt: 'Fix the error: x^n+1 is wrong. Make it x^{n+1}',
                    model: 'x^{n+1}',
                    template: 'x ^ \\Box',
                    segments: [
                        { type: 'static', content: 'x^' },
                        { type: 'blank', content: '{n+1}' }
                    ],
                    choices: ['{n+1}', 'n+1', 'n', '1']
                },
                {
                    id: 'u1-l3-q7',
                    type: 'SELECT_CODE',
                    prompt: 'Which code is correct?',
                    formula: 'x_{n+1}',
                    choices: ['x_{n+1}', 'x_n+1', 'x^{n+1}'],
                    correctAnalysis: 'x_{n+1}'
                },
                {
                    id: 'u1-l3-q8',
                    type: 'INPUT',
                    prompt: 'Type the code for:',
                    formula: 'a_{n+1}',
                    acceptable: ['a_{n+1}', 'a_{ n+1 }'],
                    instruction: 'Use _ and {...}'
                }
            ]
        },
        {
            id: 'lesson4',
            title: 'Input Challenge',
            description: 'Prove your skills',
            threshold: 0.8,
            questions: [
                {
                    id: 'u1-l4-q1',
                    type: 'CLOZE',
                    prompt: 'Fill operators',
                    model: 'a_{n+1}^{2}',
                    template: 'a \\Box {n+1} \\Box {2}',
                    segments: [
                        { type: 'static', content: 'a' },
                        { type: 'blank', content: '_' },
                        { type: 'static', content: '{n+1}' },
                        { type: 'blank', content: '^' },
                        { type: 'static', content: '{2}' }
                    ],
                    choices: ['_', '^', '=']
                },
                {
                    id: 'u1-l4-q2',
                    type: 'ARRANGE',
                    prompt: 'Construct a_{n+1}^2',
                    initialTiles: [
                        { id: 't1', content: 'a', type: 'atom' },
                        { id: 't2', content: '_', type: 'operator' },
                        { id: 't3', content: '{n+1}', type: 'group' },
                        { id: 't4', content: '^', type: 'operator' },
                        { id: 't5', content: '{2}', type: 'group' }
                    ],
                    correctSequence: ['a', '_', '{n+1}', '^', '{2}'],
                    alternativeSequences: [['a', '^', '{2}', '_', '{n+1}']]
                },
                {
                    id: 'u1-l4-q3',
                    type: 'INPUT',
                    prompt: 'Type the code:',
                    formula: 'x^2',
                    acceptable: ['x^2', 'x^{2}'],
                },
                {
                    id: 'u1-l4-q4',
                    type: 'INPUT',
                    prompt: 'Type the code:',
                    formula: 'a_n',
                    acceptable: ['a_n', 'a_{n}']
                },
                {
                    id: 'u1-l4-q5',
                    type: 'INPUT',
                    prompt: 'Type the code:',
                    formula: 'a_{n+1}',
                    acceptable: ['a_{n+1}']
                },
                {
        id: 'u1-l4-q6',
        type: 'INPUT',
        prompt: 'Type the code:',
        formula: 'x_i^2',
        acceptable: [
            'x_i^2',
            'x_{i}^2',
            'x_i^{2}',
            'x_{i}^{2}',
            'x^2_i',
            'x^{2}_i',
            'x^2_{i}',
            'x^{2}_{i}'
        ]
    },
                {
                    id: 'u1-l4-q7',
                    type: 'INPUT',
                    prompt: 'Type: a subscript n+1, superscript 2',
                    formula: '', // No visual, text prompt
                    instruction: 'a subscript n+1, superscript 2',
                    image: '',
                    acceptable: ['a_{n+1}^2', 'a_{n+1}^{2}', 'a^2_{n+1}', 'a^{2}_{n+1}']
                },
                {
                    id: 'u1-l4-q8',
                    type: 'INPUT',
                    prompt: 'Type the code:',
                    formula: 'x_{n+1}^{k+1}',
                    acceptable: ['x_{n+1}^{k+1}', 'x^{k+1}_{n+1}']
                }
            ]
        }
    ]
};
