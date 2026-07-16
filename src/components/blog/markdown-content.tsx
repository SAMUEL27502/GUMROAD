"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function MarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn("markdown-body space-y-4 text-[15px] leading-7", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="mt-8 scroll-mt-24 text-2xl font-semibold tracking-tight text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 scroll-mt-24 text-xl font-semibold text-foreground">{children}</h3>
          ),
          p: ({ children }) => <p className="text-muted-foreground">{children}</p>,
          ul: ({ children }) => (
            <ul className="text-muted-foreground list-disc space-y-2 pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="text-muted-foreground list-decimal space-y-2 pl-5">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          a: ({ href, children }) => {
            const external = href?.startsWith("http");
            if (href?.startsWith("/")) {
              return (
                <Link href={href} className="font-medium text-sky-400 hover:text-sky-300">
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                className="font-medium text-sky-400 hover:text-sky-300"
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {children}
              </a>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-border/80 text-muted-foreground border-l-2 pl-4 italic">
              {children}
            </blockquote>
          ),
          code: ({ className: codeClass, children }) => {
            const isBlock = Boolean(codeClass);
            if (isBlock) {
              return (
                <code className="font-mono text-sm text-sky-200">{children}</code>
              );
            }
            return (
              <code className="bg-muted/60 rounded-md px-1.5 py-0.5 font-mono text-[13px] text-sky-300">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="border-border/60 bg-muted/40 overflow-x-auto rounded-xl border p-4 text-sm">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-border/60 text-muted-foreground border-b px-3 py-2 text-left font-medium">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-border/40 border-b px-3 py-2 text-foreground/90">{children}</td>
          ),
          hr: () => <hr className="border-border/60 my-8" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
