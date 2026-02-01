import { useRef, useEffect } from 'react';
import { useMotionValue, useAnimationFrame, MotionValue } from 'framer-motion';

// custom hook for smooth-damp motion (critically damped spring)
export function useSmoothDamp(targetValue: number | MotionValue<number>, smoothTime: number = 0.15) {
    const initialValue = typeof targetValue === 'number' ? targetValue : targetValue.get();
    const motionValue = useMotionValue(initialValue);
    const velocityRef = useRef(0);
    const targetRef = useRef(initialValue);

    //track if primitive num
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

// hook for 2d smooth-damp motion
export function useSmoothDamp2D(target: { x: number | MotionValue<number>, y: number | MotionValue<number> }, smoothTime: number = 0.15) {
    const x = useSmoothDamp(target.x, smoothTime);
    const y = useSmoothDamp(target.y, smoothTime);
    return { x, y };
}
