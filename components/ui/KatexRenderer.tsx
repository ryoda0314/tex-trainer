'use client';

import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface KatexRendererProps {
    tex: string;
    block?: boolean;
    className?: string;
}

export function KatexRenderer({ tex, block = false, className }: KatexRendererProps) {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            katex.render(tex, containerRef.current, {
                throwOnError: false,
                displayMode: block,
            });
        }
    }, [tex, block]);

    return (
        <span
            ref={containerRef}
            className={cn("katex-render", className)}
        />
    );
}
