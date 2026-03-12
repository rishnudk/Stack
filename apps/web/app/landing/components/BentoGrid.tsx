"use client";

import { cn } from "@/lib/utils";
import {
    CheckCircle,
    Clock,
    Star,
    TrendingUp,
    Video,
    Globe,
} from "lucide-react";

export interface BentoItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    status?: string;
    tags?: string[];
    meta?: string;
    cta?: string;
    colSpan?: number;
    hasPersistentHover?: boolean;
    image?: string;
}

interface BentoGridProps {
    items: BentoItem[];
}

const itemsSample: BentoItem[] = [
    {
        title: "Analytics Dashboard",
        meta: "v2.4.1",
        description:
            "Real-time metrics with AI-powered insights and predictive analytics",
        icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
        status: "Live",
        tags: ["Statistics", "Reports", "AI"],
        colSpan: 2,
        hasPersistentHover: true,
    },
    {
        title: "Task Manager",
        meta: "84 completed",
        description: "Automated workflow management with priority scheduling",
        icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
        status: "Updated",
        tags: ["Productivity", "Automation"],
    },
    {
        title: "Media Library",
        meta: "12GB used",
        description: "Cloud storage with intelligent content processing",
        icon: <Video className="w-4 h-4 text-purple-500" />,
        tags: ["Storage", "CDN"],
        colSpan: 2,
    },
    {
        title: "Global Network",
        meta: "6 regions",
        description: "Multi-region deployment with edge computing",
        icon: <Globe className="w-4 h-4 text-sky-500" />,
        status: "Beta",
        tags: ["Infrastructure", "Edge"],
    },
];

function BentoGrid({ items = itemsSample }: BentoGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 max-w-7xl mx-auto">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={cn(
                        "group relative p-4 rounded-xl overflow-hidden transition-all duration-300",
                        "border border-gray-100/80 dark:border-white/10 bg-white dark:bg-[#0A0A0A]",
                        "hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)]",
                        "hover:-translate-y-0.5 will-change-transform",
                        item.colSpan === 2 ? "md:col-span-2" : "col-span-1",
                        {
                            "shadow-[0_2px_12px_rgba(0,0,0,0.03)] -translate-y-0.5":
                                item.hasPersistentHover,
                            "dark:shadow-[0_2px_12px_rgba(255,255,255,0.03)]":
                                item.hasPersistentHover,
                        }
                    )}
                >
                    {item.image && (
                        <div className="absolute inset-0 z-0 overflow-hidden rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100"
                            />
                        </div>
                    )}

                    <div
                        className={`absolute inset-0 ${item.hasPersistentHover
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            } transition-opacity duration-300`}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[4px_4px]" />
                    </div>

                    <div className="relative flex flex-col space-y-3 z-10">
                        <div className="flex items-center justify-between">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/10 group-hover:bg-linear-to-br transition-all duration-300">
                                {item.icon}
                            </div>
                            <span
                                className={cn(
                                    "text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm",
                                    "bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300",
                                    "transition-colors duration-300 group-hover:bg-black/10 dark:group-hover:bg-white/20"
                                )}
                            >
                                {item.status || "Active"}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 tracking-tight text-[15px]">
                                {item.title}
                                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
                                    {item.meta}
                                </span>
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug font-[425]">
                                {item.description}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                {item.tags?.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 rounded-md bg-black/5 dark:bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/20"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.cta || "Explore →"}
                            </span>
                        </div>
                    </div>

                    <div
                        className={`absolute inset-0 -z-10 rounded-xl p-px bg-linear-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 ${item.hasPersistentHover
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            } transition-opacity duration-300`}
                    />
                </div>
            ))}
        </div>
    );
}

function BentoGridDemo() {
    const demoItems: BentoItem[] = [
        {
            title: "Performance Analytics",
            meta: "v2.0",
            description: "Track your code performance with real-time insights and bottleneck detection.",
            icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
            status: "New",
            tags: ["Performance", "Charts"],
            colSpan: 2,
            image: "https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=1200&auto=format&fit=crop",
        },
        {
            title: "Automated Testing",
            meta: "99% Coverage",
            description: "Seamless integration with CI/CD for robust applications.",
            icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
            status: "Updated",
            tags: ["Testing", "CI/CD"],
            image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop",
        },
        {
            title: "Collaborative Tools",
            meta: "Active Users",
            description: "Built-in collaboration features for distributed teams.",
            icon: <Globe className="w-4 h-4 text-sky-500" />,
            tags: ["Teams", "Sync"],
            colSpan: 1,
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
        },
        {
            title: "Cloud Infrastructure",
            meta: "Edge Ready",
            description: "Scale globally with our distributed edge network computing.",
            icon: <Video className="w-4 h-4 text-purple-500" />,
            status: "Live",
            tags: ["Cloud", "Edge"],
            colSpan: 2,
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
        },
    ];

    return (
        <section className="py-24 bg-black">
            <div className="container mx-auto px-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center text-white">
                    Powerful Features
                </h2>
                <p className="mt-4 text-gray-400 text-center max-w-2xl mx-auto">
                    Everything you need to build, scale, and monitor your developer profile and projects in one place.
                </p>
            </div>
            <BentoGrid items={demoItems} />
        </section>
    );
}

export { BentoGrid, BentoGridDemo };
