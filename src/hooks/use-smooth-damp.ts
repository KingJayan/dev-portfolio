import { useRef, useEffect } from 'react';
import { useMotionValue, useAnimationFrame } from 'framer-motion';

/**
 * Custom hook for smooth-damp motion (critically damped spring)
 * @param targetValue The target value to reach
 * @param smoothTime Approximate time to reach the target (default 0.15s)
 * @returns A MotionValue that smoothly follows the target
 */
export function useSmoothDamp(targetValue: number, smoothTime: number = 0.15) {
    const motionValue = useMotionValue(targetValue);
    const velocityRef = useRef(0);
    const targetRef = useRef(targetValue);

    // Track the target value change
    useEffect(() => {
        targetRef.current = targetValue;
    }, [targetValue]);

    useAnimationFrame((time, delta) => {
        // Standard critically damped spring algorithm
        // Formula from: "Game Programming Gems 4, Chapter 1.10"

        const deltaTime = delta / 1000; // convert to seconds
        if (deltaTime <= 0) return;

        const omega = 2 / smoothTime;
        const x = omega * deltaTime;
        const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

        let current = motionValue.get();
        const change = current - targetRef.current;

        const temp = (velocityRef.current + omega * change) * deltaTime;
        velocityRef.current = (velocityRef.current - omega * temp) * exp;
        const nextValue = targetRef.current + (change + temp) * exp;

        motionValue.set(nextValue);
    });

    return motionValue;
}

/**
 * Hook for 2D smooth-damp motion
 */
export function useSmoothDamp2D(target: { x: number, y: number }, smoothTime: number = 0.15) {
    const x = useSmoothDamp(target.x, smoothTime);
    const y = useSmoothDamp(target.y, smoothTime);
    return { x, y };
}
