"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

export function HeroImage() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawTilt = useTransform(scrollYProgress, [0, 0.4, 1], [-2.4, 0, 1.6]);
  const rawLift = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const tilt = useSpring(rawTilt, { stiffness: 80, damping: 24, mass: 0.6 });
  const lift = useSpring(rawLift, { stiffness: 80, damping: 24, mass: 0.6 });

  const transform = reduce
    ? {}
    : { rotate: tilt, y: lift };

  return (
    <div ref={ref} className="relative w-full">
      <div
        aria-hidden="true"
        className="absolute inset-x-6 inset-y-10 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,hsl(var(--grad-violet)/0.38),transparent_70%)] blur-3xl"
      />

      <motion.div
        style={transform}
        className="relative mx-auto w-full max-w-[580px] aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-[hsl(var(--shadow-color)/0.08)] bg-card shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04),0_12px_28px_hsl(var(--shadow-color)/0.08),0_48px_96px_-16px_hsl(var(--shadow-color)/0.18)] will-change-transform"
      >
        <Image
          src="/images/tow-truck-hero.webp"
          alt="Caraway flatbed tow truck collecting a customer's car for cash in Brisbane — same-day pickup with free towing across Greater Brisbane"
          title="Caraway cash for cars Brisbane — free pickup"
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 90vw, 560px"
          className="object-cover"
          priority
          fetchPriority="high"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-tr from-[hsl(var(--ink)/0.22)] via-transparent to-[hsl(var(--grad-violet)/0.14)]"
        />
      </motion.div>
    </div>
  );
}
