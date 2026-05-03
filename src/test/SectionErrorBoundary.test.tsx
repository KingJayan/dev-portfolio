import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import SectionErrorBoundary from '@/components/SectionErrorBoundary';

const Bomb = () => { throw new Error('test error'); };

describe('SectionErrorBoundary', () => {
    it('renders children when no error', () => {
        render(<SectionErrorBoundary><div>ok</div></SectionErrorBoundary>);
        expect(screen.getByText('ok')).toBeTruthy();
    });

    it('shows fallback UI on error', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(<SectionErrorBoundary><Bomb /></SectionErrorBoundary>);
        expect(screen.getByText(/could not load this section/i)).toBeTruthy();
        spy.mockRestore();
    });

    it('retry button resets error state', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        let shouldThrow = true;
        const Conditional = () => {
            if (shouldThrow) throw new Error('boom');
            return <div>recovered</div>;
        };
        const { rerender } = render(<SectionErrorBoundary><Conditional /></SectionErrorBoundary>);
        expect(screen.getByText(/could not load/i)).toBeTruthy();
        shouldThrow = false;
        fireEvent.click(screen.getByRole('button', { name: /retry/i }));
        rerender(<SectionErrorBoundary><Conditional /></SectionErrorBoundary>);
        expect(screen.getByText('recovered')).toBeTruthy();
        spy.mockRestore();
    });
});
