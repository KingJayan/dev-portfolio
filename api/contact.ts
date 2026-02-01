import type { VercelRequest, VercelResponse } from '@vercel/node';
import Mailjet from 'node-mailjet';

const mailjet = new Mailjet({
    apiKey: process.env.MAILJET_API_KEY || '',
    apiSecret: process.env.MAILJET_SECRET_KEY || ''
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { name, email, message } = req.body;

    try {
        await mailjet.post("send", { version: 'v3.1' }).request({
            Messages: [
                {
                    From: { Email: "jayanp0202@gmail.com", Name: "Portfolio Contact" },
                    To: [{ Email: "jayanp0202@gmail.com", Name: "Jayan Patel" }],
                    Subject: `New message from ${name}`,
                    TextPart: `Message from ${name} (${email}):\n\n${message}`,
                }
            ]
        });

        return res.status(200).json({ success: true });
    } catch (error: any) {
        console.error('Mailjet API Error:', error.response?.body || error.message || error);
        return res.status(500).json({
            error: 'Failed to send email',
            details: error.response?.body || error.message
        });
    }
}