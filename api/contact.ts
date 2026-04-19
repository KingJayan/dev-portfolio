import type { VercelRequest, VercelResponse } from '@vercel/node';
import Mailjet from 'node-mailjet';

const mailjet = new Mailjet({
    apiKey: process.env.MAILJET_API_KEY || '',
    apiSecret: process.env.MAILJET_SECRET_KEY || ''
});

// Simple in-memory rate limiter: max 3 requests per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        return false;
    }
    if (entry.count >= RATE_LIMIT) return true;
    entry.count++;
    return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ?? 'unknown';
    if (isRateLimited(ip)) return res.status(429).json({ error: 'Too many requests. Please try again later.' });

    const { name, email, message } = req.body ?? {};

    if (!name || typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 100)
        return res.status(400).json({ error: 'Invalid name.' });
    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 254)
        return res.status(400).json({ error: 'Invalid email address.' });
    if (!message || typeof message !== 'string' || message.trim().length < 1 || message.trim().length > 2000)
        return res.status(400).json({ error: 'Message must be between 1 and 2000 characters.' });

    try {
        const safeName = name.trim();
        const safeMessage = message.trim();
        await mailjet.post("send", { version: 'v3.1' }).request({
            Messages: [
                {
                    From: { Email: "jayanp0202@gmail.com", Name: "Portfolio Contact" },
                    To: [{ Email: "jayanp0202@gmail.com", Name: "Jayan Patel" }],
                    Subject: `New message from ${safeName}`,
                    TextPart: `Message from ${safeName} (${email}):\n\n${safeMessage}`,
                }
            ]
        });

        return res.status(200).json({ success: true });
    } catch (error: any) {
        console.error('Mailjet API Error:', error.response?.body || error.message || error);
        return res.status(500).json({
            error: 'Failed to send message. Please try again later.'
        });
    }
}