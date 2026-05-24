"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PaperArtifact } from "@/types/artifact";
import { HeatBadge } from "./HeatIndicator";

interface PaperCardProps {
  artifact: PaperArtifact;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  compact?: boolean;
}

export function PaperCard({
  artifact,
  isSelected = false,
  onSelect,
  compact = false,
}: PaperCardProps) {
  // Truncate title intelligently
  const displayTitle = artifact.title.length > 80 
    ? artifact.title.substring(0, 77) + "..."
    : artifact.title;

  // Format author display
  const authorDisplay = artifact.authors.length > 0
    ? artifact.authors.slice(0, 2).join(", ")
    : "Unknown Author";
  const authorSuffix = artifact.authors.length > 2 ? ` +${artifact.authors.length - 2}` : "";

  if (compact) {
    return (
      <button
        onClick={() => onSelect?.(artifact.id)}
        className={cn(
          "w-full text-left px-3 py-3 rounded-lg border transition-all duration-200 group",
          "hover:bg-accent/60 hover:border-primary/25",
          "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
          isSelected
            ? "bg-accent/80 border-primary/40 shadow-sm ring-1 ring-primary/20"
            : "bg-transparent/40 border-border/60 hover:border-border/80"
        )}
      >
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex-1 min-w-0 space-y-1.5">
            <h4 className={cn(
              "text-sm font-medium leading-snug line-clamp-2 transition-colors",
              isSelected ? "text-primary" : "text-foreground/90 group-hover:text-primary"
            )}>
              {displayTitle}
            </h4>
            <p className="text-xs text-muted-foreground/80 truncate">
              {authorDisplay}{authorSuffix} · {artifact.year}
            </p>
          </div>
          <HeatBadge score={artifact.heatScore} className="shrink-0 mt-0.5" />
        </div>
        
        {artifact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-border/40">
            {artifact.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4 font-normal bg-muted/50 hover:bg-muted"
              >
                {tag}
              </Badge>
            ))}
            {artifact.tags.length > 2 && (
              <span className="text-[10px] text-muted-foreground/60 py-0.5">
                +{artifact.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={() => onSelect?.(artifact.id)}
      className={cn(
        "w-full text-left rounded-xl border p-5 transition-all duration-200 group",
        "hover:bg-accent/40 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5",
        "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
        isSelected
          ? "bg-accent/60 border-primary/35 shadow-lg shadow-primary/10 ring-1 ring-primary/15"
          : "bg-card/60 border-border/50"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <h3 className={cn(
            "text-base font-semibold leading-snug line-clamp-2 transition-colors",
            isSelected ? "text-primary" : "text-foreground/95 group-hover:text-primary"
          )}>
            {displayTitle}
          </h3>
          
          <div className="space-y-0.5">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground/80">
                {authorDisplay}
              </span>
              {authorSuffix && (
                <span className="text-muted-foreground/60">
                  {authorSuffix}
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground/70">
              {artifact.publicationType} · {artifact.year} · {artifact.readTime} min read
            </p>
          </div>
        </div>
        
        <HeatBadge score={artifact.heatScore} className="shrink-0 mt-0.5" />
      </div>

      {artifact.summary && (
        <p className="text-sm text-muted-foreground/80 mt-4 line-clamp-2 leading-relaxed">
          {artifact.summary}
        </p>
      )}

      {artifact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/40">
          {artifact.tags.slice(0, 4).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={cn(
                "text-xs px-2 py-0.5 font-normal",
                "border-border/50",
                "group-hover:border-primary/30 group-hover:text-primary transition-colors"
              )}
            >
              {tag}
            </Badge>
          ))}
          {artifact.tags.length > 4 && (
            <span className="text-xs text-muted-foreground/60 px-1.5 py-0.5">
              +{artifact.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/40 text-xs text-muted-foreground/70">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.51 0-4.95.443-7.293 1.228-1.584.233-2.707 1.626-2.707 3.228v6.51c0 1.602 1.123 2.995 2.707 3.228" />
          </svg>
          {artifact.keyClaims.length} claims
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
          {artifact.experiments.length} experiments
        </span>
        {artifact.relatedPapers.length > 0 && (
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            {artifact.relatedPapers.length} related
          </span>
        )}
      </div>
    </button>
  );
}

export default PaperCard;