"use client";

<<<<<<< Updated upstream
import { BackgroundPaths } from "@/components/ui/background-paths";

export default function Hero() {
    return (
        <div className="relative">
            <BackgroundPaths title="Background Paths" />
=======
import { useState, useEffect } from "react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { FlipText } from "@/components/ui/flip-text";

export default function Hero() {
    const words = ["Discover", "Connect", "Collaborate"];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3000); // Rotate every 3 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative">
            <BackgroundPaths
                title="Where Developers"
                subtitle={
                    <div className="flex items-center justify-center gap-2">
                        <FlipText
                            key={words[index]}
                            duration={2}
                            className="text-white dark:text-white"
                        >
                            {words[index]}
                        </FlipText>
                    </div>
                }
            />
>>>>>>> Stashed changes
        </div>
    );
}
