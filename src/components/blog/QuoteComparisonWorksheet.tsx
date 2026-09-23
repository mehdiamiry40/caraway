"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type QuoteEntry = {
  buyer: string;
  licence: string;
  headlineOffer: string;
  deductions: string;
  validity: string;
  assumptions: string;
  pickup: string;
  payment: string;
  receiptProvided: boolean;
};

type TextField = Exclude<keyof QuoteEntry, "receiptProvided">;

const QUOTE_LABELS = ["Quote A", "Quote B", "Quote C"] as const;
const LICENCE_REGISTER_URL =
  "https://www.qld.gov.au/community/fair-trading/regulated-industries-licensing-and-legislation/motor-industry-regulation/check-a-motor-licence";
const AUD_FORMATTER = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function emptyQuote(): QuoteEntry {
  return {
    buyer: "",
    licence: "",
    headlineOffer: "",
    deductions: "",
    validity: "",
    assumptions: "",
    pickup: "",
    payment: "",
    receiptProvided: false,
  };
}

function emptyWorksheet(): QuoteEntry[] {
  return QUOTE_LABELS.map(() => emptyQuote());
}

function amount(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function effectiveNet(quote: QuoteEntry): number | null {
  const offer = amount(quote.headlineOffer);
  if (offer === null) return null;

  const enteredDeductions = quote.deductions.trim();
  const deductions = amount(quote.deductions);
  if (enteredDeductions !== "" && deductions === null) return null;

  return offer - (deductions ?? 0);
}

function recordedValue(value: string): string {
  return value.trim() || "Not recorded";
}

function recordedAmount(value: string, blankLabel = "Not recorded"): string {
  if (value.trim() === "") return blankLabel;
  const parsed = amount(value);
  return parsed === null ? "Invalid entry" : AUD_FORMATTER.format(parsed);
}

function QuotePrintSnapshot({
  quotes,
  netAmounts,
}: {
  quotes: QuoteEntry[];
  netAmounts: Array<number | null>;
}) {
  return (
    <section className="quote-worksheet-print-root hidden">
      <div className="worksheet-print-header">
        <p>Caraway seller worksheet</p>
        <h1>Compare three vehicle-buyer quotes</h1>
        <p>
          Compare the written terms for the same vehicle and access details.
          This worksheet records what you entered; it does not validate a
          buyer, licence, or offer.
        </p>
      </div>

      {quotes.map((quote, index) => {
        const net = netAmounts[index];
        const fields = [
          ["Buyer or legal name", recordedValue(quote.buyer)],
          ["Licence number supplied", recordedValue(quote.licence)],
          ["Headline offer", recordedAmount(quote.headlineOffer)],
          [
            "Deductions",
            recordedAmount(quote.deductions, "Not entered (treated as $0)"),
          ],
          [
            "Effective net",
            net === null ? "Not calculated" : AUD_FORMATTER.format(net),
          ],
          ["Quote validity or expiry", recordedValue(quote.validity)],
          [
            "Assumptions and revision triggers",
            recordedValue(quote.assumptions),
          ],
          [
            "Pickup, equipment and access terms",
            recordedValue(quote.pickup),
          ],
          ["Payment method and timing", recordedValue(quote.payment)],
          [
            "Written receipt and buyer details",
            quote.receiptProvided ? "Recorded" : "Not recorded",
          ],
        ] as const;

        return (
          <section className="worksheet-print-quote" key={QUOTE_LABELS[index]}>
            <h2>{QUOTE_LABELS[index]}</h2>
            <dl>
              {fields.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}

      <div className="worksheet-print-footer">
        <p>
          Check Queensland&apos;s public motor-licence register and the complete
          written transaction before deciding:
        </p>
        <a href={LICENCE_REGISTER_URL}>{LICENCE_REGISTER_URL}</a>
      </div>
    </section>
  );
}

export function QuoteComparisonWorksheet() {
  const [quotes, setQuotes] = useState<QuoteEntry[]>(emptyWorksheet);
  const [isPrinting, setIsPrinting] = useState(false);
  const printCycleRef = useRef(0);
  const netAmounts = quotes.map(effectiveNet);
  const enteredNetAmounts = netAmounts.filter(
    (value): value is number => value !== null,
  );
  const highestNet =
    enteredNetAmounts.length > 0 ? Math.max(...enteredNetAmounts) : null;
  const highestCount =
    highestNet === null
      ? 0
      : netAmounts.filter((value) => value === highestNet).length;

  function updateText(index: number, field: TextField, value: string) {
    setQuotes((current) =>
      current.map((quote, quoteIndex) =>
        quoteIndex === index ? { ...quote, [field]: value } : quote,
      ),
    );
  }

  function updateReceipt(index: number, checked: boolean) {
    setQuotes((current) =>
      current.map((quote, quoteIndex) =>
        quoteIndex === index
          ? { ...quote, receiptProvided: checked }
          : quote,
      ),
    );
  }

  useEffect(() => {
    if (!isPrinting) return;

    const printCycle = ++printCycleRef.current;
    const finishPrinting = () => {
      if (printCycleRef.current !== printCycle) return;
      document.body.classList.remove("quote-worksheet-printing");
      setIsPrinting(false);
    };

    document.body.classList.add("quote-worksheet-printing");
    window.addEventListener("afterprint", finishPrinting, { once: true });
    const timer = window.setTimeout(() => {
      try {
        window.print();
      } catch {
        finishPrinting();
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("afterprint", finishPrinting);
      document.body.classList.remove("quote-worksheet-printing");
    };
  }, [isPrinting]);

  return (
    <>
      <section
        id="compare-three-vehicle-buyer-quotes"
        aria-labelledby="quote-comparison-heading"
        className="quote-comparison-worksheet scroll-mt-24 mt-12 rounded-xl border border-border bg-card p-5 sm:p-7"
      >
      <div className="border-b border-border/70 pb-6">
        <p className="eyebrow mb-3">Local-only worksheet</p>
        <h2
          id="quote-comparison-heading"
          className="font-display text-2xl text-foreground sm:text-3xl"
        >
          Compare three vehicle-buyer quotes
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/80 sm:text-base">
          Record the written terms for the same vehicle and access details.
          The effective net amount subtracts only the deductions you enter, so
          compare the assumptions, revision triggers, pickup, payment, licence
          and receipt details as well as the headline figure.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Entries stay in this browser tab and are not submitted to Caraway.{" "}
          <a
            href={LICENCE_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-4 hover:text-accent-ink"
          >
            Check Queensland&apos;s public motor-licence register
          </a>
          .
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        {quotes.map((quote, index) => {
          const label = QUOTE_LABELS[index];
          const net = netAmounts[index];
          const isHighest = highestNet !== null && net === highestNet;
          const idPrefix = `buyer-quote-${index + 1}`;

          return (
            <fieldset
              key={label}
              className="min-w-0 rounded-lg border border-border/80 bg-background p-4"
            >
              <legend className="px-2 font-display text-lg text-foreground">
                {label}
              </legend>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor={`${idPrefix}-buyer`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Buyer or legal name
                  </label>
                  <input
                    id={`${idPrefix}-buyer`}
                    value={quote.buyer}
                    onChange={(event) =>
                      updateText(index, "buyer", event.target.value)
                    }
                    maxLength={160}
                    autoComplete="off"
                    className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${idPrefix}-licence`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Licence number supplied
                  </label>
                  <input
                    id={`${idPrefix}-licence`}
                    value={quote.licence}
                    onChange={(event) =>
                      updateText(index, "licence", event.target.value)
                    }
                    maxLength={80}
                    autoComplete="off"
                    placeholder="Record it, then check the register"
                    className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor={`${idPrefix}-offer`}
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Headline offer
                    </label>
                    <div className="relative">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                      >
                        $
                      </span>
                      <input
                        id={`${idPrefix}-offer`}
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        value={quote.headlineOffer}
                        onChange={(event) =>
                          updateText(index, "headlineOffer", event.target.value)
                        }
                        className="min-h-11 w-full rounded-md border border-input bg-background pl-7 pr-3 text-sm tabular-nums text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor={`${idPrefix}-deductions`}
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Deductions
                    </label>
                    <div className="relative">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                      >
                        $
                      </span>
                      <input
                        id={`${idPrefix}-deductions`}
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        value={quote.deductions}
                        onChange={(event) =>
                          updateText(index, "deductions", event.target.value)
                        }
                        className="min-h-11 w-full rounded-md border border-input bg-background pl-7 pr-3 text-sm tabular-nums text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  </div>
                </div>

                <output className="block rounded-md bg-secondary px-3 py-2.5 text-sm text-foreground">
                  Effective net: {net === null ? "Not entered" : AUD_FORMATTER.format(net)}
                  {isHighest ? (
                    <span className="ml-2 font-medium text-primary">
                      {highestCount > 1 ? "Joint highest entered net" : "Highest entered net"}
                    </span>
                  ) : null}
                </output>

                <div>
                  <label
                    htmlFor={`${idPrefix}-validity`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Quote validity or expiry
                  </label>
                  <input
                    id={`${idPrefix}-validity`}
                    value={quote.validity}
                    onChange={(event) =>
                      updateText(index, "validity", event.target.value)
                    }
                    maxLength={120}
                    autoComplete="off"
                    placeholder="For example: valid until Friday"
                    className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${idPrefix}-assumptions`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Assumptions and revision triggers
                  </label>
                  <textarea
                    id={`${idPrefix}-assumptions`}
                    value={quote.assumptions}
                    onChange={(event) =>
                      updateText(index, "assumptions", event.target.value)
                    }
                    maxLength={600}
                    rows={3}
                    className="w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${idPrefix}-pickup`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Pickup, equipment and access terms
                  </label>
                  <textarea
                    id={`${idPrefix}-pickup`}
                    value={quote.pickup}
                    onChange={(event) =>
                      updateText(index, "pickup", event.target.value)
                    }
                    maxLength={600}
                    rows={3}
                    className="w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${idPrefix}-payment`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Payment method and timing
                  </label>
                  <textarea
                    id={`${idPrefix}-payment`}
                    value={quote.payment}
                    onChange={(event) =>
                      updateText(index, "payment", event.target.value)
                    }
                    maxLength={400}
                    rows={2}
                    className="w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-border/70 px-3 py-2.5 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={quote.receiptProvided}
                    onChange={(event) =>
                      updateReceipt(index, event.target.checked)
                    }
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span>Written receipt and buyer details promised</span>
                </label>
              </div>
            </fieldset>
          );
        })}
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border/70">
        <table className="min-w-[42rem] w-full text-left text-sm">
          <caption className="bg-secondary/70 px-4 py-3 text-left font-display text-base text-foreground">
            Comparison summary
          </caption>
          <thead className="border-t border-border/70 bg-secondary/40 text-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Quote</th>
              <th scope="col" className="px-4 py-3 font-semibold">Buyer</th>
              <th scope="col" className="px-4 py-3 font-semibold">Offer</th>
              <th scope="col" className="px-4 py-3 font-semibold">Deductions</th>
              <th scope="col" className="px-4 py-3 font-semibold">Effective net</th>
              <th scope="col" className="px-4 py-3 font-semibold">Receipt details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {quotes.map((quote, index) => {
              const offer = amount(quote.headlineOffer);
              const deductions = amount(quote.deductions);
              const net = netAmounts[index];
              return (
                <tr key={QUOTE_LABELS[index]}>
                  <th scope="row" className="px-4 py-3 font-medium text-foreground">
                    {QUOTE_LABELS[index]}
                  </th>
                  <td className="px-4 py-3 text-foreground/80">
                    {quote.buyer || "—"}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-foreground/80">
                    {offer === null ? "—" : AUD_FORMATTER.format(offer)}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-foreground/80">
                    {deductions === null ? "—" : AUD_FORMATTER.format(deductions)}
                  </td>
                  <td className="px-4 py-3 tabular-nums font-medium text-foreground">
                    {net === null ? "—" : AUD_FORMATTER.format(net)}
                  </td>
                  <td className="px-4 py-3 text-foreground/80">
                    {quote.receiptProvided ? "Recorded" : "Not recorded"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        This worksheet does not validate a buyer, licence or offer. Check the
        public register and the complete written transaction before deciding.
      </p>

      <div className="worksheet-no-print mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setIsPrinting(true)}
          disabled={isPrinting}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Print or save as PDF
        </button>
        <button
          type="button"
          onClick={() => setQuotes(emptyWorksheet())}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-medium text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Clear worksheet
        </button>
      </div>
      </section>
      {isPrinting
        ? createPortal(
            <QuotePrintSnapshot quotes={quotes} netAmounts={netAmounts} />,
            document.body,
          )
        : null}
    </>
  );
}
