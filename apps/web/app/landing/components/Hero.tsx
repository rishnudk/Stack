"use client";

import { BackgroundPaths } from "@/components/ui/background-paths";
import { FlipFadeText } from "@/components/ui/flip-fade-text";

export default function Hero() {
    return (
        <div className="relative">
            <BackgroundPaths
                title="Where Developers"
                subtitle={
                    <FlipFadeText
                        words={["Discover", "Connect", "Collaborate"]}
                        className="min-h-0"
                        textClassName="text-3xl sm:text-5xl md:text-6xl"
                    />
                }
            />
        </div>
    );
}

