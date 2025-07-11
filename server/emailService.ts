import Mailjet from 'node-mailjet';
import type { Contact } from '@shared/schema';

let mailjetClient: Mailjet | null = null;

// Initialize Mailjet service
if (process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY) {
  mailjetClient = new Mailjet({
    apiKey: process.env.MAILJET_API_KEY,
    apiSecret: process.env.MAILJET_SECRET_KEY
  });
}

export interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendContactEmail(contact: Contact): Promise<boolean> {
  if (!mailjetClient) {
    console.warn('Mailjet not configured - email not sent');
    return false;
  }

  const { name, email, subject, message } = contact;
  
  try {
    const request = mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'noreply@jayanpatel.dev', // This needs to be a verified sender in Mailjet
              Name: 'Portfolio Website'
            },
            To: [
              {
                Email: 'jayanp0202@gmail.com',
                Name: 'Portfolio Owner'
              }
            ],
            Subject: `Portfolio Contact: ${subject}`,
            TextPart: `
New contact form submission:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from your portfolio website.
            `,
            HTMLPart: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #3b82f6; margin-bottom: 20px;">New Contact Form Submission</h2>
  
  <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
    <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #3b82f6;">${email}</a></p>
    <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
  </div>
  
  <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #3b82f6; margin-bottom: 20px;">
    <h3 style="color: #374151; margin-top: 0;">Message:</h3>
    <p style="color: #6b7280; line-height: 1.6; white-space: pre-wrap;">${message}</p>
  </div>
  
  <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 14px;">This message was sent from your portfolio website</p>
    <p style="color: #9ca3af; font-size: 12px;">Sent on ${new Date().toLocaleString()}</p>
  </div>
</div>
            `
          }
        ]
      });

    await request;
    console.log('Contact email sent successfully via Mailjet');
    return true;
  } catch (error) {
    console.error('Mailjet email error:', error);
    return false;
  }
}

export function isEmailConfigured(): boolean {
  return !!(process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY);
}