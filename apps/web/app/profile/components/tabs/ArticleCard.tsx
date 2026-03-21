import Image from "next/image";
import { MessageCircle, Heart } from "lucide-react";
import { Article } from "@stack/types";

type Props = {
    article: Article;
};

export function ArticleCard({ article }: Props) {
    return (
        <div className="flex justify-between items-start gap-6 py-6 border-b">
            <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-lg font-semibold">{article.title}</h3>

                <p className="text-sm text-muted-foreground">
                    {article.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                        <MessageCircle size={16} />
                        {article.comments}
                    </div>

                    <div className="flex items-center gap-1">
                        <Heart size={16} />
                        {article.likes}
                    </div>

                    <span>{new Date(article.createdAt).toDateString()}</span>
                </div>
            </div>

            <Image
                src={article.thumbnail}
                alt={article.title}
                width={120}
                height={80}
                className="rounded-lg object-cover"
            />
        </div>
    );
}
