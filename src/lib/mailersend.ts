import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || '',
});

const sentFrom = new Sender(
  process.env.MAILERSEND_API_USER || 'noreply@yourdomain.com',
  'Momentum'
);

export async function sendEmail({
  to,
  subject,
  text,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: { email: string; name: string };
}) {
  try {
    const recipients = Array.isArray(to)
      ? to.map(email => new Recipient(email))
      : [new Recipient(to)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject);

    if (text) emailParams.setText(text);
    if (html) emailParams.setHtml(html);
    if (replyTo) {
      emailParams.setReplyTo(new Sender(replyTo.email, replyTo.name));
    }

    const response = await mailerSend.email.send(emailParams);
    return { success: true, data: response };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
