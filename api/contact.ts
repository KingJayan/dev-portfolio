import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
});

const RATE_LIMIT = 3;
const RATE_WINDOW_SEC = 10 * 60;

async function isRateLimited(ip: string): Promise<boolean> {
    const key = `rl:contact:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, RATE_WINDOW_SEC);
    return count > RATE_LIMIT;
}

const bodySchema = z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().email().max(254),
    message: z.string().trim().min(1).max(2000),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ?? 'unknown';
    if (await isRateLimited(ip)) return res.status(429).json({ error: 'too many requests. try again later.' });

    const parsed = bodySchema.safeParse(req.body ?? {});
    if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'invalid input.' });

    const { name: safeName, email, message: safeMessage } = parsed.data;

    try {
        await transporter.sendMail({
            from: `"portfolio contact" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
            replyTo: email,
            subject: `new message from ${safeName}`,
            text: `from: ${safeName} <${email}>\n\n${safeMessage}`,
            html: `<p><strong>from:</strong> ${safeName} &lt;${email}&gt;</p><pre style="font-family:sans-serif">${safeMessage}</pre>`,
        });

        return res.status(200).json({ success: true });
    } catch (error: unknown) {
        console.error('mail error:', error);
        const msg = error instanceof Error ? error.message : '';
        const code = error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code
            ? (error as NodeJS.ErrnoException).code
            : '';
        if (code === 'ETIMEDOUT' || code === 'ECONNREFUSED' || code === 'ENOTFOUND') {
            return res.status(500).json({ error: 'smtp connection timed out.', code: 'SMTP_TIMEOUT' });
        }
        if (msg.includes('Invalid login') || msg.includes('Username and Password')) {
            return res.status(500).json({ error: 'smtp auth failed.', code: 'SMTP_AUTH' });
        }
        return res.status(500).json({ error: 'failed to send. try again later.', code: 'UNKNOWN' });
    }
}
