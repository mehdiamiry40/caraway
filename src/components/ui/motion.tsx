import type { HTMLAttributes } from "react";

type RevealProps = HTMLAttributes<HTMLDivElement> & { delay?: number };

export function Reveal({ delay: _delay, ...props }: RevealProps) {
  void _delay;
  return <div {...props} />;
}

export function RevealGroup(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

export function RevealItem(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

export const EASE_OUT_QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1];
