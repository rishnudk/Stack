import { notFound } from "next/navigation"

const articles = {
    "blockchain-bank-stops-working": {
        title: "Blockchain Isn't Important, Until Your Bank Stops Working",
        author: "MD Ayaan Siddiqui",
        content: `
    When banks fail, people suddenly realize why decentralized systems matter.

    Blockchain offers transparency, security, and resilience that centralized
    systems sometimes lack.
    `,
    },
}

export default function ArticlePage({
    params,
}: {
    params: { slug: string }
}) {
    const article = articles[params.slug as keyof typeof articles]

    if (!article) return notFound()

    return (
        <div className="max-w-3xl mx-auto py-10">

            <h1 className="text-3xl font-bold mb-4">
                {article.title}
            </h1>

            <p className="text-sm text-zinc-400 mb-8">
                by {article.author}
            </p>

            <article className="prose prose-invert">
                {article.content}
            </article>

        </div>
    )
}