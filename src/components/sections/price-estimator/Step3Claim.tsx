import Link from "next/link";
import { Input } from "@/components/ui/input";
import { AddressAutocomplete } from "@/components/ui/address-autocomplete";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CheckCircle2, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { RequiredMark } from "./RequiredMark";
import type { EstimatorState } from "./types";

export function Step3Claim({ state }: { state: EstimatorState }) {
  const {
    step,
    isCalculating,
    result,
    year,
    make,
    model,
    name,
    setName,
    nameTouched,
    setNameTouched,
    nameError,
    setNameError,
    phone,
    setPhone,
    phoneTouched,
    setPhoneTouched,
    phoneError,
    setPhoneError,
    address,
    setAddress,
    addressTouched,
    setAddressTouched,
    addressError,
    setAddressError,
    marketingConsent,
    setMarketingConsent,
    isSubmitting,
    submitError,
    handleSubmit,
    goToStep,
    validateName,
    validatePhone,
    validateAddress,
    step3HeadingRef,
  } = state;

  return (
    <div
      className={cn(
        "transition-all duration-300",
        step === 3 && !isCalculating ? "block" : "hidden"
      )}
    >
      <div className="p-5 sm:p-8">
        {result && (
          <div className="flex items-center justify-between gap-3 bg-muted border border-border rounded-xl px-4 py-3 mb-7">
            <div className="min-w-0">
              <p className="text-xs text-foreground/70 uppercase tracking-wider">Your estimate</p>
              <p className="font-medium text-foreground truncate">
                {year} {[make, model].filter(Boolean).join(" ")} ·{" "}
                <span className="font-mono tabular-nums text-primary">
                  ${result.quote.toLocaleString()}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="text-xs text-primary hover:text-primary/80 min-h-[44px] px-3 rounded-md touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Edit
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 mb-7">
          <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary">
            <Send className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <h3
            ref={step3HeadingRef}
            tabIndex={-1}
            className="font-display text-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            Where can we contact you?
          </h3>
        </div>

        <div className="space-y-5 sm:space-y-6">
          <div>
            <label htmlFor="est-name" className="block text-sm text-foreground mb-2.5">
              Your name
              <RequiredMark />
            </label>
            <Input
              id="est-name"
              placeholder="Full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameTouched) setNameError(validateName(e.target.value));
              }}
              onBlur={() => {
                setNameTouched(true);
                setNameError(validateName(name));
              }}
              autoComplete="name"
              inputMode="text"
              enterKeyHint="next"
              maxLength={200}
              aria-required="true"
              aria-invalid={nameTouched && nameError ? true : undefined}
              aria-describedby={nameTouched && nameError ? "est-name-error" : undefined}
            />
            {nameTouched && nameError && (
              <p
                id="est-name-error"
                className="flex items-start gap-1.5 mt-2 text-sm text-destructive font-medium"
                role="alert"
              >
                <span
                  className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0"
                  aria-hidden
                />
                {nameError}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="est-phone" className="block text-sm text-foreground mb-2.5">
              Phone number
              <RequiredMark />
            </label>
            <Input
              id="est-phone"
              type="tel"
              inputMode="tel"
              placeholder="04XX XXX XXX"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (phoneTouched) setPhoneError(validatePhone(e.target.value));
              }}
              onBlur={() => {
                setPhoneTouched(true);
                setPhoneError(validatePhone(phone));
              }}
              autoComplete="tel"
              enterKeyHint="send"
              maxLength={20}
              aria-required="true"
              aria-describedby={phoneTouched && phoneError ? "est-phone-error" : undefined}
              aria-invalid={phoneTouched && phoneError ? true : undefined}
            />
            {phoneTouched && phoneError && (
              <p
                id="est-phone-error"
                className="flex items-start gap-1.5 mt-2 text-sm text-destructive font-medium"
                role="alert"
              >
                <span
                  className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0"
                  aria-hidden
                />
                {phoneError}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="est-address" className="block text-sm text-foreground mb-2.5">
              Pickup address
              <RequiredMark />
            </label>
            <AddressAutocomplete
              id="est-address"
              placeholder="Start typing your address..."
              value={address}
              onChange={(next) => {
                setAddress(next);
                if (addressTouched) setAddressError(validateAddress(next));
              }}
              onPlaceSelected={(picked) => {
                setAddressTouched(true);
                setAddressError(validateAddress(picked));
              }}
              onBlur={() => {
                setAddressTouched(true);
                setAddressError(validateAddress(address));
              }}
              autoComplete="street-address"
              enterKeyHint="send"
              maxLength={500}
              aria-required="true"
              aria-invalid={addressTouched && addressError ? true : undefined}
              aria-describedby={addressTouched && addressError ? "est-address-error" : undefined}
            />
            {addressTouched && addressError && (
              <p
                id="est-address-error"
                className="flex items-start gap-1.5 mt-2 text-sm text-destructive font-medium"
                role="alert"
              >
                <span
                  className="inline-block w-1.5 h-1.5 mt-1.5 rounded-full bg-destructive shrink-0"
                  aria-hidden
                />
                {addressError}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3">
          <Checkbox
            id="est-marketing-consent"
            className="mt-0.5"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
          />
          <label htmlFor="est-marketing-consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
            Email me occasional offers and tips (optional). See our{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
              privacy policy
            </Link>
            .
          </label>
        </div>

        {submitError && (
          <div
            className="mt-4 flex items-start gap-2 bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3"
            role="alert"
          >
            <p className="text-sm text-destructive font-medium">{submitError}</p>
          </div>
        )}

        <div className="mt-7 sm:mt-9 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <Button
            type="button"
            onClick={() => goToStep(2)}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant="default"
            size="lg"
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                Request confirmed offer
                <CheckCircle2 className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
