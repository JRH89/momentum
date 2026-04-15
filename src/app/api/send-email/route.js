import { sendEmail } from '@/lib/mailersend';

export async function POST(req) {
    try {
        const body = await req.json();

        // Validate required fields
        if (!body.name || !body.email || !body.message) {
            return new Response(
                JSON.stringify({ error: "All fields are required." }),
                { status: 400 }
            );
        }

        // Send the email using MailerSend
        const { success, error } = await sendEmail({
            to: process.env.MAILERSEND_API_USER || 'credence@hookerhillstudios.com',
            subject: `New Contact Form Submission from ${body.name}`,
            text: body.message,
            html: `
                <p><strong>Name:</strong> ${body.name}</p>
                <p><strong>Email:</strong> ${body.email}</p>
                <p><strong>Message:</strong></p>
                <p>${body.message}</p>
            `,
            replyTo: {
                email: body.email,
                name: body.name
            }
        });

        if (!success) {
            console.error('Failed to send email:', error);
            throw new Error('Failed to send email');
        }

        return new Response(
            JSON.stringify({ success: "Email sent successfully!" }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in send-email API route:', error);
        return new Response(
            JSON.stringify({ error: "Failed to send email. Please try again later." }),
            { status: 500 }
        );
    }
}
