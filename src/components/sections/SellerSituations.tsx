import { ClipboardCheck, MapPin } from "lucide-react";
import {
  sellerScenarios,
  type SellerScenario,
} from "@/data/seller-scenarios";

function ScenarioCard({ scenario }: { scenario: SellerScenario }) {
  return (
    <article className="flex h-full flex-col border border-border bg-card p-5 hover:border-primary/60 sm:p-7">
      <span className="flex h-11 w-11 items-center justify-center bg-secondary text-primary">
        <ClipboardCheck className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-display text-xl font-semibold leading-snug text-foreground">
        {scenario.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">
        {scenario.description}
      </p>
      <footer className="mt-6 border-t border-border pt-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-accent-ink" aria-hidden="true" />
          {scenario.location}
        </div>
        <p className="mt-1 text-sm font-medium text-foreground">
          {scenario.vehicle}
        </p>
      </footer>
    </article>
  );
}

export function SellerSituations() {
  return (
    <section
      id="seller-situations"
      className="section-y scroll-mt-header border-y border-border bg-background"
      aria-labelledby="seller-situations-heading"
    >
      <div className="site-container">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="eyebrow mb-5">Seller situations</p>
          <h2
            id="seller-situations-heading"
            className="font-display text-3xl font-bold leading-[1.1] text-foreground text-balance sm:text-4xl md:text-3xl"
          >
            What to prepare for common vehicle sales.
          </h2>
          {/* The "not customer reviews" disclaimer stays — it's the one thing
              here a reader can't infer from the cards. */}
          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg">
            Example situations, not customer reviews.
          </p>
        </div>

        <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {sellerScenarios.map((scenario) => (
            <li key={scenario.id}>
              <ScenarioCard scenario={scenario} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
