'use server';

import fs from 'fs/promises';
import path from 'path';
import { Question } from '@/lib/types';

const UNIT_FILES = [
    'lib/content/unit1.ts',
    'lib/content/unit2.ts',
    'lib/content/unit3.ts'
];

export async function saveProblem(updatedQuestion: Question): Promise<{ success: boolean; message: string }> {
    const rootDir = process.cwd();

    for (const relativePath of UNIT_FILES) {
        const filePath = path.join(rootDir, relativePath);

        try {
            const content = await fs.readFile(filePath, 'utf-8');

            // 1. Search for ID
            const idPattern = new RegExp(`id:\\s*['"]${updatedQuestion.id}['"]`);
            const match = content.match(idPattern);

            if (match) {
                const idIndex = match.index!;

                // 2. Scan backwards for start '{'
                // This naive search is usually okay for finding the *immediate* parent object 
                // IF we assume standard formatting where 'id' is close to the top of the object.
                // However, safety would be better. But backwards parsing is hard.
                // Let's assume the nearest `{` that isn't inside a comment/string is the one.
                // Actually backward parsing with state is complex.
                // Heuristic: Scan back. If we hit `}` we might be properly nesting out, 
                // but given the structure, `id` is a property. The `{` opening this object MUST be before it.
                // We'll trust the simple backward scan for `{` for now, assuming standard formatting.
                // A key optimization: `id` is inside the object. The open brace must be the *closest* `{` 
                // that is not paired with a `}` between it and `id`.

                let startIndex = -1;
                let balance = 0;
                for (let i = idIndex; i >= 0; i--) {
                    const char = content[i];
                    if (char === '}') balance++;
                    else if (char === '{') {
                        if (balance === 0) {
                            startIndex = i;
                            break;
                        }
                        balance--;
                    }
                }

                if (startIndex === -1) {
                    return { success: false, message: `Could not find start of object for ${updatedQuestion.id}` };
                }

                // 3. Forward scan for end '}' with Robust State Machine
                let endIndex = -1;
                let currentBalance = 0;
                let inString = false;
                let stringChar = '';
                let inLineComment = false;
                let inBlockComment = false;

                for (let i = startIndex; i < content.length; i++) {
                    const char = content[i];
                    const nextChar = content[i + 1];

                    // Handle Comments
                    if (inLineComment) {
                        if (char === '\n') {
                            inLineComment = false;
                        }
                        continue;
                    }
                    if (inBlockComment) {
                        if (char === '*' && nextChar === '/') {
                            inBlockComment = false;
                            i++; // skip /
                        }
                        continue;
                    }

                    // Handle Strings
                    if (inString) {
                        if (char === stringChar && content[i - 1] !== '\\') {
                            inString = false;
                        }
                        continue;
                    }

                    // Check for start of comments/strings
                    if (char === '/' && nextChar === '/') {
                        inLineComment = true;
                        i++;
                        continue;
                    }
                    if (char === '/' && nextChar === '*') {
                        inBlockComment = true;
                        i++;
                        continue;
                    }
                    if (char === "'" || char === '"' || char === '`') {
                        inString = true;
                        stringChar = char;
                        continue;
                    }

                    // Handle Braces
                    if (char === '{') {
                        currentBalance++;
                    } else if (char === '}') {
                        currentBalance--;
                        if (currentBalance === 0) {
                            endIndex = i + 1;
                            break;
                        }
                    }
                }

                if (endIndex === -1) {
                    return { success: false, message: `Could not determine object boundaries for ${updatedQuestion.id}` };
                }

                const newObjectString = formatAsObjectLiteral(updatedQuestion);
                const newFileContent = content.slice(0, startIndex) + newObjectString + content.slice(endIndex);

                await fs.writeFile(filePath, newFileContent, 'utf-8');
                return { success: true, message: `Saved to ${relativePath}` };
            }

        } catch (error) {
            console.error(`Error processing ${relativePath}`, error);
        }
    }

    return { success: false, message: 'Question ID not found in any unit file' };
}

function formatAsObjectLiteral(obj: any, indentLevel = 4): string {
    const indent = ' '.repeat(indentLevel);
    const innerIndent = ' '.repeat(indentLevel + 4);

    if (obj === null) return 'null';
    if (typeof obj === 'undefined') return 'undefined';

    if (Array.isArray(obj)) {
        if (obj.length === 0) return '[]';
        // Check if array of simple types
        const isSimple = obj.every(x => typeof x === 'string' || typeof x === 'number');
        if (isSimple && JSON.stringify(obj).length < 80) {
            return '[ ' + obj.map(x => formatValue(x)).join(', ') + ' ]';
        }

        const items = obj.map(item => innerIndent + formatAsObjectLiteral(item, indentLevel + 4));
        return `[\n${items.join(',\n')}\n${indent}]`;
    }

    if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        if (keys.length === 0) return '{}';

        const props = keys.map(key => {
            const val = obj[key];
            if (val === undefined) return null;

            const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
            const valStr = (typeof val === 'object' && val !== null)
                ? formatAsObjectLiteral(val, indentLevel + 4)
                : formatValue(val);

            return `${innerIndent}${keyStr}: ${valStr}`;
        }).filter(Boolean);

        return `{\n${props.join(',\n')}\n${indent}}`;
    }

    return formatValue(obj);
}

function formatValue(val: any): string {
    if (typeof val === 'string') {
        // Escape single quotes and backslashes
        const escaped = val.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        return `'${escaped}'`;
    }
    return String(val);
}
