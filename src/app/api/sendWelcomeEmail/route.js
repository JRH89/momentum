import { NextResponse } from 'next/server';
import sendgrid from '@sendgrid/mail';
import siteMetadata from '../../../../siteMetadata'

// Set your SendGrid API key (store it in environment variables for security)
sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY);

export async function POST(request) {
    const { email } = await request.json();

    const msg = {
        to: email,
        from: process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL,
        subject: `Welcome to ${siteMetadata.title}!`,
        html: `
            <div style="text-align: center;">
                <h1>Welcome to ${siteMetadata.title}!</h1>
                <p>Thank you for signing up. We're excited to have you on board!</p>
                <p>To get started, please visit your dashboard: <a href="${siteMetadata.siteUrl}/Dashboard">Your Dashboard</a></p>
                <p>If you have any questions, feel free to reach out to us at ${siteMetadata.title}.</p>
                <p>Best regards,</p>
                <p>The ${siteMetadata.title} Team</p>
            </div>
        `,
    };

    try {
        await sendgrid.send(msg);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ success: false, error: error.message });
    }
}
