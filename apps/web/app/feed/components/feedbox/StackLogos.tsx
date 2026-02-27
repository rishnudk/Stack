"use client";

import {
    SiReact,
    SiNextdotjs,
    SiNodedotjs,
    SiExpress,
    SiTypescript,
    SiJavascript,
    SiTailwindcss,
    SiPrisma,
    SiPostgresql,
    SiPython,
    SiDocker,
    SiKubernetes,
    SiAmazonwebservices,
    SiGooglecloud,
    SiFirebase,
    SiMongodb,
    SiRedis,
    SiGraphql,
    SiRedux,
    SiVite,
    SiVercel,
    SiNestjs,
    SiFastify,
    SiDjango,
    SiFlask,
    SiGo,
    SiRust,
    SiSharp,
} from "react-icons/si";

const stackMap: Record<string, any> = {
    react: { icon: SiReact, color: "text-[#61DAFB]" },
    nextjs: { icon: SiNextdotjs, color: "text-white" },
    "next.js": { icon: SiNextdotjs, color: "text-white" },
    node: { icon: SiNodedotjs, color: "text-[#339933]" },
    nodejs: { icon: SiNodedotjs, color: "text-[#339933]" },
    "node.js": { icon: SiNodedotjs, color: "text-[#339933]" },
    express: { icon: SiExpress, color: "text-white" },
    expressjs: { icon: SiExpress, color: "text-white" },
    typescript: { icon: SiTypescript, color: "text-[#3178C6]" },
    javascript: { icon: SiJavascript, color: "text-[#F7DF1E]" },
    tailwind: { icon: SiTailwindcss, color: "text-[#06B6D4]" },
    tailwindcss: { icon: SiTailwindcss, color: "text-[#06B6D4]" },
    prisma: { icon: SiPrisma, color: "text-[#2D3748]" },
    postgresql: { icon: SiPostgresql, color: "text-[#4169E1]" },
    python: { icon: SiPython, color: "text-[#3776AB]" },
    docker: { icon: SiDocker, color: "text-[#2496ED]" },
    kubernetes: { icon: SiKubernetes, color: "text-[#326CE5]" },
    aws: { icon: SiAmazonwebservices, color: "text-[#FF9900]" },
    gcp: { icon: SiGooglecloud, color: "text-[#4285F4]" },
    firebase: { icon: SiFirebase, color: "text-[#FFCA28]" },
    mongodb: { icon: SiMongodb, color: "text-[#47A248]" },
    redis: { icon: SiRedis, color: "text-[#DC382D]" },
    graphql: { icon: SiGraphql, color: "text-[#E10098]" },
    redux: { icon: SiRedux, color: "text-[#764ABC]" },
    vite: { icon: SiVite, color: "text-[#646CFF]" },
    vercel: { icon: SiVercel, color: "text-white" },
    nestjs: { icon: SiNestjs, color: "text-[#E0234E]" },
    fastify: { icon: SiFastify, color: "text-white" },
    django: { icon: SiDjango, color: "text-[#092E20]" },
    flask: { icon: SiFlask, color: "text-white" },
    go: { icon: SiGo, color: "text-[#00ADD8]" },
    rust: { icon: SiRust, color: "text-[#DEA584]" },
    csharp: { icon: SiSharp, color: "text-[#239120]" },
};

interface StackLogosProps {
    skills: string[];
    isOwnPost?: boolean;
}

export function StackLogos({ skills, isOwnPost }: StackLogosProps) {
    if (!skills || skills.length === 0) {
        if (isOwnPost) {
            return (
                <span className="text-xs text-blue-500 hover:underline cursor-pointer ml-2">
                    Add stacks
                </span>
            );
        }
        return null;
    }

    // Take maximum 5 logos
    const displayedSkills = skills
        .map(s => s.toLowerCase().trim())
        .filter(s => stackMap[s])
        .slice(0, 5);

    if (displayedSkills.length === 0) {
        if (isOwnPost) {
            return (
                <span className="text-xs text-blue-500 hover:underline cursor-pointer ml-2">
                    Add stacks
                </span>
            );
        }
        return null;
    }

    return (
        <div className="flex items-center gap-1.5 ml-2">
            {displayedSkills.map((skill, index) => {
                const { icon: Icon, color } = stackMap[skill];
                return (
                    <div key={index} className={`transition-transform hover:scale-110 ${color}`}>
                        <Icon size={14} />
                    </div>
                );
            })}
            {skills.length > 5 && (
                <span className="text-[10px] text-neutral-500 font-medium ml-0.5">
                    +{skills.length - 5}
                </span>
            )}
        </div>
    );
}
