import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts, getBlogPostBySlug, getReadingTime } from "@/lib/data/blog";
import { articleJsonLd, breadcrumbJsonLd, createMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

/** ISR: refresh blog HTML hourly. */
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return createMetadata({
      title: "Post not found",
      description: "This blog post could not be found.",
      path: "/blog",
      noIndex: true,
    });
  }

  return createMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: [post.category, ...post.tags, "MT5", "TradeBib", "forex bots"],
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updatedAt || post.date,
    authors: [post.author],
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const reading = getReadingTime(post.content);
  const related = blogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={[
          articleJsonLd({
            title: post.title,
            excerpt: post.excerpt,
            slug: post.slug,
            author: post.author,
            date: post.date,
            updatedAt: post.updatedAt,
            category: post.category,
            tags: post.tags,
            words: reading.words,
            minutes: reading.minutes,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <Button variant="ghost" size="sm" className="mb-8" asChild>
        <Link href="/blog">
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>
      </Button>

      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{post.category}</Badge>
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <Clock className="h-3.5 w-3.5" />
            {reading.text}
          </span>
          <span className="text-muted-foreground text-xs">{reading.words} words</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
        <p className="text-muted-foreground mt-4 text-lg">{post.excerpt}</p>
        <div className="text-muted-foreground mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-foreground font-medium">{post.author}</span>
          <span>·</span>
          <time dateTime={post.date}>{post.date}</time>
          {post.updatedAt ? (
            <>
              <span>·</span>
              <span>Updated {post.updatedAt}</span>
            </>
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="gap-1">
              <Tag className="h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      <MarkdownContent content={post.content} />

      {related.length > 0 ? (
        <section className="border-border/60 mt-16 border-t pt-10">
          <h2 className="mb-4 text-xl font-semibold">More in {post.category}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/blog/${item.slug}`}
                className="border-border/70 bg-card/60 hover:border-sky-500/40 rounded-xl border p-4 transition-colors"
              >
                <p className="font-medium hover:text-sky-300">{item.title}</p>
                <p className="text-muted-foreground mt-1 text-sm">{item.excerpt}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  {getReadingTime(item.content).text}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
