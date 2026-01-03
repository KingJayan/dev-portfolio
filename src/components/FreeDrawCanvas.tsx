import { useEffect, useRef, useCallback } from "react";
import { useDrawing } from "@/contexts/DrawingContext";
import { useTheme } from "@/hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";
import { Eraser, Trash2, Pencil } from "lucide-react";

export default function FreeDrawCanvas() {
    const { isDrawingMode, tool, setTool } = useDrawing();
    const { theme } = useTheme();

    // We use a callback ref to ensure we capture the canvas element immediately when it mounts
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const isDrawingRef = useRef(false);

    // Helper to configure context settings
    const configureContext = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (tool === "eraser") {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = 20;
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.lineWidth = 3;
            // Explicitly set color based on theme
            ctx.strokeStyle = theme === "dark"
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(42, 42, 42, 0.8)";
        }
    }, [tool, theme]);

    // Initialize canvas when mounting (when isDrawingMode becomes true)
    useEffect(() => {
        if (!isDrawingMode) return;

        // Wait a tick to ensure ref is populated
        const initCanvas = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctxRef.current = ctx;
                // Configure immediately!
                configureContext(ctx);
            }
        };

        initCanvas();

        const handleResize = () => {
            const canvas = canvasRef.current;
            const ctx = ctxRef.current;
            if (!canvas || !ctx) return;

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.putImageData(imageData, 0, 0);
            // Re-configure after resize reset
            configureContext(ctx);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isDrawingMode, configureContext]);

    // Update context when tool/theme changes checks logic
    useEffect(() => {
        if (ctxRef.current) {
            configureContext(ctxRef.current);
        }
    }, [configureContext]);

    // Event Listeners for Drawing
    useEffect(() => {
        if (!isDrawingMode) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const getPos = (e: MouseEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            if ("touches" in e && e.touches.length > 0) {
                return {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top
                };
            }
            const mouseEvent = e as MouseEvent;
            return {
                x: mouseEvent.clientX - rect.left,
                y: mouseEvent.clientY - rect.top
            };
        };

        const startDraw = (e: MouseEvent | TouchEvent) => {
            if (!ctxRef.current) return;

            isDrawingRef.current = true;
            const pos = getPos(e);

            // Re-apply configuration just to be absolutely safe
            configureContext(ctxRef.current);

            ctxRef.current.beginPath();
            ctxRef.current.moveTo(pos.x, pos.y);
        };

        const draw = (e: MouseEvent | TouchEvent) => {
            if (!isDrawingRef.current || !ctxRef.current) return;
            e.preventDefault(); // Prevent scrolling on touch

            const pos = getPos(e);
            ctxRef.current.lineTo(pos.x, pos.y);
            ctxRef.current.stroke();

            // Continuous path for smoother curves
            ctxRef.current.beginPath();
            ctxRef.current.moveTo(pos.x, pos.y);
        };

        const endDraw = () => {
            isDrawingRef.current = false;
            ctxRef.current?.beginPath(); // Reset path
        };

        canvas.addEventListener("mousedown", startDraw);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", endDraw);
        canvas.addEventListener("mouseleave", endDraw);
        canvas.addEventListener("touchstart", startDraw, { passive: false });
        canvas.addEventListener("touchmove", draw, { passive: false });
        canvas.addEventListener("touchend", endDraw);

        return () => {
            canvas.removeEventListener("mousedown", startDraw);
            canvas.removeEventListener("mousemove", draw);
            canvas.removeEventListener("mouseup", endDraw);
            canvas.removeEventListener("mouseleave", endDraw);
            canvas.removeEventListener("touchstart", startDraw);
            canvas.removeEventListener("touchmove", draw);
            canvas.removeEventListener("touchend", endDraw);
        };
    }, [isDrawingMode, configureContext]);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    if (!isDrawingMode) {
        return null;
    }

    return (
        <>
            <div className="fixed inset-0 z-[9990]" style={{ cursor: "crosshair" }}>
                <canvas
                    ref={canvasRef}
                    className="w-full h-full touch-none"
                    style={{ cursor: "crosshair" }}
                />
            </div>

            <AnimatePresence>
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-paper border-2 border-ink p-2 rounded-full shadow-lg z-[9991] flex items-center gap-2"
                >
                    <button
                        onClick={() => setTool("pencil")}
                        className={`p-2 rounded-full transition-colors ${tool === "pencil" ? "bg-highlighter-yellow" : "hover:bg-muted"
                            }`}
                        title="Pencil"
                    >
                        <Pencil className="w-5 h-5 text-ink" />
                    </button>

                    <button
                        onClick={() => setTool("eraser")}
                        className={`p-2 rounded-full transition-colors ${tool === "eraser" ? "bg-highlighter-blue" : "hover:bg-muted"
                            }`}
                        title="Eraser"
                    >
                        <Eraser className="w-5 h-5 text-ink" />
                    </button>

                    <div className="w-px h-6 bg-ink/20 mx-1" />

                    <button
                        onClick={clearCanvas}
                        className="p-2 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                        title="Clear All"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </motion.div>
            </AnimatePresence>
        </>
    );
}
