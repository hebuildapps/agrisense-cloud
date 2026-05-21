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

function ExperimentCard({
  experiment,
}: {
  experiment: ExperimentIdea;
}) {
  return (
    <div className="group p-4 rounded-lg border border-border/50 bg-card hover:border-primary/20 hover:shadow-sm transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
          <ExperimentIcon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium leading-tight text-foreground group-hover:text-primary transition-colors">
              {experiment.title}
            </h4>
            <span
              className={cn(
                "flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wide font-medium",
                difficultyColors[experiment.difficulty]
              )}
            >
              {experiment.difficulty}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {experiment.description}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {experiment.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 border-border/40"
              >
                {tag}
              </Badge>
            ))}
          </div>
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
        "max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500",
        className
      )}
    >
      {/* Header */}
      <header className="space-y-4 mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Badge variant="outline" className="mb-3 text-xs">
              {artifact.publicationType}
            </Badge>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold leading-tight text-foreground">
              {artifact.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {artifact.authors.join(", ")}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              {artifact.year} · {artifact.source}
              {artifact.doi && (
                <span className="ml-2 font-mono">{artifact.doi}</span>
              )}
            </p>
          </div>
          <HeatIndicator
            score={artifact.heatScore}
            size="lg"
            className="flex-shrink-0"
          />
        </div>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-4 py-3 border-y border-border/50 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
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
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{artifact.readTime} min read</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5 text-muted-foreground">
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
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.51 0-4.95.443-7.293 1.228-1.584.233-2.707 1.626-2.707 3.228v6.51c0 1.602 1.123 2.995 2.707 3.228"
              />
            </svg>
            <span>{artifact.keyClaims.length} key claims</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5 text-muted-foreground">
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
                d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
              />
            </svg>
            <span>{artifact.experiments.length} experiments</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {artifact.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-2.5 py-1 bg-accent/60 hover:bg-accent transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      {/* Summary Section */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Abstract
        </h2>
        <p className="text-base leading-relaxed text-foreground/90">
          {artifact.abstract}
        </p>
      </section>

      <Separator className="my-8" />

      {/* Summary */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Summary
        </h2>
        <p className="text-base leading-relaxed text-foreground/90">
          {artifact.summary}
        </p>
      </section>

      {/* Why it Matters */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Why It Matters
        </h2>
        <div className="rounded-lg border-l-2 border-primary pl-4 py-2 bg-accent/20">
          <p className="text-base leading-relaxed text-foreground/90 italic">
            {artifact.whyItMatters}
          </p>
        </div>
      </section>

      {/* Key Claims */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Key Claims
        </h2>
        <ul className="space-y-2">
          {artifact.keyClaims.map((claim, index) => (
            <li
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border/50"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-mono text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm leading-relaxed text-foreground/90">
                {claim}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Artifact Sections (markdown/diagram/metrics) */}
      {artifact.sections.length > 0 && (
        <section className="mb-8 space-y-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Research Content
          </h2>
          {artifact.sections.map((section) => (
            <MarkdownSection key={section.id} section={section} />
          ))}
        </section>
      )}

      {/* Experiments */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Experiment Ideas
        </h2>
        <div className="space-y-3">
          {artifact.experiments.map((experiment) => (
            <ExperimentCard key={experiment.id} experiment={experiment} />
          ))}
        </div>
      </section>

      {/* Related Papers */}
      <section className="mb-8">
        <Separator className="mb-6" />
        <RelatedPapers
          papers={artifact.relatedPapers}
          onSelectPaper={onSelectRelatedPaper}
        />
      </section>

      {/* Ask Question CTA */}
      {onAskQuestion && (
        <div className="sticky bottom-4 mt-8 flex justify-center">
          <Button
            onClick={() => onAskQuestion(artifact.id)}
            className={cn(
              "gap-2 px-6 py-2.5 rounded-full",
              "bg-primary text-primary-foreground",
              "shadow-lg shadow-primary/20",
              "hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30",
              "transition-all duration-200"
            )}
          >
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
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
            Ask About This Paper
          </Button>
        </div>
      )}
    </article>
  );
}

export default PaperArtifact;