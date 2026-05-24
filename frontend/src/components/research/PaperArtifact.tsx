"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { PaperArtifact, ExperimentIdea } from "@/types/artifact";
import { HeatIndicator } from "./HeatIndicator";
import { MarkdownSection } from "./MarkdownSection";
import { RelatedPapers } from "./RelatedPapers";

interface PaperArtifactProps {
  artifact: PaperArtifact;
  onAskQuestion?: (artifactId: string) => void;
  onSelectRelatedPaper?: (paperId: string) => void;
  className?: string;
}

const ExperimentIcon = ({
  className,
}: React.SVGProps<SVGSVGElement> & { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
);

const difficultyColors = {
  easy: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  advanced: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

function ExperimentCard({ experiment }: { experiment: ExperimentIdea }) {
  return (
    <div className="group p-5 rounded-xl border border-border/60 bg-card/50 hover:border-primary/25 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-muted/60 flex items-center justify-center border border-border/50">
          <ExperimentIcon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-sm font-medium leading-snug text-foreground/95 group-hover:text-primary transition-colors">
              {experiment.title}
            </h4>
            <span
              className={cn(
                "shrink-0 text-[10px] px-2 py-0.5 rounded border uppercase tracking-wide font-medium",
                difficultyColors[experiment.difficulty]
              )}
            >
              {experiment.difficulty}
            </span>
          </div>
          <p className="text-sm text-muted-foreground/80 leading-relaxed">
            {experiment.description}
          </p>
          {experiment.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {experiment.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-5 border-border/50 font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PaperArtifact({
  artifact,
  onAskQuestion,
  onSelectRelatedPaper,
  className,
}: PaperArtifactProps) {
  return (
    <article
      className={cn(
        "max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500",
        className
      )}
    >
      {/* Header */}
      <header className="space-y-5 mb-10">
        {/* Title and Badge Row */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-3">
            <Badge variant="outline" className="text-xs px-2.5 py-1 bg-muted/30 hover:bg-muted/50">
              {artifact.publicationType}
            </Badge>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-foreground/95 tracking-tight">
              {artifact.title}
            </h1>
          </div>
          <HeatIndicator score={artifact.heatScore} size="lg" className="shrink-0" />
        </div>

        {/* Author row */}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground/90">
            <span className="font-medium text-foreground/80">{artifact.authors.slice(0, 4).join(", ")}</span>
            {artifact.authors.length > 4 && (
              <span className="text-muted-foreground/60"> and {artifact.authors.length - 4} more</span>
            )}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <span>{artifact.year}</span>
            <span className="text-border/60">·</span>
            <span>{artifact.source}</span>
            {artifact.doi && (
              <>
                <span className="text-border/60">·</span>
                <a 
                  href={`https://doi.org/${artifact.doi}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-mono hover:text-primary transition-colors"
                >
                  {artifact.doi}
                </a>
              </>
            )}
          </div>
        </div>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4 px-5 rounded-lg bg-muted/20 border border-border/40">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground/80">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{artifact.readTime} min read</span>
          </div>
          <div className="w-px h-4 bg-border/50 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground/80">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.51 0-4.95.443-7.293 1.228-1.584.233-2.707 1.626-2.707 3.228v6.51c0 1.602 1.123 2.995 2.707 3.228" />
            </svg>
            <span>{artifact.keyClaims.length} key claims</span>
          </div>
          <div className="w-px h-4 bg-border/50 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground/80">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
            <span>{artifact.experiments.length} experiments</span>
          </div>
        </div>

        {/* Tags */}
        {artifact.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {artifact.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2.5 py-1 bg-muted/40 hover:bg-muted/60 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {/* Abstract */}
      {artifact.abstract && (
        <section className="mb-10 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Abstract
          </h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-base leading-7 text-foreground/85 font-light">
              {artifact.abstract}
            </p>
          </div>
        </section>
      )}

      <Separator className="my-8 bg-border/40" />

      {/* Summary */}
      {artifact.summary && (
        <section className="mb-10 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Summary
          </h2>
          <p className="text-sm leading-7 text-muted-foreground/90">
            {artifact.summary}
          </p>
        </section>
      )}

      {/* Why it Matters */}
      {artifact.whyItMatters && (
        <section className="mb-10 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Why It Matters
          </h2>
          <div className="rounded-lg border-l-4 border-primary/80 pl-5 py-4 pr-4 bg-accent/30">
            <p className="text-sm leading-7 text-foreground/90 italic">
              {artifact.whyItMatters}
            </p>
          </div>
        </section>
      )}

      {/* Key Claims */}
      {artifact.keyClaims.length > 0 && (
        <section className="mb-10 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Key Claims
          </h2>
          <ul className="space-y-2.5">
            {artifact.keyClaims.map((claim, index) => (
              <li
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-card/40 border border-border/50"
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-muted/60 border border-border/50 flex items-center justify-center text-xs font-mono font-medium text-muted-foreground/80">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-6 text-foreground/85">
                  {claim}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Artifact Sections */}
      {artifact.sections.length > 0 && (
        <section className="mb-10 space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Research Content
          </h2>
          {artifact.sections.map((section) => (
            <MarkdownSection key={section.id} section={section} />
          ))}
        </section>
      )}

      {/* Experiments */}
      {artifact.experiments.length > 0 && (
        <section className="mb-10 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Experiment Ideas
          </h2>
          <div className="space-y-3">
            {artifact.experiments.map((experiment) => (
              <ExperimentCard key={experiment.id} experiment={experiment} />
            ))}
          </div>
        </section>
      )}

      {/* Related Papers */}
      {artifact.relatedPapers.length > 0 && (
        <section className="mb-10">
          <Separator className="mb-6 bg-border/40" />
          <RelatedPapers
            papers={artifact.relatedPapers}
            onSelectPaper={onSelectRelatedPaper}
          />
        </section>
      )}

      {/* Ask Question CTA */}
      {onAskQuestion && (
        <div className="sticky bottom-6 mt-10 flex justify-center">
          <Button
            onClick={() => onAskQuestion(artifact.id)}
            className={cn(
              "gap-2.5 px-7 py-3 rounded-full text-sm font-medium",
              "bg-primary text-primary-foreground",
              "shadow-lg shadow-primary/25",
              "hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/35",
              "transition-all duration-200"
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Ask About This Paper
          </Button>
        </div>
      )}
    </article>
  );
}

export default PaperArtifact;