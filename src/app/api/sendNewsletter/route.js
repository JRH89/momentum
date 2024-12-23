import { NextResponse } from 'next/server';
import sendgrid from '@sendgrid/mail';
import siteMetadata from '../../../../siteMetadata'; // Adjust path as needed
import { format } from 'date-fns'; // For date formatting

// Set your SendGrid API key
sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY);

export async function POST(request) {
    // Parse the JSON request body
    const { emails, html, subject } = await request.json(); // Expecting an array of email addresses and HTML content

    // Define dynamic subject with current week dates if not provided
    const dynamicSubject = subject + (() => {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6); // Saturday

        const formattedStart = format(startOfWeek, 'MMM dd, yyyy');
        const formattedEnd = format(endOfWeek, 'MMM dd, yyyy');
        return `Newsletter | ${formattedStart} - ${formattedEnd} | ${siteMetadata.title}`;
    })();

    const responses = [];

    // Send email to each address
    for (const email of emails) {
        // Define the email content with dynamic unsubscribe link
        const htmlContent = `
            <div >
                <h1 style="text-align: center;">${siteMetadata.title} Weekly Newsletter</h1>
                <p>${html}</p> <!-- Use the provided HTML content here -->
                <p>If you wish to unsubscribe, please click the following link: <a href="${siteMetadata.siteUrl}/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a></p>
                <p>Thank you for being a part of our community!</p>
                <p>Best regards,</p>
                <p>The ${siteMetadata.title} Team</p>
            </div>
        `;

        const msg = {
            to: email,
            from: process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL, // Replace with your verified sender email
            subject: dynamicSubject,
            html: htmlContent,
        };

        try {
            await sendgrid.send(msg);
            responses.push({ email, success: true });
        } catch (error) {
            console.error('Error sending newsletter:', error);
            responses.push({ email, success: false, error: error.message });
        }
    }

    return NextResponse.json({ responses });
}
