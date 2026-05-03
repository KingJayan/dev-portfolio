import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useParallaxMouse } from '@/hooks/use-parallax-mouse';

describe('useParallaxMouse', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    });

    it('initializes mouseX and mouseY as motion values', () => {
        const { result } = renderHook(() => useParallaxMouse());
        expect(result.current.mouseX).toBeDefined();
        expect(result.current.mouseY).toBeDefined();
    });

    it('registers and removes mousemove listener', () => {
        const addSpy = vi.spyOn(window, 'addEventListener');
        const removeSpy = vi.spyOn(window, 'removeEventListener');
        const { unmount } = renderHook(() => useParallaxMouse());
        expect(addSpy).toHaveBeenCalledWith('mousemove', expect.any(Function), { passive: true });
        unmount();
        expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
        addSpy.mockRestore();
        removeSpy.mockRestore();
    });

    it('updates raw values on mousemove', () => {
        const { result } = renderHook(() => useParallaxMouse());
        act(() => {
            window.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 400 }));
        });
        expect(result.current.mouseX).toBeDefined();
        expect(result.current.mouseY).toBeDefined();
    });
});
