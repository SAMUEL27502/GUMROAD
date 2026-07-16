import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/** Server Component — keeps react-markdown out of the client bundle. */
export function MarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-100 prose-code:rounded prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-teal-300 prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-zinc-800 prose-pre:bg-zinc-950 prose-blockquote:border-teal-500/40 prose-blockquote:text-zinc-400 prose-img:rounded-xl prose-hr:border-zinc-800",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
