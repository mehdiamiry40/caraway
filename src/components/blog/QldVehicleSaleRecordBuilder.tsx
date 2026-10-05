"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  buildQldVehicleSalePathway,
  DEFAULT_QLD_VEHICLE_SALE_INPUTS,
  QLD_SALE_SOURCE_LABELS,
  QLD_SALE_SOURCE_URLS,
  type QldBuyerType,
  type QldRegistrationStatus,
  type QldSaleOutcome,
  type QldVehicleSalePathwayInputs,
  type QldVehicleSalePathwayResult,
  type VehicleMovementPlan,
  type YesNoUnsure,
} from "@/lib/qld-vehicle-sale-pathway";

type SaleRecord = {
  sellerName: string;
  sellerContact: string;
  buyerName: string;
  buyerContact: string;
  buyerBusiness: string;
  buyerLicence: string;
  makeModel: string;
  yearColour: string;
  identifier: string;
  plateAndStatus: string;
  odometer: string;
  saleDate: string;
  saleTime: string;
  amount: string;
  payment: string;
  keysAndItems: string;
  conditionNotes: string;
  officialReferences: string;
};

type SaleRecordTextField = keyof SaleRecord;

function emptySaleRecord(): SaleRecord {
  return {
    sellerName: "",
    sellerContact: "",
    buyerName: "",
    buyerContact: "",
    buyerBusiness: "",
    buyerLicence: "",
    makeModel: "",
    yearColour: "",
    identifier: "",
    plateAndStatus: "",
    odometer: "",
    saleDate: "",
    saleTime: "",
    amount: "",
    payment: "",
    keysAndItems: "",
    conditionNotes: "",
    officialReferences: "",
  };
}

function recorded(value: string): string {
  return value.trim() || "Not recorded";
}

const controlClassName =
  "min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";
const textareaClassName =
  "w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

function PathwaySelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={controlClassName}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function RecordInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  maxLength = 180,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date" | "time";
  maxLength?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={type === "text" ? maxLength : undefined}
        placeholder={placeholder}
        autoComplete="off"
        className={controlClassName}
      />
    </div>
  );
}

function RecordTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={600}
        rows={3}
        placeholder={placeholder}
        className={textareaClassName}
      />
    </div>
  );
}

function SaleRecordCopy({
  copyLabel,
  record,
  result,
  first,
}: {
  copyLabel: string;
  record: SaleRecord;
  result: QldVehicleSalePathwayResult;
  first: boolean;
}) {
  const fields = [
    ["Seller legal name", recorded(record.sellerName)],
    ["Seller contact", recorded(record.sellerContact)],
    ["Buyer legal name", recorded(record.buyerName)],
    ["Buyer contact", recorded(record.buyerContact)],
    ["Buyer business or trading name", recorded(record.buyerBusiness)],
    ["Buyer licence number supplied", recorded(record.buyerLicence)],
    ["Vehicle make and model", recorded(record.makeModel)],
    ["Year and colour", recorded(record.yearColour)],
    ["VIN, chassis or engine identifier", recorded(record.identifier)],
    ["Plate and registration status", recorded(record.plateAndStatus)],
    ["Odometer reading", recorded(record.odometer)],
    [
      "Sale date and time",
      recorded([record.saleDate, record.saleTime].filter(Boolean).join(" ")),
    ],
    ["Agreed amount", recorded(record.amount)],
    ["Payment method and confirmation", recorded(record.payment)],
    ["Keys, accessories and other items", recorded(record.keysAndItems)],
    ["Condition notes and disclosures", recorded(record.conditionNotes)],
    ["Certificate and official references", recorded(record.officialReferences)],
  ] as const;

  return (
    <section
      className={`qld-sale-record-copy${first ? " qld-sale-record-copy--first" : ""}`}
    >
      <header className="qld-sale-record-print-header">
        <p>Queensland vehicle handover record · {copyLabel}</p>
        <h1>Vehicle sale handover record</h1>
        <p>{result.heading}</p>
      </header>

      <dl>
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="qld-sale-record-signatures" aria-label="Signature lines">
        <div>
          <span>Seller signature</span>
        </div>
        <div>
          <span>Buyer signature</span>
        </div>
        <div>
          <span>Date signed</span>
        </div>
      </div>

      <footer className="qld-sale-record-print-footer">
        This is a factual recordkeeping aid. It does not prove ownership,
        verify identity or licence status, replace an official form or notice,
        provide legal advice, or waive any right. Both parties should retain a
        completed copy and the official confirmations that apply.
      </footer>
    </section>
  );
}

function SaleRecordPrintSnapshot({
  record,
  result,
}: {
  record: SaleRecord;
  result: QldVehicleSalePathwayResult;
}) {
  return (
    <section className="qld-sale-record-print-root hidden">
      <SaleRecordCopy copyLabel="Seller copy" record={record} result={result} first />
      <SaleRecordCopy
        copyLabel="Buyer copy"
        record={record}
        result={result}
        first={false}
      />
    </section>
  );
}

export function QldVehicleSaleRecordBuilder() {
  const [inputs, setInputs] = useState<QldVehicleSalePathwayInputs>(
    DEFAULT_QLD_VEHICLE_SALE_INPUTS,
  );
  const [record, setRecord] = useState<SaleRecord>(emptySaleRecord);
  const [isPrinting, setIsPrinting] = useState(false);
  const printCycleRef = useRef(0);
  const result = buildQldVehicleSalePathway(inputs);

  function updateInput<K extends keyof QldVehicleSalePathwayInputs>(
    key: K,
    value: QldVehicleSalePathwayInputs[K],
  ) {
    setInputs((current) => ({ ...current, [key]: value }));
  }

  function updateRecord(field: SaleRecordTextField, value: string) {
    setRecord((current) => ({ ...current, [field]: value }));
  }

  function clearBuilder() {
    setInputs(DEFAULT_QLD_VEHICLE_SALE_INPUTS);
    setRecord(emptySaleRecord());
  }

  useEffect(() => {
    if (!isPrinting) return;

    const printCycle = ++printCycleRef.current;
    const finishPrinting = () => {
      if (printCycleRef.current !== printCycle) return;
      document.body.classList.remove("qld-sale-record-printing");
      setIsPrinting(false);
    };

    document.body.classList.add("qld-sale-record-printing");
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
      document.body.classList.remove("qld-sale-record-printing");
    };
  }, [isPrinting]);

  return (
    <>
      <section
        id="qld-vehicle-sale-record-builder"
        aria-labelledby="qld-sale-record-heading"
        className="scroll-mt-24 mt-12 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7"
      >
        <div className="border-b border-border/70 pb-6">
          <p className="eyebrow mb-3">Private, local-only tool</p>
          <h2
            id="qld-sale-record-heading"
            className="font-display text-2xl text-primary sm:text-3xl"
          >
            Build a Queensland seller checklist and handover record
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/80 sm:text-base">
            Choose the facts that describe the vehicle and proposed sale. The
            builder separates a registered transfer, cancellation before a
            for-parts sale, an already-unregistered sale, and an uncertain or
            interstate registration.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Entries are kept only in this component&apos;s memory. They are not
            submitted to Caraway, saved to an account, put in browser storage,
            or used to prefill a quote. Refreshing or closing the page clears
            them.
          </p>
        </div>

        <fieldset className="mt-7 rounded-lg border border-border/80 bg-background p-4 sm:p-5">
          <legend className="px-2 font-display text-lg text-foreground">
            1. Choose the likely transaction path
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <PathwaySelect
              id="qld-sale-registration-status"
              label="Registration status now"
              value={inputs.registrationStatus}
              onChange={(value) =>
                updateInput("registrationStatus", value as QldRegistrationStatus)
              }
              options={[
                { value: "interstate-or-unknown", label: "Interstate or not confirmed" },
                { value: "qld-registered", label: "Currently registered in Queensland" },
                { value: "already-unregistered", label: "Already unregistered" },
              ]}
            />
            <PathwaySelect
              id="qld-sale-outcome"
              label="Intended registration outcome"
              value={inputs.outcome}
              onChange={(value) => updateInput("outcome", value as QldSaleOutcome)}
              options={[
                { value: "not-sure", label: "Not decided" },
                { value: "transfer-registration", label: "Transfer current Queensland registration" },
                { value: "cancel-for-parts", label: "Cancel before unregistered or for-parts sale" },
              ]}
            />
            <PathwaySelect
              id="qld-sale-buyer-type"
              label="Buyer type"
              value={inputs.buyerType}
              onChange={(value) => updateInput("buyerType", value as QldBuyerType)}
              options={[
                { value: "not-sure", label: "Not confirmed" },
                { value: "private-or-unverified", label: "Private buyer or business not licence-verified" },
                { value: "verified-licensed-dealer", label: "Licensed motor dealer verified in public register" },
              ]}
            />
            <PathwaySelect
              id="qld-sale-gas-system"
              label="Gas system fitted"
              value={inputs.gasSystem}
              onChange={(value) => updateInput("gasSystem", value as YesNoUnsure)}
              options={[
                { value: "unsure", label: "Unsure" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
            <PathwaySelect
              id="qld-sale-personalised-plates"
              label="Personalised or customised plates attached"
              value={inputs.personalisedPlates}
              onChange={(value) =>
                updateInput("personalisedPlates", value as YesNoUnsure)
              }
              options={[
                { value: "unsure", label: "Unsure" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
            <PathwaySelect
              id="qld-sale-finance"
              label="Finance or another security interest may remain"
              value={inputs.financeOrSecurity}
              onChange={(value) =>
                updateInput("financeOrSecurity", value as YesNoUnsure)
              }
              options={[
                { value: "unsure", label: "Unsure" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
            <PathwaySelect
              id="qld-sale-special-authority"
              label="Insurer, estate, company, joint or written-off complication"
              value={inputs.specialAuthority}
              onChange={(value) =>
                updateInput("specialAuthority", value as YesNoUnsure)
              }
              options={[
                { value: "unsure", label: "Unsure" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
            <PathwaySelect
              id="qld-sale-movement"
              label="How an unregistered vehicle would move"
              value={inputs.movementPlan}
              onChange={(value) =>
                updateInput("movementPlan", value as VehicleMovementPlan)
              }
              options={[
                { value: "unsure", label: "Not decided" },
                { value: "not-moving", label: "No road movement planned" },
                { value: "professional-transport", label: "Professional transport or loading" },
                { value: "road-movement", label: "Drive or tow on a road" },
              ]}
            />
          </div>
        </fieldset>

        <section
          aria-labelledby="qld-sale-pathway-result-heading"
          aria-live="polite"
          className="mt-6 rounded-lg border border-primary/25 bg-secondary/60 p-4 sm:p-5"
        >
          <h3
            id="qld-sale-pathway-result-heading"
            className="font-display text-xl text-foreground"
          >
            {result.heading}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
            {result.summary}
          </p>
          <ol className="mt-5 space-y-4">
            {result.steps.map((step, index) => (
              <li key={step.id} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-none bg-primary text-xs font-semibold text-primary-foreground"
                >
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-semibold text-foreground">{step.heading}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/75">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 border-t border-border/70 pt-4">
            <p className="text-sm font-semibold text-foreground">Important limits</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/75">
              {result.cautions.map((caution) => (
                <li key={caution}>{caution}</li>
              ))}
            </ul>
          </div>
          <details className="mt-5 rounded-md border border-border/70 bg-background px-4 py-3">
            <summary className="cursor-pointer text-sm font-semibold text-foreground">
              Official sources for this result
            </summary>
            <ul className="mt-3 space-y-2 text-sm">
              {result.sourceKeys.map((key) => (
                <li key={key}>
                  <a
                    href={QLD_SALE_SOURCE_URLS[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline underline-offset-4 hover:text-accent-ink"
                  >
                    {QLD_SALE_SOURCE_LABELS[key]}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </section>

        <fieldset className="mt-7 rounded-lg border border-border/80 bg-background p-4 sm:p-5">
          <legend className="px-2 font-display text-lg text-foreground">
            2. Prepare the optional handover record
          </legend>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            Enter only what both parties need for their factual record. Do not
            store an unnecessary photo or scan of another person&apos;s identity
            document. Leave any field blank if it does not apply.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RecordInput id="qld-record-seller" label="Seller legal name" value={record.sellerName} onChange={(value) => updateRecord("sellerName", value)} />
            <RecordInput id="qld-record-seller-contact" label="Seller contact" value={record.sellerContact} onChange={(value) => updateRecord("sellerContact", value)} />
            <RecordInput id="qld-record-buyer" label="Buyer legal name" value={record.buyerName} onChange={(value) => updateRecord("buyerName", value)} />
            <RecordInput id="qld-record-buyer-contact" label="Buyer contact" value={record.buyerContact} onChange={(value) => updateRecord("buyerContact", value)} />
            <RecordInput id="qld-record-business" label="Buyer business or trading name" value={record.buyerBusiness} onChange={(value) => updateRecord("buyerBusiness", value)} />
            <RecordInput id="qld-record-licence" label="Buyer licence number supplied" value={record.buyerLicence} onChange={(value) => updateRecord("buyerLicence", value)} placeholder="Record it only after checking the public register" />
            <RecordInput id="qld-record-make-model" label="Vehicle make and model" value={record.makeModel} onChange={(value) => updateRecord("makeModel", value)} />
            <RecordInput id="qld-record-year-colour" label="Year and colour" value={record.yearColour} onChange={(value) => updateRecord("yearColour", value)} />
            <RecordInput id="qld-record-identifier" label="VIN, chassis or engine identifier" value={record.identifier} onChange={(value) => updateRecord("identifier", value)} placeholder="Use the identifier that applies to the vehicle" />
            <RecordInput id="qld-record-plate-status" label="Plate and registration status" value={record.plateAndStatus} onChange={(value) => updateRecord("plateAndStatus", value)} />
            <RecordInput id="qld-record-odometer" label="Odometer reading" value={record.odometer} onChange={(value) => updateRecord("odometer", value)} />
            <div className="grid grid-cols-2 gap-3">
              <RecordInput id="qld-record-date" label="Sale date" type="date" value={record.saleDate} onChange={(value) => updateRecord("saleDate", value)} />
              <RecordInput id="qld-record-time" label="Sale time" type="time" value={record.saleTime} onChange={(value) => updateRecord("saleTime", value)} />
            </div>
            <RecordInput id="qld-record-amount" label="Agreed amount" value={record.amount} onChange={(value) => updateRecord("amount", value)} placeholder="Record the agreed amount and currency" />
            <RecordInput id="qld-record-payment" label="Payment method and confirmation" value={record.payment} onChange={(value) => updateRecord("payment", value)} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <RecordTextarea id="qld-record-items" label="Keys, accessories and other items handed over" value={record.keysAndItems} onChange={(value) => updateRecord("keysAndItems", value)} />
            <RecordTextarea id="qld-record-condition" label="Condition notes and known disclosures" value={record.conditionNotes} onChange={(value) => updateRecord("conditionNotes", value)} />
            <RecordTextarea id="qld-record-references" label="Safety, gas, transfer, cancellation, plate or other official references" value={record.officialReferences} onChange={(value) => updateRecord("officialReferences", value)} />
          </div>
        </fieldset>

        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          This builder does not establish ownership, determine whether a sale
          is lawful, verify a person or business, replace forms F3520 or F3517,
          provide legal advice, or remove any statutory or contractual right.
          Both parties should check the current official process and retain
          their applicable official confirmations.
        </p>

        <div className="qld-sale-record-no-print mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setIsPrinting(true)}
            disabled={isPrinting}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
          >
            Print two copies or save as PDF
          </button>
          <button
            type="button"
            onClick={clearBuilder}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-medium text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Clear builder
          </button>
        </div>
      </section>

      {isPrinting
        ? createPortal(
            <SaleRecordPrintSnapshot record={record} result={result} />,
            document.body,
          )
        : null}
    </>
  );
}
