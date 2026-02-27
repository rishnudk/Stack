"use client";

import Link from "next/link";

/**
 * Renders post content with clickable #hashtags.
 * Each #word token becomes a <Link> to /hashtag/word.
 */
export function PostContent({ text, className }: { text: string; className?: string }) {
    // Split on hashtag boundaries, keeping the delimiter
    const parts = text.split(/(#[\w]+)/g);

    return (
        <span className={className}>
            {parts.map((part, i) => {
                if (/^#[\w]+$/.test(part)) {
                    const tag = part.slice(1).toLowerCase();
                    return (
                        <Link
                            key={i}
                            href={`/hashtag/${tag}`}
                            className="text-sky-400 hover:text-sky-300 hover:underline transition-colors"
                            onClick={(e) => e.stopPropagation()} // don't bubble to post open
                        >
                            {part}
                        </Link>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
}
