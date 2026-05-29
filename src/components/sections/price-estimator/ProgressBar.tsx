import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  step: 1 | 2 | 3;
  totalSteps: number;
  progressPercent: number;
}

const STEP_LABELS = ["Vehicle", "Your quote", "Claim it"] as const;

export function ProgressBar({ step, totalSteps, progressPercent }: ProgressBarProps) {
  return (
    <div
      className="max-w-3xl mx-auto mb-8"
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label="Quote progress"
      aria-valuetext={`Step ${step} of ${totalSteps}`}
    >
      <div className="flex items-center justify-between mb-3">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-[0.8125rem] transition-[background-color,color,border-color] duration-300",
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground/70"
              )}
            >
              {step > s ? (
                <CheckCircle2 className="w-4 h-4" strokeWidth={2.25} aria-hidden="true" />
              ) : (
                s
              )}
            </div>
            <span
              className={cn(
                "text-xs transition-colors hidden sm:inline",
                step >= s ? "text-foreground" : "text-foreground/70"
              )}
            >
              {STEP_LABELS[s - 1]}
            </span>
          </div>
        ))}
      </div>
      <div className="h-1 bg-border/70 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out bg-primary"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
