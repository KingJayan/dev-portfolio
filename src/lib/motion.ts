import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

export function useMotionTiming() {
    const reduced = usePrefersReducedMotion();
    if (reduced) return { fast: 0, normal: 0, slow: 0, sectionEnter: 0, loadingExit: 0, micro: 0 } as const;
    return MOTION_TIMING;
}

export const MOTION_SPRING = {
  parallax: { stiffness: 50, damping: 30, mass: 1 },
  subtle: { stiffness: 120, damping: 20, mass: 0.8 },
  snappy: { stiffness: 220, damping: 24, mass: 0.8 },
} as const;

export const MOTION_TIMING = {
  fast: 0.2,
  normal: 0.35,
  slow: 0.6,
  sectionEnter: 0.8,
  loadingExit: 0.45,
  micro: 0.16,
} as const;

export const MOTION_EASE = {
  standard: "easeOut",
  smooth: "easeInOut",
  linear: "linear",
} as const;
