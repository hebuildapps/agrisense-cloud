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
  if (compact) {
    return (
      <button
        onClick={() => onSelect?.(artifact.id)}
        className={cn(
          "w-full text-left px-3 py-2.5 rounded-md border transition-all duration-200 group",
          "hover:bg-accent/50 hover:border-primary/20",
          "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
          isSelected
            ? "bg-accent border-primary/30 shadow-sm"
            : "bg-transparent border-border/50 hover:border-border"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {artifact.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {artifact.authors[0]}
              {artifact.authors.length > 1 && " et al."} · {artifact.year}
            </p>
          </div>
          <HeatBadge score={artifact.heatScore} />
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {artifact.tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4"
            >
              {tag}
            </Badge>
          ))}
          {artifact.tags.length > 2 && (
            <span className="text-[10px] text-muted-foreground">
              +{artifact.tags.length - 2}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => onSelect?.(artifact.id)}
      className={cn(
        "w-full text-left rounded-lg border p-4 transition-all duration-200 group",
        "hover:bg-accent/50 hover:border-primary/20 hover:shadow-md",
        "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
        isSelected
          ? "bg-accent border-primary/30 shadow-md"
          : "bg-card border-border/50 hover:border-border"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-serif font-medium leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {artifact.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5">
            <span className="font-medium">
              {artifact.authors.slice(0, 2).join(", ")}
            </span>
            {artifact.authors.length > 2 && (
              <span className="text-muted-foreground/70">
                {" "}
                +{artifact.authors.length - 2}
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {artifact.publicationType} · {artifact.year}
          </p>
        </div>
        <HeatBadge score={artifact.heatScore} />
      </div>

      <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
        {artifact.summary}
      </p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {artifact.tags.slice(0, 3).map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className={cn(
              "text-xs px-2 py-0.5",
              "border-border/60",
              "group-hover:border-primary/30 group-hover:text-primary transition-colors"
            )}
          >
            {tag}
          </Badge>
        ))}
        {artifact.tags.length > 3 && (
          <span className="text-xs text-muted-foreground px-1.5 py-0.5">
            +{artifact.tags.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/30">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {artifact.readTime} min read
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.51 0-4.95.443-7.293 1.228-1.584.233-2.707 1.626-2.707 3.228v6.51c0 1.602 1.123 2.995 2.707 3.228"
            />
          </svg>
          {artifact.keyClaims.length} key claims
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
            />
          </svg>
          {artifact.relatedPapers.length} related
        </div>
      </div>
    </button>
  );
}

export default PaperCard;