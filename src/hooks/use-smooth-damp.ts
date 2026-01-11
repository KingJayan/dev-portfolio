import { useRef, useEffect } from 'react';
import { useMotionValue, useAnimationFrame, MotionValue } from 'framer-motion';

/**
 * Custom hook for smooth-damp motion (critically damped spring)
 * @param targetValue The target value to reach (number or MotionValue)
 * @param smoothTime Approximate time to reach the target (default 0.15s)
 * @returns A MotionValue that smoothly follows the target
 */
export function useSmoothDamp(targetValue: number | MotionValue<number>, smoothTime: number = 0.15) {
    const initialValue = typeof targetValue === 'number' ? targetValue : targetValue.get();
    const motionValue = useMotionValue(initialValue);
    const velocityRef = useRef(0);
    const targetRef = useRef(initialValue);

    // Track the target value change if it's a primitive number
    useEffect(() => {
        if (typeof targetValue === 'number') {
            targetRef.current = targetValue;
        }
    }, [targetValue]);

    useAnimationFrame((time, delta) => {
        const deltaTime = delta / 1000; // convert to seconds
        if (deltaTime <= 0) return;

        const omega = 2 / smoothTime;
        const x = omega * deltaTime;
        const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

        const currentTarget = typeof targetValue === 'number' ? targetRef.current : targetValue.get();
        let current = motionValue.get();
        const change = current - currentTarget;

        const temp = (velocityRef.current + omega * change) * deltaTime;
        velocityRef.current = (velocityRef.current - omega * temp) * exp;
        const nextValue = currentTarget + (change + temp) * exp;

        motionValue.set(nextValue);
    });

    return motionValue;
}

/**
 * Hook for 2D smooth-damp motion
 */
export function useSmoothDamp2D(target: { x: number | MotionValue<number>, y: number | MotionValue<number> }, smoothTime: number = 0.15) {
    const x = useSmoothDamp(target.x, smoothTime);
    const y = useSmoothDamp(target.y, smoothTime);
    return { x, y };
}
