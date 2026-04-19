"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";

/**
 * Shared Framer Motion primitives for Stripe-style scroll reveals.
 *
 * <Reveal>        — fade + slide-up on first-in-view, 700ms ease-out-quint.
 * <RevealGroup>   — parent that staggers children with an 80ms delay.
 * <RevealItem>    — child animated by the parent's stagger schedule.
 *
 * All primitives no-op (render instantly) when prefers-reduced-motion is set.
 */

const EASE_OUT_QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const DURATION = 0.7;
const VIEWPORT = { once: true, amount: 0.25, margin: "-80px" } as const;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  shown: { opacity: 1, y: 0 },
};

const groupVariants: Variants = {
  hidden: {},
  shown: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, ease: EASE_OUT_QUINT },
  },
};

type RevealProps = Omit<
  HTMLMotionProps<"div">,
  "variants" | "initial" | "animate" | "whileInView" | "viewport" | "transition"
> & { delay?: number };

export function Reveal({ delay = 0, ...props }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <motion.div {...props} />;
  }

  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      transition={{ duration: DURATION, ease: EASE_OUT_QUINT, delay }}
      {...props}
    />
  );
}

type RevealGroupProps = Omit<
  HTMLMotionProps<"div">,
  "variants" | "initial" | "animate" | "whileInView" | "viewport"
>;

export function RevealGroup(props: RevealGroupProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <motion.div {...props} />;
  }

  return (
    <motion.div
      variants={groupVariants}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      {...props}
    />
  );
}

type RevealItemProps = Omit<
  HTMLMotionProps<"div">,
  "variants" | "initial" | "animate"
>;

export function RevealItem(props: RevealItemProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <motion.div {...props} />;
  }

  return <motion.div variants={itemVariants} {...props} />;
}

export { EASE_OUT_QUINT };
