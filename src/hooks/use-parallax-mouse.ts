import { useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { MOTION_SPRING } from "@/lib/motion";

type SpringConfig = {
  stiffness: number;
  damping: number;
  mass: number;
};

const defaultSpringConfig: SpringConfig = MOTION_SPRING.parallax;

export function useParallaxMouse(springConfig: SpringConfig = defaultSpringConfig) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, springConfig);
  const mouseY = useSpring(rawY, springConfig);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      rawX.set((event.clientX / innerWidth) * 2 - 1);
      rawY.set((event.clientY / innerHeight) * 2 - 1);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawX, rawY]);

  return { mouseX, mouseY };
}
