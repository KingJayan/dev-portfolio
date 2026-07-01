import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import DrawText from "@/components/DrawText";

const { parseMock } = vi.hoisted(() => ({
    parseMock: vi.fn(),
}));

vi.mock("framer-motion", () => {
    const proxy = new Proxy({} as Record<string, React.FC>, {
        get: (_t, tag: string) =>
            ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
                React.createElement(tag as keyof JSX.IntrinsicElements, props, children),
    });
    return {
        motion: proxy,
        m: proxy,
        useReducedMotion: () => false,
        AnimatePresence: ({ children }: { children: React.ReactNode }) =>
            React.createElement(React.Fragment, null, children),
    };
});

vi.mock("opentype.js", () => ({
    parse: parseMock,
}));

vi.mock("@/hooks/use-reduced-motion", () => ({
    usePrefersReducedMotion: () => false,
}));

class ResizeObserverMock {
    observe() {}
    disconnect() {}
}

type MockFont = {
    unitsPerEm: number;
    ascender: number;
    descender: number;
    charToGlyph: (char: string) => {
        advanceWidth?: number;
        getPath: () => { toPathData: () => string };
    };
};

let currentFont: MockFont;

function createFont(pathDataByChar: Record<string, string>): MockFont {
    return {
        unitsPerEm: 1000,
        ascender: 800,
        descender: -200,
        charToGlyph: (char: string) => ({
            advanceWidth: 500,
            getPath: () => ({
                toPathData: () => pathDataByChar[char] ?? "M0 0L1 1",
            }),
        }),
    };
}

beforeEach(() => {
    parseMock.mockReset();
    currentFont = createFont({});
    parseMock.mockImplementation(() => currentFont);
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    vi.stubGlobal(
        "fetch",
        vi.fn(async () => ({
            arrayBuffer: async () => new ArrayBuffer(8),
        }))
    );
});

describe("DrawText", () => {
    it("falls back to plain text when a glyph path contains NaN", async () => {
        currentFont = createFont({ d: "M0 0Q10 10 NaN 20" });

        const { container } = render(<DrawText text="d" fontUrl="/fonts/PermanentMarker.woff?invalid" />);

        await waitFor(() => expect(parseMock).toHaveBeenCalled());

        expect(screen.getByText("d")).toBeInTheDocument();
        expect(container.querySelector("svg")).toBeNull();
    });

    it("renders an svg path when the glyph data is valid", async () => {
        currentFont = createFont({ d: "M0 0L10 10" });

        const { container } = render(<DrawText text="d" fontUrl="/fonts/PermanentMarker.woff?valid" />);

        await waitFor(() => expect(container.querySelector("svg path")).not.toBeNull());

        expect(container.querySelector("svg")).not.toBeNull();
        expect(container.querySelector("svg path")?.getAttribute("d")).toContain("M0 0L10 10");
    });
});