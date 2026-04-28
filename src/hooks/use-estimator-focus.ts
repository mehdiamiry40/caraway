"use client";

import { useEffect, useRef } from "react";
import type { Step } from "@/lib/persisted-estimator-state";

// Owns the four heading refs and the "focus the current step heading on
// transition" effect. preventScroll keeps focusing from yanking the page
// while the user scrolls past the section; without it, sessionStorage
// rehydration during mount can drag the viewport.
export function useEstimatorFocus({
  step,
  isSuccess,
}: {
  step: Step;
  isSuccess: boolean;
}) {
  const step1HeadingRef = useRef<HTMLHeadingElement>(null);
  const step2HeadingRef = useRef<HTMLDivElement>(null);
  const step3HeadingRef = useRef<HTMLHeadingElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (isSuccess) {
      successHeadingRef.current?.focus({ preventScroll: true });
      return;
    }
    const refs = [step1HeadingRef, step2HeadingRef, step3HeadingRef];
    refs[step - 1]?.current?.focus({ preventScroll: true });
  }, [isSuccess, step]);

  return {
    step1HeadingRef,
    step2HeadingRef,
    step3HeadingRef,
    successHeadingRef,
  };
}
