import { NextResponse } from 'next/server';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import siteMetadata from '../../../../siteMetadata'; // Adjust path as needed
import { format } from 'date-fns'; // For date formatting

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

export async function POST(request) {
    try {
        // Parse the JSON request body
        const { emails, body, subject } = await request.json(); // Expecting an array of email addresses and HTML content

        // Check if the html content is defined
        if (!body || body.trim() === '') {
            console.error('HTML content is undefined or empty');
            return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
        }

        // Define dynamic subject with current week dates if not provided
        const dynamicSubject = subject + (() => {
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6); // Saturday

            const formattedStart = format(startOfWeek, 'MMM dd, yyyy');
            const formattedEnd = format(endOfWeek, 'MMM dd, yyyy');
            return ` Newsletter | ${formattedStart} - ${formattedEnd} | ${siteMetadata.title}`;
        })();

        const responses = [];

        // Send email to each address
        for (const email of emails) {
            // Define the email content with dynamic unsubscribe link
            const htmlContent = `
                <div >
                    <h1 style="text-align: center;">${siteMetadata.title} Weekly Newsletter</h1>
                    ${body} <!-- Use the provided HTML content here -->
                    <p>If you wish to unsubscribe, please click the following link: <a href="${siteMetadata.siteUrl}/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a></p>
                    <p>Thank you for being a part of our community!</p>
                    <p>Best regards,</p>
                    <p>The ${siteMetadata.title} Team</p>
                </div>
            `;

            const sentFrom = new Sender(process.env.MAILERSEND_API_USER, siteMetadata.title);
            const recipients = [new Recipient(email, email)];

            const emailParams = new EmailParams()
                .setFrom(sentFrom)
                .setTo(recipients)
                .setSubject(dynamicSubject)
                .setHtml(htmlContent);

            try {
                await mailerSend.email.send(emailParams);
                responses.push({ email, success: true });
            } catch (error) {
                console.error('Error sending newsletter:', error);
                responses.push({ email, success: false, error: error.message });
            }
        }

        return NextResponse.json({ responses });
    } catch (error) {
        console.error('Error in sending newsletter:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
