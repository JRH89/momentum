import { NextResponse } from 'next/server';
import sendgrid from '@sendgrid/mail';
import siteMetadata from '../../../../siteMetadata';

const SENDGRID_API_KEY = process.env.NEXT_PUBLIC_SENDGRID_API_KEY;
const FROM_EMAIL = process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL;

if (!SENDGRID_API_KEY || !FROM_EMAIL) {
    throw new Error("Missing SendGrid API Key or FROM email in environment variables.");
}

// Set SendGrid API key securely
sendgrid.setApiKey(SENDGRID_API_KEY);

export async function POST(request) {
    try {
        const { email, userID } = await request.json();

        if (!email || !userID) {
            return NextResponse.json({ success: false, error: "Missing email or userID" }, { status: 400 });
        }

        const msg = {
            to: email,
            from: FROM_EMAIL,
            subject: `Welcome to ${siteMetadata.title}!`,
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #e0e0e0;">
        <div style="text-align: center; padding-bottom: 20px;">
            <img src="${siteMetadata.siteUrl}/logo.png" alt="${siteMetadata.title} Logo" style="max-width: 150px; height: auto; border-radius: 8px; border: 2px solid #000000;">
        </div>
        <div style="padding: 20px; border-radius: 8px;">
            <h1 style="color: #333; font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px;">Welcome to ${siteMetadata.title}!</h1>
            <p style="color: #555; font-size: 16px; text-align: center; line-height: 1.6;">
                Thank you for signing up. We're excited to have you on board!
            </p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${siteMetadata.siteUrl}/Dashboard/${userID}" 
                   style="display: inline-block; background-color: #22d3ee; color: #000000; text-decoration: none; font-size: 16px; padding: 12px 20px; border-radius: 5px; border: 2px solid #000000;">
                    Access Your Dashboard
                </a>
            </div>
            <p style="color: #555; font-size: 16px; text-align: center; line-height: 1.6;">
                If you have any questions, feel free to reach out:
            </p>
            <ul style="list-style-type: none; padding: 0; text-align: center;">
                <li style="margin-bottom: 8px;">
                    📧 <a href="mailto:${siteMetadata.email}" style="color: #007BFF; text-decoration: none;">${siteMetadata.email}</a>
                </li>
                <li>
                    📄 <a href="${siteMetadata.siteUrl}/Contact" style="color: #007BFF; text-decoration: none;">Contact Support</a>
                </li>
            </ul>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #777; font-size: 14px; text-align: center;">
                Best regards,<br>
                <strong>The ${siteMetadata.title} Team</strong>
            </p>
        </div>
    </div>
`

        };

        await sendgrid.send(msg);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
