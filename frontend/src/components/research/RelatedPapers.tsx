"use client";

import { cn } from "@/lib/utils";
import type { RelatedPaper } from "@/types/artifact";
import { HeatBadge } from "./HeatIndicator";

interface RelatedPapersProps {
  papers: RelatedPaper[];
  onSelectPaper?: (id: string) => void;
}

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export function RelatedPapers({
  papers,
  onSelectPaper,
}: RelatedPapersProps) {
  if (!papers || papers.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No related papers available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Related Papers
        </h3>
        <span className="text-xs text-muted-foreground">{papers.length}</span>
      </div>

      <div className="space-y-2">
        {papers.map((paper, index) => (
          <button
            key={paper.id}
            onClick={() => onSelectPaper?.(paper.id)}
            className={cn(
              "w-full text-left p-3 rounded-lg border transition-all duration-200",
              "group hover:bg-accent/50 hover:border-primary/20 hover:shadow-sm",
              "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
              "border-border/50 bg-card"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-muted-foreground font-mono mt-0.5 flex-shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {paper.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {paper.authors}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {paper.year} · {paper.reason}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <HeatBadge score={paper.heatScore} />
                <ArrowIcon className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-2 ml-6">
              {paper.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RelatedPapers;