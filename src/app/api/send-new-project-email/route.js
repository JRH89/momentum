import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

export async function POST(req) {
    try {
        const body = await req.json();

        // Validate required fields
        if (!body.customerName || !body.customerEmail || !body.projectName || !body.projectLink) {
            return new Response(
                JSON.stringify({ error: "All fields are required: customerName, customerEmail, projectName, projectLink." }),
                { status: 400 }
            );
        }

        // Send the email using MailerSend
        const sentFrom = new Sender(process.env.MAILERSEND_API_USER, "Momentum");
        const recipients = [new Recipient(body.customerEmail, body.customerName)];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject(`A New Project Has Been Created for You: ${body.projectName}`)
            .setText(`
Hi,

${body.customerName} has created a new project, "${body.projectName}", for you.

You can visit the project dashboard at the link below to:
- Check progress
- Pay invoices
- Upload files
- Chat with the team

Project Dashboard: ${body.projectLink}

If you have any questions, feel free to contact us.

Best regards,
Your Team
            `)
            .setHtml(`
                <p>Hi,</p>
                <p><strong>${body.customerName}</strong> has created a new project, <strong>${body.projectName}</strong>, for you.</p>
                <p>You can visit the project dashboard at the link below to:</p>
                <ul>
                    <li>Check progress</li>
                    <li>Pay invoices</li>
                    <li>Upload files</li>
                    <li>Chat with the team</li>
                </ul>
                <p><a href="${body.projectLink}" style="color: blue; text-decoration: underline;">Click here to view your project dashboard</a></p>
                <p>If you have any questions, feel free to contact us.</p>
                <p>Best regards,<br>Momentum</p>
            `);

        await mailerSend.email.send(emailParams);

        return new Response(
            JSON.stringify({ success: "Email sent successfully!" }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: "Failed to send email." }),
            { status: 500 }
        );
    }
}
