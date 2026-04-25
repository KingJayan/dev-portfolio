import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";

const mockToggleDrawingMode = vi.fn();
const mockSetTool = vi.fn();

const defaultDrawing = {
    isDrawingMode: true,
    tool: "pencil" as const,
    setTool: mockSetTool,
    toggleDrawingMode: mockToggleDrawingMode,
    color: "default",
    setColor: vi.fn(),
    brushSize: 2,
    setBrushSize: vi.fn(),
};

vi.mock("@/contexts/DrawingContext", () => ({
    useDrawing: () => defaultDrawing,
}));

vi.mock("@/hooks/use-theme", () => ({
    useTheme: () => ({ theme: "light" }),
}));

vi.mock("@/hooks/use-canvas-history", () => ({
    useCanvasHistory: () => ({
        initHistory: vi.fn(),
        saveToHistory: vi.fn(),
        handleUndo: vi.fn(),
        handleRedo: vi.fn(),
    }),
}));

vi.mock("@/hooks/use-canvas-context", () => ({
    useCanvasContext: () => ({ configureContext: vi.fn() }),
}));

vi.mock("framer-motion", () => ({
    motion: new Proxy({} as Record<string, React.FC>, {
        get: (_t, tag: string) =>
            ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
                React.createElement(tag as keyof JSX.IntrinsicElements, props, children),
    }),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));

vi.mock("@/lib/z-index", () => ({
    Z_INDEX: { drawingCursor: 9999, drawingCanvas: 9998, drawingToolbar: 9997 },
}));

import FreeDrawCanvas from "@/components/FreeDrawCanvas";

describe("FreeDrawCanvas", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
            getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 })),
            putImageData: vi.fn(),
            beginPath: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            stroke: vi.fn(),
            clearRect: vi.fn(),
            strokeRect: vi.fn(),
            fillRect: vi.fn(),
            arc: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
        })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
    });

    it("renders canvas with ARIA label when drawing mode is active", () => {
        render(<FreeDrawCanvas />);
        const canvas = screen.getByRole("img");
        expect(canvas).toBeInTheDocument();
        expect(canvas).toHaveAttribute("aria-label");
    });

    it("renders close button", () => {
        render(<FreeDrawCanvas />);
        expect(screen.getByTitle("Close")).toBeInTheDocument();
    });

    it("calls toggleDrawingMode when close is clicked", () => {
        render(<FreeDrawCanvas />);
        fireEvent.click(screen.getByTitle("Close"));
        expect(mockToggleDrawingMode).toHaveBeenCalledOnce();
    });

    it("renders all draw tool buttons", () => {
        render(<FreeDrawCanvas />);
        expect(screen.getByTitle("Pencil")).toBeInTheDocument();
        expect(screen.getByTitle("Line")).toBeInTheDocument();
        expect(screen.getByTitle("Rectangle")).toBeInTheDocument();
        expect(screen.getByTitle("Circle")).toBeInTheDocument();
        expect(screen.getByTitle("Eraser")).toBeInTheDocument();
    });

    it("calls setTool when a tool button is clicked", () => {
        render(<FreeDrawCanvas />);
        fireEvent.click(screen.getByTitle("Eraser"));
        expect(mockSetTool).toHaveBeenCalledWith("eraser");
    });

    it("renders null when drawing mode is inactive", () => {
        defaultDrawing.isDrawingMode = false;
        const { container } = render(<FreeDrawCanvas />);
        expect(container.firstChild).toBeNull();
        defaultDrawing.isDrawingMode = true;
    });
});
