"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { PaperArtifact, FilterState } from "@/types/artifact";
import { PAPER_CATEGORIES, TRENDING_TOPICS } from "@/types/artifact";
import { PaperCard } from "./PaperCard";
import { TagFilter, SelectedTagsPills } from "./TagFilter";

interface SidebarProps {
  artifacts: PaperArtifact[];
  selectedId?: string;
  onSelectArtifact?: (id: string) => void;
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

const TrendIcon = ({
  trend,
  className,
}: {
  trend: "rising" | "stable" | "falling";
  className?: string;
}) => {
  if (trend === "rising") {
    return (
      <svg className={cn("text-emerald-500", className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    );
  }
  if (trend === "falling") {
    return (
      <svg className={cn("text-rose-500", className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 1.22m0 0l5.94-2.28m-5.94 2.28l2.28-5.941" />
      </svg>
    );
  }
  return (
    <svg className={cn("text-stone-500", className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
};

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

export function Sidebar({
  artifacts,
  selectedId,
  onSelectArtifact,
  selectedTags,
  onToggleTag,
  onClearTags,
  selectedCategories,
  onToggleCategory,
  searchQuery,
  onSearchChange,
  className,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);

  // Get all available tags
  const allTags = Array.from(
    new Set(artifacts.flatMap((a) => a.tags))
  ).sort();

  // Filter artifacts
  const filteredArtifacts = artifacts.filter((artifact) => {
    // Tag filter
    if (selectedTags.length > 0) {
      const hasTag = artifact.tags.some((tag) => selectedTags.includes(tag));
      if (!hasTag) return false;
    }
    // Category filter
    if (selectedCategories.length > 0) {
      if (!selectedCategories.includes(artifact.publicationType)) return false;
    }
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        artifact.title.toLowerCase().includes(query) ||
        artifact.summary.toLowerCase().includes(query) ||
        artifact.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const sidebarContent = (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Search */}
      <div className="px-3 py-3">
        <div className="relative">
          <SearchIcon />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search papers..."
            className="pl-9 h-9 bg-muted/30 border-transparent focus:border-input focus:bg-background transition-colors"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="px-3 pb-4 space-y-5">
          {/* Active Filters */}
          {(selectedTags.length > 0 || selectedCategories.length > 0) && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Active Filters
              </h3>
              <div className="flex flex-col gap-2">
                <SelectedTagsPills
                  tags={selectedTags}
                  onRemove={onToggleTag}
                />
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedCategories.map((cat) => (
                      <Badge
                        key={cat}
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-destructive/10"
                        onClick={() => onToggleCategory(cat)}
                      >
                        {cat}
                        <span className="ml-1 text-muted-foreground">×</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Trending Topics */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Trending Topics
            </h3>
            <div className="space-y-1">
              {TRENDING_TOPICS.map((topic) => (
                <button
                  key={topic.name}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors",
                    "hover:bg-accent hover:text-foreground",
                    "text-muted-foreground"
                  )}
                >
                  <span className="text-xs truncate">{topic.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-muted-foreground/60">
                      {topic.count}
                    </span>
                    <TrendIcon trend={topic.trend} className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Categories */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Categories
            </h3>
            <div className="space-y-1">
              {PAPER_CATEGORIES.map((category) => {
                const count = artifacts.filter(
                  (a) => a.publicationType === category
                ).length;
                const isSelected = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => onToggleCategory(category)}
                    className={cn(
                      "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors",
                      "hover:bg-accent",
                      isSelected
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    <span className="text-xs truncate">{category}</span>
                    <span className="text-[10px] font-mono text-muted-foreground/60">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Research Tags
              </h3>
              {selectedTags.length > 0 && (
                <button
                  onClick={onClearTags}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <TagFilter
              availableTags={allTags}
              selectedTags={selectedTags}
              onToggleTag={onToggleTag}
              onClearAll={onClearTags}
              showClearAll={false}
              size="sm"
            />
          </div>

          <Separator />

          {/* Papers List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Papers
              </h3>
              <span className="text-[10px] font-mono text-muted-foreground/60">
                {filteredArtifacts.length}
              </span>
            </div>
            <div className="space-y-2">
              {filteredArtifacts.map((artifact) => (
                <PaperCard
                  key={artifact.id}
                  artifact={artifact}
                  isSelected={selectedId === artifact.id}
                  onSelect={onSelectArtifact}
                  compact
                />
              ))}
              {filteredArtifacts.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No papers match your filters.
                </p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-shrink-0 flex-col border-r border-border/50 bg-muted/10">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Trigger */}
      <div className="lg:hidden fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setMobileOpen(true)}
          className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
          </svg>
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-80 p-0 flex flex-col">
          <SheetHeader className="px-4 py-3 border-b border-border/50">
            <SheetTitle className="text-base font-medium">
              Research Explorer
            </SheetTitle>
          </SheetHeader>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default Sidebar;