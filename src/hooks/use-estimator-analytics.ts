"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import type { Step } from "@/lib/persisted-estimator-state";

interface AnalyticsArgs {
  step: Step;
  make: string;
  model: string;
  isSuccess: boolean;
}

// Fires `estimator_started` once on first make input, and
// `estimator_abandoned` if the tab/page is hidden mid-flow without a
// successful submission. Returns no value — purely effectful.
export function useEstimatorAnalytics({
  step,
  make,
  model,
  isSuccess,
}: AnalyticsArgs) {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    if (make.trim() !== "") {
      startedRef.current = true;
      trackEvent("estimator_started", { make: make.trim() });
    }
  }, [make]);

  useEffect(() => {
    if (!startedRef.current || isSuccess) return;

    const handleLeave = () => {
      trackEvent("estimator_abandoned", {
        step,
        make: make.trim(),
        model: model.trim(),
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) handleLeave();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleLeave);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleLeave);
    };
  }, [step, make, model, isSuccess]);

  return {
    // Exposed so the parent can reset the "started" flag from handleReset.
    resetStartedFlag() {
      startedRef.current = false;
    },
  };
}
