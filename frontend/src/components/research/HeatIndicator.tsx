"use client";

import { cn } from "@/lib/utils";

interface HeatIndicatorProps {
  score: number; // 0-100
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

function getHeatColor(score: number): {
  bg: string;
  border: string;
  text: string;
  glow: string;
  label: string;
} {
  if (score >= 80) {
    return {
      bg: "bg-amber-950/60",
      border: "border-amber-500/40",
      text: "text-amber-400",
      glow: "shadow-[0_0_12px_rgba(251,191,36,0.3)]",
      label: "Sizzling",
    };
  }
  if (score >= 60) {
    return {
      bg: "bg-orange-950/60",
      border: "border-orange-500/40",
      text: "text-orange-400",
      glow: "shadow-[0_0_10px_rgba(249,115,22,0.25)]",
      label: "Hot",
    };
  }
  if (score >= 40) {
    return {
      bg: "bg-yellow-950/60",
      border: "border-yellow-500/40",
      text: "text-yellow-400",
      glow: "shadow-[0_0_8px_rgba(234,179,8,0.2)]",
      label: "Warm",
    };
  }
  return {
    bg: "bg-stone-900/60",
    border: "border-stone-600/40",
    text: "text-stone-400",
    glow: "shadow-none",
    label: "Cool",
  };
}

const HeatIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const HeatBar: React.FC<{ score: number; className?: string }> = ({
  score,
  className,
}) => (
  <div className={cn("flex gap-[2px]", className)}>
    {[...Array(10)].map((_, i) => {
      const threshold = (i + 1) * 10;
      const filled = score >= threshold;
      const partialFill =
        !filled && score > i * 10 && score < threshold;
      return (
        <div
          key={i}
          className={cn(
            "h-2 w-3 rounded-[2px] transition-all duration-300",
            filled
              ? "bg-amber-500"
              : partialFill
              ? "bg-amber-500/40"
              : "bg-stone-700/50"
          )}
        />
      );
    })}
  </div>
);

export function HeatIndicator({
  score,
  size = "md",
  showLabel = true,
  className,
}: HeatIndicatorProps) {
  const colors = getHeatColor(score);

  const sizeClasses = {
    sm: {
      container: "gap-1.5",
      icon: "w-3.5 h-3.5",
      bar: "h-1.5 w-16",
      score: "text-xs",
      label: "text-[10px]",
    },
    md: {
      container: "gap-2",
      icon: "w-4 h-4",
      bar: "h-2 w-20",
      score: "text-sm",
      label: "text-xs",
    },
    lg: {
      container: "gap-2.5",
      icon: "w-5 h-5",
      bar: "h-2.5 w-24",
      score: "text-base",
      label: "text-sm",
    },
  };

  const s = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex flex-col",
        s.container,
        colors.bg,
        colors.border,
        "border rounded-lg px-2.5 py-2",
        colors.glow,
        className
      )}
    >
      <div className={cn("flex items-center gap-2", s.container)}>
        <HeatIcon className={cn(colors.text, s.icon)} />
        <span className={cn(colors.text, "font-mono font-medium", s.score)}>
          {score}
        </span>
        {showLabel && (
          <span className={cn(colors.text, "font-light", s.label)}>
            {colors.label}
          </span>
        )}
      </div>
      <HeatBar score={score} className={s.bar} />
    </div>
  );
}

export function HeatBadge({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const colors = getHeatColor(score);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-mono font-medium",
        colors.bg,
        colors.border,
        "border",
        colors.text,
        className
      )}
    >
      <HeatIcon className="w-3 h-3" />
      {score}
    </div>
  );
}

export default HeatIndicator;