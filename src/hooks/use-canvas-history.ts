import { useRef, useCallback } from "react";

export function useCanvasHistory(
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
    ctxRef: React.MutableRefObject<CanvasRenderingContext2D | null>
) {
    const historyRef = useRef<ImageData[]>([]);
    const historyStepRef = useRef<number>(-1);

    const initHistory = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (historyStepRef.current === -1) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
                historyStepRef.current = 0;
            }
        }
    }, [canvasRef]);

    const saveToHistory = useCallback(() => {
        if (!canvasRef.current || !ctxRef.current) return;

        const step = historyStepRef.current;
        const history = historyRef.current;
        if (step < history.length - 1) {
            historyRef.current = history.slice(0, step + 1);
        }

        const newState = ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        historyRef.current.push(newState);
        historyStepRef.current += 1;

        if (historyRef.current.length > 5) {
            historyRef.current.shift();
            historyStepRef.current -= 1;
        }
    }, [canvasRef, ctxRef]);

    const handleUndo = useCallback(() => {
        if (historyStepRef.current > 0) {
            historyStepRef.current -= 1;
            const previousState = historyRef.current[historyStepRef.current];
            if (previousState && ctxRef.current) {
                ctxRef.current.putImageData(previousState, 0, 0);
            }
        }
    }, [ctxRef]);

    const handleRedo = useCallback(() => {
        if (historyStepRef.current < historyRef.current.length - 1) {
            historyStepRef.current += 1;
            const nextState = historyRef.current[historyStepRef.current];
            if (nextState && ctxRef.current) {
                ctxRef.current.putImageData(nextState, 0, 0);
            }
        }
    }, [ctxRef]);

    return { historyRef, historyStepRef, initHistory, saveToHistory, handleUndo, handleRedo };
}
