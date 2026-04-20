import { describe, it, expect, vi, beforeEach } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";

vi.mock("@vercel/kv", () => ({
    kv: { incr: vi.fn(), expire: vi.fn() },
}));

const mockSendMail = vi.fn().mockResolvedValue({});
vi.mock("nodemailer", () => ({
    default: {
        createTransport: vi.fn(() => ({ sendMail: mockSendMail })),
    },
}));

import { kv } from "@vercel/kv";

function makeReq(overrides: Record<string, unknown> = {}, method = "POST") {
    return {
        method,
        headers: { "x-forwarded-for": "1.2.3.4" },
        body: { name: "test user", email: "test@example.com", message: "hello this is a test message", ...overrides },
    } as unknown as VercelRequest;
}

function makeRes() {
    return {
        _status: 200,
        _body: {} as unknown,
        status(code: number) { this._status = code; return this; },
        json(body: unknown) { this._body = body; return this; },
    };
}

type Res = ReturnType<typeof makeRes>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let contactHandler: (req: VercelRequest, res: VercelResponse) => Promise<any>;

beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env.GMAIL_USER = "test@gmail.com";
    process.env.GMAIL_APP_PASSWORD = "secret";
    (kv.incr as ReturnType<typeof vi.fn>).mockResolvedValue(1);
    mockSendMail.mockResolvedValue({});
    const mod = await import("../../api/contact");
    contactHandler = mod.default;
});

async function call(req: VercelRequest, res: Res) {
    await contactHandler(req, res as unknown as VercelResponse);
}

describe("contact handler", () => {
    it("rejects non-POST methods", async () => {
        const res = makeRes();
        await call(makeReq({}, "GET"), res);
        expect(res._status).toBe(405);
    });

    it("returns 200 on valid input", async () => {
        const res = makeRes();
        await call(makeReq(), res);
        expect(res._status).toBe(200);
        expect((res._body as { success: boolean }).success).toBe(true);
    });

    it("returns 429 when rate limit exceeded", async () => {
        (kv.incr as ReturnType<typeof vi.fn>).mockResolvedValue(4);
        const res = makeRes();
        await call(makeReq(), res);
        expect(res._status).toBe(429);
    });

    it("returns 400 for missing name", async () => {
        const res = makeRes();
        await call(makeReq({ name: "" }), res);
        expect(res._status).toBe(400);
    });

    it("returns 400 for invalid email", async () => {
        const res = makeRes();
        await call(makeReq({ email: "not-an-email" }), res);
        expect(res._status).toBe(400);
    });

    it("returns 400 for empty message", async () => {
        const res = makeRes();
        await call(makeReq({ message: "" }), res);
        expect(res._status).toBe(400);
    });

    it("returns 400 for message over 2000 chars", async () => {
        const res = makeRes();
        await call(makeReq({ message: "a".repeat(2001) }), res);
        expect(res._status).toBe(400);
    });

    it("returns 400 for name over 100 chars", async () => {
        const res = makeRes();
        await call(makeReq({ name: "a".repeat(101) }), res);
        expect(res._status).toBe(400);
    });

    it("returns 500 when sendMail throws", async () => {
        mockSendMail.mockRejectedValueOnce(new Error("smtp error"));
        const res = makeRes();
        await call(makeReq(), res);
        expect(res._status).toBe(500);
    });

    it("calls kv.expire on first request from an ip", async () => {
        const res = makeRes();
        await call(makeReq(), res);
        expect(kv.expire).toHaveBeenCalledOnce();
    });

    it("skips kv.expire on subsequent requests", async () => {
        (kv.incr as ReturnType<typeof vi.fn>).mockResolvedValue(2);
        const res = makeRes();
        await call(makeReq(), res);
        expect(kv.expire).not.toHaveBeenCalled();
    });
});
