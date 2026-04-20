import { renderHook, act } from "@testing-library/react";
import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { ThemeProvider, useTheme } from "@/hooks/use-theme";

const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(ThemeProvider, null, children);

beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
});

describe("useTheme", () => {
    it("throws when used outside ThemeProvider", () => {
        expect(() => renderHook(() => useTheme())).toThrow();
    });

    it("defaults to light theme", () => {
        const { result } = renderHook(() => useTheme(), { wrapper });
        expect(result.current.theme).toBe("light");
    });

    it("toggleTheme switches to dark", () => {
        const { result } = renderHook(() => useTheme(), { wrapper });
        act(() => result.current.toggleTheme());
        expect(result.current.theme).toBe("dark");
    });

    it("toggleTheme round-trips back to light", () => {
        const { result } = renderHook(() => useTheme(), { wrapper });
        act(() => result.current.toggleTheme());
        act(() => result.current.toggleTheme());
        expect(result.current.theme).toBe("light");
    });

    it("persists theme to localStorage", () => {
        const { result } = renderHook(() => useTheme(), { wrapper });
        act(() => result.current.toggleTheme());
        expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("reads theme from localStorage on mount", () => {
        localStorage.setItem("theme", "dark");
        const { result } = renderHook(() => useTheme(), { wrapper });
        expect(result.current.theme).toBe("dark");
    });

    it("applies theme class to documentElement", () => {
        const { result } = renderHook(() => useTheme(), { wrapper });
        expect(document.documentElement.classList.contains("light")).toBe(true);
        act(() => result.current.toggleTheme());
        expect(document.documentElement.classList.contains("dark")).toBe(true);
        expect(document.documentElement.classList.contains("light")).toBe(false);
    });

    it("defaults isZenMode to false", () => {
        const { result } = renderHook(() => useTheme(), { wrapper });
        expect(result.current.isZenMode).toBe(false);
    });

    it("toggleZenMode activates zen mode", () => {
        const { result } = renderHook(() => useTheme(), { wrapper });
        act(() => result.current.toggleZenMode());
        expect(result.current.isZenMode).toBe(true);
    });

    it("persists zen mode to localStorage", () => {
        const { result } = renderHook(() => useTheme(), { wrapper });
        act(() => result.current.toggleZenMode());
        expect(localStorage.getItem("zenMode")).toBe("true");
    });

    it("adds zen-mode class when active", () => {
        const { result } = renderHook(() => useTheme(), { wrapper });
        act(() => result.current.toggleZenMode());
        expect(document.documentElement.classList.contains("zen-mode")).toBe(true);
    });

    it("removes zen-mode class when deactivated", () => {
        const { result } = renderHook(() => useTheme(), { wrapper });
        act(() => result.current.toggleZenMode());
        act(() => result.current.toggleZenMode());
        expect(document.documentElement.classList.contains("zen-mode")).toBe(false);
    });
});
