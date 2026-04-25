import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import ScribbleText from "@/components/ScribbleText";

vi.mock("framer-motion", () => ({
    motion: new Proxy({} as Record<string, React.FC>, {
        get: (_t, tag: string) =>
            ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
                React.createElement(tag as keyof JSX.IntrinsicElements, props, children),
    }),
}));

vi.mock("@/hooks/use-reduced-motion", () => ({
    usePrefersReducedMotion: () => false,
}));

describe("ScribbleText", () => {
    it("renders children", () => {
        render(<ScribbleText>hello</ScribbleText>);
        expect(screen.getByText("hello")).toBeInTheDocument();
    });

    it("renders an aria-hidden SVG underline", () => {
        const { container } = render(<ScribbleText>world</ScribbleText>);
        const svg = container.querySelector("svg");
        expect(svg).not.toBeNull();
        expect(svg?.getAttribute("aria-hidden")).toBe("true");
    });

    it("applies custom className", () => {
        const { container } = render(<ScribbleText className="text-xl">hi</ScribbleText>);
        expect(container.firstChild).toHaveClass("text-xl");
    });

    it("applies custom color class to SVG", () => {
        const { container } = render(<ScribbleText color="text-highlighter-yellow">colored</ScribbleText>);
        const svg = container.querySelector("svg");
        expect(svg?.getAttribute("class")).toContain("text-highlighter-yellow");
    });
});
