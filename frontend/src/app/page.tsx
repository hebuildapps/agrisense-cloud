"use client";

import { useState, useEffect } from "react";
import {
  Sidebar,
  PaperArtifact,
  AskAgentModal,
} from "@/components/research";
import { mockPaperArtifacts } from "@/data/mock-artifacts";
import type { PaperArtifact as PaperArtifactType } from "@/types/artifact";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [selectedId, setSelectedId] = useState<string>(mockPaperArtifacts[0]?.id || "");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [utilityPanelOpen, setUtilityPanelOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedArtifact = mockPaperArtifacts.find((a) => a.id === selectedId);

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSelectRelatedPaper = (paperId: string) => {
    setSelectedId(paperId);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading research artifacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <Sidebar
        artifacts={mockPaperArtifacts}
        selectedId={selectedId}
        onSelectArtifact={setSelectedId}
        selectedTags={selectedTags}
        onToggleTag={handleToggleTag}
        onClearTags={() => setSelectedTags([])}
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 lg:px-6 bg-muted/10">
          <div className="flex items-center gap-3">
            {/* Logo / Brand */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0a9.18 9.18 0 01-1.312-2.285m0 0A9.18 9.18 0 013 12c0-1.63.238-3.174.687-4.632m0 0L21 8m0 0l-3.313 1.368m-3.313 0L15 8m0 0l3.313 1.368M12 8v8" />
                </svg>
              </div>
              <span className="text-sm font-medium hidden sm:inline">AgriSense Research</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUtilityPanelOpen(true)}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A.75.75 0 014.5 5.25h13.5A.75.75 0 0118 6v12a.75.75 0 01-.75.75H4.5a.75.75 0 01-.75-.75V6zM3.75 15.75h13.5a.75.75 0 00.75-.75V8.25H3v7.25A.75.75 0 013.75 15.75z" />
              </svg>
              <span className="hidden sm:inline">Panels</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="hidden sm:inline">New</span>
            </Button>
          </div>
        </header>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
            {selectedArtifact ? (
              <PaperArtifact
                key={selectedArtifact.id}
                artifact={selectedArtifact}
                onAskQuestion={() => setAskModalOpen(true)}
                onSelectRelatedPaper={handleSelectRelatedPaper}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-muted-foreground">No Paper Selected</h3>
                <p className="text-sm text-muted-foreground/70 mt-1 max-w-xs">
                  Select a paper from the sidebar to view its research artifact.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>

      {/* Right Utility Panel (placeholder) */}
      <Sheet open={utilityPanelOpen} onOpenChange={setUtilityPanelOpen}>
        <SheetContent side="right" className="w-80 p-0">
          <SheetHeader className="px-4 py-3 border-b border-border/50">
            <SheetTitle className="text-base font-medium">
              Utility Panels
            </SheetTitle>
          </SheetHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-2xl font-semibold">{mockPaperArtifacts.length}</p>
                  <p className="text-xs text-muted-foreground">Papers</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-2xl font-semibold">
                    {Math.round(mockPaperArtifacts.reduce((sum, a) => sum + a.heatScore, 0) / mockPaperArtifacts.length)}
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Heat</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Reading Queue
              </h3>
              <div className="space-y-2">
                {mockPaperArtifacts.slice(0, 3).map((paper, i) => (
                  <div
                    key={paper.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedId === paper.id
                        ? "bg-accent border-primary/30"
                        : "bg-card border-border/50 hover:bg-accent/50"
                    )}
                    onClick={() => {
                      setSelectedId(paper.id);
                      setUtilityPanelOpen(false);
                    }}
                  >
                    <p className="text-sm font-medium line-clamp-2">{paper.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {paper.year} · {paper.readTime} min
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Coming Soon
              </h3>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50 border-dashed">
                <p className="text-sm text-muted-foreground">Annotations Panel</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Take notes and highlight key findings</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50 border-dashed">
                <p className="text-sm text-muted-foreground">Citation Graph</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Visualize paper relationships</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50 border-dashed">
                <p className="text-sm text-muted-foreground">AI Summarizer</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Generate TLDR summaries</p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Ask Agent Modal */}
      <AskAgentModal
        isOpen={askModalOpen}
        onClose={() => setAskModalOpen(false)}
        paperTitle={selectedArtifact?.title}
        paperId={selectedId}
      />
    </div>
  );
}
