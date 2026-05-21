"use client";

import { cn } from "@/lib/utils";
import type { ArtifactSection } from "@/types/artifact";

interface MarkdownSectionProps {
  section: ArtifactSection;
  className?: string;
}

// Simple markdown-like renderer for research content
export function MarkdownSection({
  section,
  className,
}: MarkdownSectionProps) {
  const { type, title, content } = section;

  if (type === "markdown") {
    return (
      <div className={cn("space-y-4", className)}>
        <div
          className="prose prose-sm dark:prose-invert max-w-none
            prose-headings:font-serif prose-headings:text-foreground
            prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-6
            prose-h3:text-base prose-h3:font-medium
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-strong:text-foreground prose-strong:font-medium
            prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-[''] prose-code:after:content-['']
            prose-ul:my-2 prose-li:text-muted-foreground prose-li:marker:text-muted-foreground/50
            prose-blockquote:border-l-primary prose-blockquote:bg-accent/30 prose-blockquote:py-1
            prose-blockquote:text-muted-foreground
            prose-table:text-sm prose-th:bg-muted/50 prose-th:text-muted-foreground prose-td:text-muted-foreground
            [&>*:first-child]:mt-0"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(content),
          }}
        />
      </div>
    );
  }

  if (type === "diagram") {
    return (
      <div className={cn("rounded-lg border border-border/50 bg-card p-4", className)}>
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.16 10.332a1 1 0 01-1.011-.011l-3.5-5.916a1 1 0 011.844.022L10.62 8.2l3.75 6.75a1 1 0 01-1.25 1.448l-4.416-6.916a1 1 0 01.028-1.299l5.016-7.116a1 1 0 011.344.026l3.5 5.916a1 1 0 01-.021 1.114L12.69 10.72"
            />
          </svg>
          {title}
        </h4>
        <pre className="text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
          <code>{content}</code>
        </pre>
      </div>
    );
  }

  if (type === "code") {
    return (
      <div className={cn("rounded-lg border border-border/50 bg-card overflow-hidden", className)}>
        <div className="px-3 py-2 bg-muted/30 border-b border-border/30 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">{title}</span>
        </div>
        <pre className="text-sm font-mono p-4 overflow-x-auto bg-muted/10">
          <code className="text-foreground">{content}</code>
        </pre>
      </div>
    );
  }

  if (type === "metrics") {
    // Parse markdown table
    const lines = content.split("\n").filter((l) => l.trim());
    const headers = lines[0]
      ?.split("|")
      .filter((c) => c.trim())
      .map((c) => c.trim());
    const rows = lines.slice(2).map((row) =>
      row
        .split("|")
        .filter((c) => c.trim())
        .map((c) => c.trim())
    );

    return (
      <div className={cn("rounded-lg border border-border/50 bg-card overflow-hidden", className)}>
        <div className="px-4 py-3 bg-muted/30 border-b border-border/30">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
            {title}
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                {headers?.map((header, i) => (
                  <th
                    key={i}
                    className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={cn(
                        "px-4 py-2.5 text-muted-foreground",
                        cell.includes("↑") && "text-emerald-500",
                        cell.includes("↓") && "text-red-500"
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-4", className)}>
      <p className="text-sm text-muted-foreground">Unknown section type: {type}</p>
    </div>
  );
}

function renderMarkdown(md: string): string {
  return md
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Code blocks
    .replace(/```[\w]*\n([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Lists
    .replace(/^\- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    // Blockquotes
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Paragraphs (simple version)
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[a-z])(.+)$/gm, "<p>$1</p>")
    // Clean up empty tags
    .replace(/<p><\/p>/g, "");
}

export default MarkdownSection;