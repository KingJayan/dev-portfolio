import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function makeRes() {
    return {
        _status: 200,
        _body: undefined as unknown,
        _headers: {} as Record<string, string>,
        status(code: number) { this._status = code; return this; },
        json(body: unknown) { this._body = body; return this; },
        setHeader(key: string, val: string) { this._headers[key] = val; return this; },
    } as unknown as VercelResponse & { _status: number; _body: unknown; _headers: Record<string, string> };
}

describe('api/github', () => {
    beforeEach(async () => {
        mockFetch.mockReset();
        vi.resetModules();
    });

    it('returns repos from upstream and sets cache headers', async () => {
        const repos = [{ id: 1, name: 'repo-a' }];
        mockFetch.mockResolvedValue({ ok: true, json: async () => repos });
        const { default: handler } = await import('../../api/github');
        const res = makeRes();
        await handler({} as VercelRequest, res);
        expect(res._status).toBe(200);
        expect(res._body).toEqual(repos);
        expect(res._headers['Cache-Control']).toContain('s-maxage=300');
        expect(res._headers['X-Cache']).toBe('MISS');
    });

    it('returns 502-level status on GitHub error', async () => {
        mockFetch.mockResolvedValue({ ok: false, status: 403 });
        const { default: handler } = await import('../../api/github');
        const res = makeRes();
        await handler({} as VercelRequest, res);
        expect(res._status).toBe(403);
    });

    it('uses in-process cache on second call without resetting modules', async () => {
        const repos = [{ id: 2, name: 'repo-b' }];
        mockFetch.mockResolvedValue({ ok: true, json: async () => repos });
        const { default: handler } = await import('../../api/github');
        const res1 = makeRes();
        await handler({} as VercelRequest, res1);
        expect(res1._headers['X-Cache']).toBe('MISS');
        const res2 = makeRes();
        await handler({} as VercelRequest, res2);
        expect(res2._headers['X-Cache']).toBe('HIT');
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });
});
