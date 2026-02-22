import { useEffect, useRef, useCallback, useState } from "react";
import { useDrawing } from "@/contexts/DrawingContext";
import { useTheme } from "@/hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";
import { Eraser, Pencil, X, Palette, Highlighter, Minus, Square, Circle, Undo2, Redo2 } from "lucide-react";

const COLORS = [
    { id: 'default', color: 'bg-ink', label: 'Ink' },
    { id: '#b56565', color: 'bg-red-400', label: 'Markup Red' },
    { id: 'rgba(232, 206, 126, 0.42)', color: 'bg-highlighter-yellow', label: 'Highlighter Yellow', isHighlighter: true },
    { id: 'rgba(202, 158, 176, 0.36)', color: 'bg-highlighter-pink', label: 'Highlighter Pink', isHighlighter: true },
    { id: 'rgba(143, 169, 188, 0.32)', color: 'bg-highlighter-blue', label: 'Highlighter Blue', isHighlighter: true },
];

const BRUSH_SIZES = [
    { size: 3, label: 'Pen', icon: Pencil },
    { size: 8, label: 'Marker', icon: Highlighter },
    { size: 25, label: 'Chonky', icon: Palette },
];

export default function FreeDrawCanvas() {
    const { isDrawingMode, tool, setTool, toggleDrawingMode, color, setColor, brushSize, setBrushSize } = useDrawing();
    const { theme } = useTheme();

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const cursorRef = useRef<HTMLDivElement | null>(null);
    const rectRef = useRef<DOMRect | null>(null);


    const isDrawingRef = useRef(false);
    const startPosRef = useRef<{ x: number, y: number } | null>(null);
    const snapshotRef = useRef<ImageData | null>(null);


    const historyRef = useRef<ImageData[]>([]);
    const historyStepRef = useRef<number>(-1);


    useEffect(() => {
        if (!isDrawingMode) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (canvas.width !== window.innerWidth) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            if (historyStepRef.current === -1) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
                    historyStepRef.current = 0;
                }
            }
        }

        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctxRef.current = ctx;
            configureContext(ctx);
        }

        if (canvas) {
            rectRef.current = canvas.getBoundingClientRect();
        }

        const handleResize = () => {
            if (!canvas || !ctxRef.current) return;

            const imageData = ctxRef.current.getImageData(0, 0, canvas.width, canvas.height);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            configureContext(ctxRef.current);
            rectRef.current = canvas.getBoundingClientRect();
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isDrawingMode]);


    const saveToHistory = () => {
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
    };

    const handleUndo = useCallback(() => {
        if (historyStepRef.current > 0) {
            historyStepRef.current -= 1;
            const previousState = historyRef.current[historyStepRef.current];
            if (previousState && ctxRef.current) {
                ctxRef.current.putImageData(previousState, 0, 0);
            }
        }
    }, []);

    const handleRedo = useCallback(() => {
        if (historyStepRef.current < historyRef.current.length - 1) {
            historyStepRef.current += 1;
            const nextState = historyRef.current[historyStepRef.current];
            if (nextState && ctxRef.current) {
                ctxRef.current.putImageData(nextState, 0, 0);
            }
        }
    }, []);

    useEffect(() => {
        if (!isDrawingMode) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    if (e.shiftKey) {
                        handleRedo();
                    } else {
                        handleUndo();
                    }
                    e.preventDefault();
                } else if (e.key === 'y') {
                    handleRedo();
                    e.preventDefault();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isDrawingMode, handleUndo, handleRedo]);



    const configureContext = useCallback((ctx: CanvasRenderingContext2D) => {
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
    }, [tool, theme, color, brushSize]);


    useEffect(() => {
        if (ctxRef.current) {
            configureContext(ctxRef.current);
        }
    }, [configureContext]);


    useEffect(() => {
        if (!isDrawingMode) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const getPos = (e: MouseEvent | TouchEvent) => {
            const rect = rectRef.current || canvas.getBoundingClientRect();
            if ("touches" in e && e.touches.length > 0) {
                return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
            }
            const mouseEvent = e as MouseEvent;
            return { x: mouseEvent.clientX - rect.left, y: mouseEvent.clientY - rect.top };
        };

        const updateCursor = (e: MouseEvent | TouchEvent) => {
            if (!cursorRef.current) return;
            const pos = getPos(e);



            let clientX, clientY;
            if ("touches" in e && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                const me = e as MouseEvent;
                clientX = me.clientX;
                clientY = me.clientY;
            }

            cursorRef.current.style.transform = `translate(${clientX}px, ${clientY}px)`;
        };

        const startDraw = (e: MouseEvent | TouchEvent) => {
            if (!ctxRef.current) return;
            if ("button" in e && e.button !== 0) return;

            isDrawingRef.current = true;
            const pos = getPos(e);

            if (['line', 'rectangle', 'circle'].includes(tool)) {
                startPosRef.current = pos;
                snapshotRef.current = ctxRef.current.getImageData(0, 0, canvas.width, canvas.height);
            } else {
                ctxRef.current.beginPath();
                ctxRef.current.moveTo(pos.x, pos.y);
            }
        };

        const draw = (e: MouseEvent | TouchEvent) => {
            updateCursor(e);

            if (!isDrawingRef.current || !ctxRef.current) return;
            e.preventDefault();

            const pos = getPos(e);

            if (['line', 'rectangle', 'circle'].includes(tool)) {
                if (snapshotRef.current) {
                    ctxRef.current.putImageData(snapshotRef.current, 0, 0);
                }
                const start = startPosRef.current;
                if (!start) return;

                ctxRef.current.beginPath();
                if (tool === 'line') {
                    ctxRef.current.moveTo(start.x, start.y);
                    ctxRef.current.lineTo(pos.x, pos.y);
                } else if (tool === 'rectangle') {
                    const width = pos.x - start.x;
                    const height = pos.y - start.y;
                    const isHighlighter = COLORS.find(c => c.id === color)?.isHighlighter;
                    if (isHighlighter) {
                        ctxRef.current.fillRect(start.x, start.y, width, height);
                    } else {
                        ctxRef.current.strokeRect(start.x, start.y, width, height);
                    }
                    return;
                } else if (tool === 'circle') {
                    const radius = Math.sqrt(Math.pow(pos.x - start.x, 2) + Math.pow(pos.y - start.y, 2));
                    ctxRef.current.arc(start.x, start.y, radius, 0, 2 * Math.PI);
                }
                ctxRef.current.stroke();

            } else {

                ctxRef.current.lineTo(pos.x, pos.y);
                ctxRef.current.stroke();


                ctxRef.current.beginPath();
                ctxRef.current.moveTo(pos.x, pos.y);
            }
        };

        const endDraw = () => {
            if (!isDrawingRef.current) return;
            isDrawingRef.current = false;
            startPosRef.current = null;
            snapshotRef.current = null;
            ctxRef.current?.beginPath();

            saveToHistory();
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
    }, [isDrawingMode, tool, color, brushSize]);


    const getCssColor = () => {
        if (tool === 'eraser') return 'transparent';
        if (color === 'default') return theme === 'dark' ? '#ffffff' : '#2a2a2a';

        const map = COLORS.find(c => c.id === color);
        if (map?.id.startsWith('#')) return map.id;
        if (map?.id === 'rgba(232, 206, 126, 0.42)') return 'rgb(232, 206, 126)';
        if (map?.id === 'rgba(202, 158, 176, 0.36)') return 'rgb(202, 158, 176)';
        if (map?.id === 'rgba(143, 169, 188, 0.32)') return 'rgb(143, 169, 188)';
        return 'black';
    };

    if (!isDrawingMode) return null;

    return (
        <>

            <div
                ref={cursorRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
                style={{
                    width: tool === 'eraser' ? 40 : brushSize,
                    height: tool === 'eraser' ? 40 : brushSize,
                    borderRadius: '50%',
                    border: '1px solid',
                    borderColor: tool === 'eraser' ? '#000' : 'transparent',
                    backgroundColor: tool === 'eraser' ? 'transparent' : getCssColor(),
                    boxShadow: tool === 'eraser' ? '0 0 0 1px white' : 'none',
                    transition: 'width 0.1s, height 0.1s, background-color 0.1s'
                }}
            />

            <div className="fixed inset-0 z-[9990] pointer-events-none" style={{ cursor: "none" }}>
                <canvas
                    ref={canvasRef}
                    className="w-full h-full touch-none pointer-events-auto"
                    style={{ cursor: "none" }}
                />
            </div>

            <AnimatePresence>
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-paper/90 backdrop-blur-sm border-2 border-ink p-3 rounded-2xl shadow-xl z-[9991] flex items-center gap-4 max-w-[95vw] overflow-x-auto pointer-events-auto"
                >

                    <div className="flex items-center gap-2 pr-4 border-r border-ink/20">
                        <button onClick={handleUndo} className="p-2 rounded-full hover:bg-ink/5 active:scale-95 transition" title="Undo (Ctrl+Z)">
                            <Undo2 className="w-5 h-5" />
                        </button>
                        <button onClick={handleRedo} className="p-2 rounded-full hover:bg-ink/5 active:scale-95 transition" title="Redo (Ctrl+Y)">
                            <Redo2 className="w-5 h-5" />
                        </button>
                    </div>


                    <div className="flex items-center gap-2 pr-4 border-r border-ink/20">
                        <button onClick={() => setTool("pencil")} className={`p-2 rounded-full hover:scale-110 transition ${tool === "pencil" ? "bg-ink text-paper" : "hover:bg-ink/5"}`} title="Pencil">
                            <Pencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => setTool("line")} className={`p-2 rounded-full hover:scale-110 transition ${tool === "line" ? "bg-ink text-paper" : "hover:bg-ink/5"}`} title="Line">
                            <Minus className="w-5 h-5 rotate-45" />
                        </button>
                        <button onClick={() => setTool("rectangle")} className={`p-2 rounded-full hover:scale-110 transition ${tool === "rectangle" ? "bg-ink text-paper" : "hover:bg-ink/5"}`} title="Rectangle">
                            <Square className="w-5 h-5" />
                        </button>
                        <button onClick={() => setTool("circle")} className={`p-2 rounded-full hover:scale-110 transition ${tool === "circle" ? "bg-ink text-paper" : "hover:bg-ink/5"}`} title="Circle">
                            <Circle className="w-5 h-5" />
                        </button>
                        <button onClick={() => setTool("eraser")} className={`p-2 rounded-full hover:scale-110 transition ${tool === "eraser" ? "bg-highlighter-blue text-ink" : "hover:bg-ink/5"}`} title="Eraser">
                            <Eraser className="w-5 h-5" />
                        </button>
                    </div>


                    {tool !== "eraser" && (
                        <div className="flex items-center gap-2 pr-4 border-r border-ink/20">
                            {BRUSH_SIZES.map((b) => (
                                <button
                                    key={b.label}
                                    onClick={() => setBrushSize(b.size)}
                                    className={`relative p-2 rounded-full transition-all ${brushSize === b.size ? "bg-ink/10 scale-110 ring-2 ring-ink/20" : "hover:bg-ink/5"}`}
                                    title={b.label}
                                >
                                    <div
                                        className={`rounded-full bg-ink ${brushSize === b.size ? 'opacity-100' : 'opacity-60'}`}
                                        style={{ width: Math.min(b.size + 4, 18), height: Math.min(b.size + 4, 18) }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}


                    {tool !== "eraser" && (
                        <div className="flex items-center gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setColor(c.id)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${c.color} ${color === c.id ? "scale-110 border-ink shadow-sm ring-2 ring-offset-1 ring-ink/20" : "border-transparent opacity-80 hover:opacity-100"
                                        }`}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    )}


                    <div className="pl-4 border-l border-ink/20">
                        <button onClick={toggleDrawingMode} className="p-2 rounded-full bg-highlighter-pink/30 text-ink hover:bg-highlighter-pink/50 transition" title="Close">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </>
    );
}
