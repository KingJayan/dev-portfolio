import { useCallback } from "react";

export function useCanvasContext(
    COLORS: { id: string; color: string; label: string; isHighlighter?: boolean }[]
) {
    const configureContext = useCallback((
        ctx: CanvasRenderingContext2D,
        tool: string,
        color: string,
        theme: string,
        brushSize: number
    ) => {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (tool === "eraser") {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = 40;
        } else {
            const isHighlighter = COLORS.find(c => c.id === color)?.isHighlighter;

            let drawColor = color;
            if (color === 'default') {
                drawColor = theme === "dark" ? "rgba(255, 255, 255, 0.9)" : "rgba(42, 42, 42, 0.9)";
            }

            if (isHighlighter) {
                ctx.globalCompositeOperation = "multiply";
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
            } else {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = drawColor;
                ctx.fillStyle = drawColor;
            }
            ctx.lineWidth = brushSize;
        }
    }, [COLORS]);

    return { configureContext };
}
