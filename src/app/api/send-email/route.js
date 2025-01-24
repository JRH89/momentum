import sendgrid from "@sendgrid/mail";

// Set your SendGrid API Key
sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY);

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

        // Send the email using SendGrid
        await sendgrid.send({
            to: "momentum.hookerhillstudios@gmail.com", // Replace with your email
            from: process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL, // Replace with your verified sender
            subject: `New Contact Form Submission from ${body.name}`,
            text: body.message,
            html: `
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Message:</strong></p>
        <p>${body.message}</p>
      `,
        });

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
