"use client";

import React from "react";

interface Props {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder = "Write your article content here... (Markdown supported)" }: Props) {
    return (
        <div className="w-full flex-1 min-h-[400px]">
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-full min-h-[400px] bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors resize-y leading-relaxed font-mono"
            />
        </div>
    );
}
