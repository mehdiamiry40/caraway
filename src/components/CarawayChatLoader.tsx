"use client";

import dynamic from "next/dynamic";

// The AI SDK is intentionally kept out of every route's initial JavaScript.
// The small async chunk loads after hydration and still leaves the launcher
// available globally without slowing the core quote experience.
const CarawayChat = dynamic(
  () => import("@/components/CarawayChat").then((module) => module.CarawayChat),
  { ssr: false },
);

export function CarawayChatLoader() {
  return <CarawayChat />;
}
