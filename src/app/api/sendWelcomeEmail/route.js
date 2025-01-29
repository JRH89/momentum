import { NextResponse } from 'next/server';
import sendgrid from '@sendgrid/mail';
import siteMetadata from '../../../../siteMetadata';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

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
                <div style="text-align: center;">
                    <h1>Welcome to ${siteMetadata.title}!</h1>
                    <p>Thank you for signing up. We're excited to have you on board!</p>
                    <p>To get started, visit your dashboard: 
                        <a href="${siteMetadata.siteUrl}/Dashboard/${userID}">${siteMetadata.siteUrl}/Dashboard/${userID}</a>
                    </p>
                    <p>If you have any questions, contact us at 
                        <a href="mailto:${siteMetadata.email}">${siteMetadata.email}</a> or use our 
                        <a href="${siteMetadata.siteUrl}/Contact">Contact Form</a>.
                    </p>
                    <p>Best regards,</p>
                    <p>The ${siteMetadata.title} Team</p>
                </div>
            `,
        };

        await sendgrid.send(msg);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
