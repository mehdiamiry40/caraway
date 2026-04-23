export const fieldSurfaceClasses =
  "rounded-lg border border-border bg-card ring-offset-background shadow-[0_1px_0_0_hsl(var(--shadow-color)/0.08)] transition-all duration-200 motion-reduce:transition-none";

export const fieldStateClasses = [
  "hover:border-primary/40",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_hsl(var(--accent)/0.12)]",
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border",
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/[0.04] aria-[invalid=true]:focus-visible:ring-destructive/30 aria-[invalid=true]:focus-visible:border-destructive",
].join(" ");

export const fieldAutofillClasses =
  "[&:-webkit-autofill]:shadow-[0_0_0_1000px_hsl(var(--card))_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))]";
