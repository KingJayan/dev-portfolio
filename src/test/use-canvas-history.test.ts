import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useCanvasHistory } from "@/hooks/use-canvas-history";
import type React from "react";

function makeImageData() {
    return { data: new Uint8ClampedArray(400), width: 10, height: 10 } as ImageData;
}

function setup() {
    const mockGetImageData = vi.fn(() => makeImageData());
    const mockPutImageData = vi.fn();

    const ctx = {
        getImageData: mockGetImageData,
        putImageData: mockPutImageData,
    } as unknown as CanvasRenderingContext2D;

    const canvas = {
        width: 10,
        height: 10,
        getContext: vi.fn(() => ctx),
    } as unknown as HTMLCanvasElement;

    const canvasRef = { current: canvas } as React.MutableRefObject<HTMLCanvasElement>;
    const ctxRef = { current: ctx } as React.MutableRefObject<CanvasRenderingContext2D>;

    return { canvasRef, ctxRef, mockGetImageData, mockPutImageData };
}

describe("useCanvasHistory", () => {
    it("initialises history on initHistory call", () => {
        const { canvasRef, ctxRef, mockGetImageData } = setup();
        const { result } = renderHook(() => useCanvasHistory(canvasRef, ctxRef));

        act(() => result.current.initHistory());

        expect(mockGetImageData).toHaveBeenCalledOnce();
        expect(result.current.historyStepRef.current).toBe(0);
        expect(result.current.historyRef.current).toHaveLength(1);
    });

    it("does not re-init if already initialised", () => {
        const { canvasRef, ctxRef, mockGetImageData } = setup();
        const { result } = renderHook(() => useCanvasHistory(canvasRef, ctxRef));

        act(() => {
            result.current.initHistory();
            result.current.initHistory();
        });

        expect(mockGetImageData).toHaveBeenCalledOnce();
    });

    it("saveToHistory appends state and increments step", () => {
        const { canvasRef, ctxRef } = setup();
        const { result } = renderHook(() => useCanvasHistory(canvasRef, ctxRef));

        act(() => {
            result.current.initHistory();
            result.current.saveToHistory();
        });

        expect(result.current.historyRef.current).toHaveLength(2);
        expect(result.current.historyStepRef.current).toBe(1);
    });

    it("handleUndo decrements step and calls putImageData", () => {
        const { canvasRef, ctxRef, mockPutImageData } = setup();
        const { result } = renderHook(() => useCanvasHistory(canvasRef, ctxRef));

        act(() => {
            result.current.initHistory();
            result.current.saveToHistory();
            result.current.handleUndo();
        });

        expect(result.current.historyStepRef.current).toBe(0);
        expect(mockPutImageData).toHaveBeenCalledOnce();
    });

    it("handleUndo does nothing at step 0", () => {
        const { canvasRef, ctxRef, mockPutImageData } = setup();
        const { result } = renderHook(() => useCanvasHistory(canvasRef, ctxRef));

        act(() => {
            result.current.initHistory();
            result.current.handleUndo();
        });

        expect(result.current.historyStepRef.current).toBe(0);
        expect(mockPutImageData).not.toHaveBeenCalled();
    });

    it("handleRedo increments step and calls putImageData", () => {
        const { canvasRef, ctxRef, mockPutImageData } = setup();
        const { result } = renderHook(() => useCanvasHistory(canvasRef, ctxRef));

        act(() => {
            result.current.initHistory();
            result.current.saveToHistory();
            result.current.handleUndo();
            result.current.handleRedo();
        });

        expect(result.current.historyStepRef.current).toBe(1);
        expect(mockPutImageData).toHaveBeenCalledTimes(2);
    });

    it("saveToHistory truncates future states after undo", () => {
        const { canvasRef, ctxRef } = setup();
        const { result } = renderHook(() => useCanvasHistory(canvasRef, ctxRef));

        act(() => {
            result.current.initHistory();
            result.current.saveToHistory();
            result.current.saveToHistory();
            result.current.handleUndo();
            result.current.handleUndo();
            result.current.saveToHistory();
        });

        expect(result.current.historyRef.current).toHaveLength(2);
        expect(result.current.historyStepRef.current).toBe(1);
    });

    it("caps history at 10 entries", () => {
        const { canvasRef, ctxRef } = setup();
        const { result } = renderHook(() => useCanvasHistory(canvasRef, ctxRef));

        act(() => {
            result.current.initHistory();
            for (let i = 0; i < 15; i++) result.current.saveToHistory();
        });

        expect(result.current.historyRef.current.length).toBeLessThanOrEqual(10);
    });
});
