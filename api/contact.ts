import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { kv } from '@vercel/kv';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const RATE_LIMIT = 3;
const RATE_WINDOW_SEC = 10 * 60;

async function isRateLimited(ip: string): Promise<boolean> {
    const key = `rl:contact:${ip}`;
    const count = await kv.incr(key);
    if (count === 1) await kv.expire(key, RATE_WINDOW_SEC);
    return count > RATE_LIMIT;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ?? 'unknown';
    if (await isRateLimited(ip)) return res.status(429).json({ error: 'too many requests. try again later.' });

    const { name, email, message } = req.body ?? {};

    if (!name || typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 100)
        return res.status(400).json({ error: 'invalid name.' });
    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 254)
        return res.status(400).json({ error: 'invalid email.' });
    if (!message || typeof message !== 'string' || message.trim().length < 1 || message.trim().length > 2000)
        return res.status(400).json({ error: 'message must be 1–2000 characters.' });

    const safeName = name.trim();
    const safeMessage = message.trim();

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
        return res.status(500).json({ error: 'failed to send. try again later.' });
    }
}
