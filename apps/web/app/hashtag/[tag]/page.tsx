import { HashtagFeed } from "./HashtagFeed";
import { Hash } from "lucide-react";

interface Props {
    params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { tag } = await params;
    return {
        title: `#${tag} — Stack`,
        description: `Posts tagged with #${tag} on Stack`,
    };
}

export default async function HashtagPage({ params }: Props) {
    const { tag } = await params;

    return (
        <div className="flex justify-center min-h-screen bg-black">
            <div className="w-full max-w-[600px] border-x border-neutral-800 min-h-screen">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-neutral-800 p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sky-500/10 flex items-center justify-center">
                        <Hash size={18} className="text-sky-400" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-xl">#{tag}</h1>
                        <p className="text-neutral-500 text-sm">Posts tagged with #{tag}</p>
                    </div>
                </div>

                {/* Posts */}
                <HashtagFeed tag={tag} />
            </div>
        </div>
    );
}
