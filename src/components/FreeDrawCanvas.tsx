import { useEffect, useRef } from "react";
import { useDrawing } from "@/contexts/DrawingContext";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Eraser, Pencil, X, Palette, Highlighter, Minus, Square, Circle, Undo2, Redo2 } from "lucide-react";
import { useCanvasHistory } from "@/hooks/use-canvas-history";
import { useCanvasContext } from "@/hooks/use-canvas-context";
import { Z_INDEX } from "@/lib/z-index";
import { cn } from "@/lib/utils";

// constants

const COLORS = [
    { id: 'default',                       color: 'bg-ink',                label: 'Ink' },
    { id: '#b56565',                       color: 'bg-red-400',            label: 'Markup Red' },
    { id: 'rgba(232, 206, 126, 0.42)',     color: 'bg-highlighter-yellow', label: 'Highlighter Yellow', isHighlighter: true },
    { id: 'rgba(202, 158, 176, 0.36)',     color: 'bg-highlighter-pink',   label: 'Highlighter Pink',   isHighlighter: true },
    { id: 'rgba(143, 169, 188, 0.32)',     color: 'bg-highlighter-blue',   label: 'Highlighter Blue',   isHighlighter: true },
];

const BRUSH_SIZES = [
    { size: 2,  label: 'Pen',    icon: Pencil },
    { size: 5,  label: 'Marker', icon: Highlighter },
    { size: 15, label: 'Chonky', icon: Palette },
];

const DRAW_TOOLS = [
    { id: 'pencil',    icon: Pencil,  label: 'Pencil' },
    { id: 'line',      icon: Minus,   label: 'Line',      iconCls: 'rotate-45' },
    { id: 'rectangle', icon: Square,  label: 'Rectangle' },
    { id: 'circle',    icon: Circle,  label: 'Circle' },
    { id: 'eraser',    icon: Eraser,  label: 'Eraser' },
] as const;

// sub-components

function Divider() {
    return <div className="w-px self-stretch bg-ink/20" />;
}

function ToolBtn({ icon: Icon, label, iconCls, active, onClick }: {
    icon: React.ElementType; label: string; iconCls?: string;
    active: boolean; onClick: () => void;
}) {
    return (
        <Button variant={active ? 'iconSoftActive' : 'iconSoft'} size="icon"
            onClick={onClick} className="h-9 w-9 hover:scale-110" title={label}>
            <Icon className={cn('w-5 h-5', iconCls)} />
        </Button>
    );
}

export default function FreeDrawCanvas() {
    const { isDrawingMode, tool, setTool, toggleDrawingMode, color, setColor, brushSize, setBrushSize } = useDrawing();
    const { theme } = useTheme();

    const canvasRef  = useRef<HTMLCanvasElement | null>(null);
    const ctxRef     = useRef<CanvasRenderingContext2D | null>(null);
    const cursorRef  = useRef<HTMLDivElement | null>(null);
    const rectRef    = useRef<DOMRect | null>(null);
    const isDrawingRef  = useRef(false);
    const startPosRef   = useRef<{ x: number; y: number } | null>(null);
    const snapshotRef   = useRef<ImageData | null>(null);

    const { initHistory, saveToHistory, handleUndo, handleRedo } = useCanvasHistory(canvasRef, ctxRef);
    const { configureContext } = useCanvasContext(COLORS);

    // canvas resize + init
    useEffect(() => {
        if (!isDrawingMode) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (canvas.width !== window.innerWidth) {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
            initHistory();
        }

        const ctx = canvas.getContext("2d");
        if (ctx) { ctxRef.current = ctx; configureContext(ctx, tool, color, theme, brushSize); }
        rectRef.current = canvas.getBoundingClientRect();

        const handleResize = () => {
            if (!canvas || !ctxRef.current) return;
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
            configureContext(ctxRef.current, tool, color, theme, brushSize);
            rectRef.current = canvas.getBoundingClientRect();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isDrawingMode]);

    // keeb shortcuts
    useEffect(() => {
        if (!isDrawingMode) return;
        const onKey = (e: KeyboardEvent) => {
            if (!(e.ctrlKey || e.metaKey)) return;
            if (e.key === 'z') { e.shiftKey ? handleRedo() : handleUndo(); e.preventDefault(); }
            if (e.key === 'y') { handleRedo(); e.preventDefault(); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isDrawingMode, handleUndo, handleRedo]);

    // re-configure context when tool/color/theme/size changes
    useEffect(() => {
        if (ctxRef.current) configureContext(ctxRef.current, tool, color, theme, brushSize);
    }, [configureContext, tool, color, theme, brushSize]);

    // drawing events
    useEffect(() => {
        if (!isDrawingMode) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const getPos = (e: MouseEvent | TouchEvent) => {
            const rect = rectRef.current ?? canvas.getBoundingClientRect();
            if ("touches" in e && e.touches.length > 0)
                return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
            const m = e as MouseEvent;
            return { x: m.clientX - rect.left, y: m.clientY - rect.top };
        };

        const startDraw = (e: MouseEvent | TouchEvent) => {
            if (!ctxRef.current) return;
            if ("button" in e && e.button !== 0) return;
            if ("touches" in e && e.touches.length > 1) return;
            isDrawingRef.current = true;
            const pos = getPos(e);
            if (['line', 'rectangle', 'circle'].includes(tool)) {
                startPosRef.current  = pos;
                snapshotRef.current  = ctxRef.current.getImageData(0, 0, canvas.width, canvas.height);
            } else {
                ctxRef.current.beginPath();
                ctxRef.current.moveTo(pos.x, pos.y);
            }
        };

        const draw = (e: MouseEvent | TouchEvent) => {
            if (!isDrawingRef.current || !ctxRef.current) return;
            if ("touches" in e && e.touches.length > 1) return;
            e.preventDefault();
            const pos   = getPos(e);
            const start = startPosRef.current;

            if (['line', 'rectangle', 'circle'].includes(tool)) {
                if (snapshotRef.current) ctxRef.current.putImageData(snapshotRef.current, 0, 0);
                if (!start) return;
                ctxRef.current.beginPath();
                if (tool === 'line') {
                    ctxRef.current.moveTo(start.x, start.y);
                    ctxRef.current.lineTo(pos.x, pos.y);
                } else if (tool === 'rectangle') {
                    const isHighlighter = COLORS.find(c => c.id === color)?.isHighlighter;
                    isHighlighter
                        ? ctxRef.current.fillRect(start.x, start.y, pos.x - start.x, pos.y - start.y)
                        : ctxRef.current.strokeRect(start.x, start.y, pos.x - start.x, pos.y - start.y);
                    return;
                } else if (tool === 'circle') {
                    const r = Math.hypot(pos.x - start.x, pos.y - start.y);
                    ctxRef.current.arc(start.x, start.y, r, 0, 2 * Math.PI);
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
            startPosRef.current  = null;
            snapshotRef.current  = null;
            ctxRef.current?.beginPath();
            saveToHistory();
        };

        canvas.addEventListener("mousedown",  startDraw);
        canvas.addEventListener("mousemove",  draw);
        canvas.addEventListener("mouseup",    endDraw);
        canvas.addEventListener("mouseleave", endDraw);
        canvas.addEventListener("touchstart", startDraw, { passive: false });
        canvas.addEventListener("touchmove",  draw,      { passive: false });
        canvas.addEventListener("touchend",   endDraw);
        canvas.addEventListener("touchcancel",endDraw);

        return () => {
            canvas.removeEventListener("mousedown",  startDraw);
            canvas.removeEventListener("mousemove",  draw);
            canvas.removeEventListener("mouseup",    endDraw);
            canvas.removeEventListener("mouseleave", endDraw);
            canvas.removeEventListener("touchstart", startDraw);
            canvas.removeEventListener("touchmove",  draw);
            canvas.removeEventListener("touchend",   endDraw);
            canvas.removeEventListener("touchcancel",endDraw);
        };
    }, [isDrawingMode, tool, color, brushSize]);

    useEffect(() => {
        if (!isDrawingMode) return;
        const onMove = (e: PointerEvent) => {
            if (cursorRef.current)
                cursorRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
        };
        window.addEventListener('pointermove', onMove);
        return () => window.removeEventListener('pointermove', onMove);
    }, [isDrawingMode]);

    const getCssColor = () => {
        if (tool === 'eraser') return 'transparent';
        if (color === 'default') return theme === 'dark' ? '#ffffff' : '#2a2a2a';
        const solidMap: Record<string, string> = {
            'rgba(232, 206, 126, 0.42)': 'rgb(232, 206, 126)',
            'rgba(202, 158, 176, 0.36)': 'rgb(202, 158, 176)',
            'rgba(143, 169, 188, 0.32)': 'rgb(143, 169, 188)',
        };
        return solidMap[color] ?? color;
    };

    if (!isDrawingMode) return null;

    return (
        <>
            {/* custom cursor dot */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 pointer-events-none rounded-full border-2 border-white"
                style={{
                    zIndex: Z_INDEX.drawingCursor,
                    width:  tool === 'eraser' ? 40 : brushSize * 1.5,
                    height: tool === 'eraser' ? 40 : brushSize * 1.5,
                    backgroundColor: tool === 'eraser' ? 'transparent' : getCssColor(),
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
                    transition: 'width 0.1s, height 0.1s, background-color 0.1s',
                    willChange: 'transform',
                }}
            />

            {/* canvas layer */}
            <div className="fixed inset-0 pointer-events-none" style={{ cursor: "none", zIndex: Z_INDEX.drawingCanvas }}>
                <canvas ref={canvasRef} className="w-full h-full touch-none pointer-events-auto" style={{ cursor: "none" }} />
            </div>

            {/* toolbar */}
            <AnimatePresence>
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0,   opacity: 1 }}
                    exit={{ y: 100,    opacity: 0 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-paper/90 backdrop-blur-sm border border-ink/35 p-3 rounded-2xl shadow-xl flex items-center gap-3 max-w-[95vw] overflow-x-auto pointer-events-auto"
                    style={{ zIndex: Z_INDEX.drawingToolbar }}
                >
                    {/* undo / redo */}
                    <div className="flex items-center gap-2">
                        <Button variant="iconSoft" size="icon" onClick={handleUndo} className="h-9 w-9 active:scale-95" title="Undo (Ctrl+Z)"><Undo2 className="w-5 h-5" /></Button>
                        <Button variant="iconSoft" size="icon" onClick={handleRedo} className="h-9 w-9 active:scale-95" title="Redo (Ctrl+Y)"><Redo2 className="w-5 h-5" /></Button>
                    </div>

                    <Divider />

                    {/* draw tools */}
                    <div className="flex items-center gap-2">
                        {DRAW_TOOLS.map((t) => (
                            <ToolBtn key={t.id} icon={t.icon} label={t.label}
                                iconCls={'iconCls' in t ? (t.iconCls as string) : undefined}
                                active={tool === t.id} onClick={() => setTool(t.id as typeof tool)} />
                        ))}
                    </div>

                    {tool !== 'eraser' && <>
                        <Divider />

                        {/* brush size */}
                        <div className="flex items-center gap-2">
                            {BRUSH_SIZES.map((b) => (
                                <Button key={b.label} variant="ghost" size="icon" onClick={() => setBrushSize(b.size)}
                                    className={cn('relative h-9 w-9 rounded-full transition-all',
                                        brushSize === b.size ? 'bg-ink/10 scale-110 ring-2 ring-ink/20' : 'hover:bg-ink/5')}
                                    title={b.label}>
                                    <div className={cn('rounded-full bg-ink', brushSize === b.size ? 'opacity-100' : 'opacity-60')}
                                        style={{ width: Math.min(b.size + 4, 18), height: Math.min(b.size + 4, 18) }} />
                                </Button>
                            ))}
                        </div>

                        <Divider />

                        {/* color picker */}
                        <div className="flex items-center gap-2">
                            {COLORS.map((c) => (
                                <Button key={c.id} variant="ghost" size="icon" onClick={() => setColor(c.id)}
                                    className={cn('h-8 w-8 rounded-full border transition-transform hover:scale-110', c.color,
                                        color === c.id
                                            ? 'scale-110 border-ink/45 shadow-sm ring-2 ring-offset-1 ring-ink/20'
                                            : 'border-transparent opacity-80 hover:opacity-100')}
                                    title={c.label} />
                            ))}
                        </div>
                    </>}

                    <Divider />

                    {/* close */}
                    <Button variant="iconSoft" size="icon" onClick={toggleDrawingMode}
                        className="h-9 w-9 bg-highlighter-pink/30 hover:bg-highlighter-pink/50" title="Close">
                        <X className="w-5 h-5" />
                    </Button>
                </motion.div>
            </AnimatePresence>
        </>
    );
}
