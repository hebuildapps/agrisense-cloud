"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearAll?: () => void;
  showClearAll?: boolean;
  size?: "sm" | "md";
}

export function TagFilter({
  availableTags,
  selectedTags,
  onToggleTag,
  onClearAll,
  showClearAll = true,
  size = "sm",
}: TagFilterProps) {
  const sizeClasses = {
    sm: {
      badge: "text-[10px] px-2 py-0.5 h-5",
      container: "gap-1",
    },
    md: {
      badge: "text-xs px-2.5 py-1 h-6",
      container: "gap-1.5",
    },
  };

  const s = sizeClasses[size];

  return (
    <div className="flex flex-col gap-2">
      {showClearAll && selectedTags.length > 0 && (
        <button
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors text-left"
        >
          Clear all ({selectedTags.length})
        </button>
      )}
      <div className={cn("flex flex-wrap", s.container)}>
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggleTag(tag)}
              className={cn(
                "rounded-md border font-medium transition-all duration-150",
                "hover:scale-[1.02] active:scale-[0.98]",
                "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
                s.badge,
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : cn(
                      "bg-transparent text-muted-foreground",
                      "border-border/60 hover:border-primary/30 hover:text-foreground"
                    )
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Horizontal scrollable version for compact spaces
export function TagFilterHorizontal({
  availableTags,
  selectedTags,
  onToggleTag,
  size = "sm",
}: TagFilterProps) {
  const sizeClasses = {
    sm: {
      badge: "text-[10px] px-2 py-0.5 h-5",
    },
    md: {
      badge: "text-xs px-2.5 py-1 h-6",
    },
  };

  const s = sizeClasses[size];

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      {availableTags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggleTag(tag)}
            className={cn(
              "flex-shrink-0 rounded-md border font-medium transition-all duration-150",
              "hover:scale-[1.02] active:scale-[0.98]",
              "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
              s.badge,
              isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : cn(
                    "bg-transparent text-muted-foreground",
                    "border-border/60 hover:border-primary/30 hover:text-foreground"
                  )
            )}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}

// Compact pill-only version
export function SelectedTagsPills({
  tags,
  onRemove,
}: {
  tags: string[];
  onRemove: (tag: string) => void;
}) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="text-xs pl-2 pr-1.5 py-1 gap-1.5 bg-accent/70"
        >
          {tag}
          <button
            onClick={() => onRemove(tag)}
            className="ml-0.5 hover:bg-accent/50 rounded-sm transition-colors"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </Badge>
      ))}
    </div>
  );
}

export default TagFilter;