export interface EmailSendResult {
  success: boolean;
  id?: string;
  error?: string;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Art Qala Gallery <onboarding@resend.dev>';
const SITE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// 1. Send OTP Verification Email during signup
export async function sendOtpEmail(
  to: string,
  code: string,
  recipientName?: string
): Promise<EmailSendResult> {
  const name = recipientName || 'Art Lover';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Your Art Qala Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #FAF4EC; font-family: 'Georgia', serif; color: #281C18;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF4EC; padding: 40px 15px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="580" style="max-width: 580px; background-color: #FDFBF9; border: 1px solid #E7E0D8; border-radius: 4px; padding: 36px 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
                <tr>
                  <td style="border-bottom: 1px solid #EFE8DE; padding-bottom: 20px;">
                    <h1 style="color: #BA4E25; margin: 0; font-size: 26px; letter-spacing: 1px;">Art Qala</h1>
                    <p style="margin: 4px 0 0 0; color: #726861; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Gallery &amp; Studio · Tashkent, Uzbekistan</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 28px;">
                    <h2 style="font-size: 20px; color: #281C18; margin: 0 0 14px 0;">Welcome, ${name}!</h2>
                    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #554740; margin: 0 0 24px 0;">
                      Thank you for creating an account with Art Qala. To verify your email address and activate your collector account, please enter the following 6-digit confirmation code:
                    </p>
                    
                    <div style="background-color: #FAF4EC; border: 1px dashed #BA4E25; border-radius: 4px; padding: 20px; text-align: center; margin: 24px 0;">
                      <span style="font-family: -apple-system, BlinkMacSystemFont, monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #BA4E25;">
                        ${code}
                      </span>
                    </div>

                    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #8F8178; line-height: 1.5; margin: 0;">
                      This verification code will expire in <strong>15 minutes</strong>. If you did not create an account on Art Qala, please ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="border-top: 1px solid #EFE8DE; margin-top: 30px; padding-top: 24px; text-align: center;">
                    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #9E9086; margin: 0;">
                      Art Qala Gallery · Barakhon Madrasah, Tashkent · info@artqala.uz
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendResendEmail({
    to,
    subject: `Art Qala — Your Verification Code: ${code}`,
    html,
  });
}

// 2. Send Curator Reply Notification (TZ 8.11a)
export async function sendCuratorReplyNotification(
  to: string,
  recipientName: string,
  subjectTitle: string,
  replyMessage: string,
  threadUrl: string
): Promise<EmailSendResult> {
  const name = recipientName || 'Valued Collector';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New reply from Art Qala curator</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #FAF4EC; font-family: 'Georgia', serif; color: #281C18;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF4EC; padding: 40px 15px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="580" style="max-width: 580px; background-color: #FDFBF9; border: 1px solid #E7E0D8; border-radius: 4px; padding: 36px 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
                <tr>
                  <td style="border-bottom: 1px solid #EFE8DE; padding-bottom: 20px;">
                    <h1 style="color: #BA4E25; margin: 0; font-size: 26px; letter-spacing: 1px;">Art Qala</h1>
                    <p style="margin: 4px 0 0 0; color: #726861; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Gallery &amp; Studio · Tashkent, Uzbekistan</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 28px;">
                    <h2 style="font-size: 20px; color: #281C18; margin: 0 0 14px 0;">Dear ${name},</h2>
                    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #554740; margin: 0 0 18px 0;">
                      Our gallery curator in Tashkent has replied to your inquiry regarding <strong>"${subjectTitle}"</strong>:
                    </p>
                    
                    <div style="background-color: #FFFFFF; border-left: 4px solid #BA4E25; padding: 18px; margin: 20px 0; border-radius: 2px; font-style: italic; font-size: 14px; color: #281C18; line-height: 1.6;">
                      "${replyMessage}"
                    </div>

                    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #554740; margin: 24px 0;">
                      You can view your complete message thread, continue the conversation, and reserve the artwork directly from your account:
                    </p>

                    <div style="text-align: center; margin: 28px 0;">
                      <a href="${threadUrl}" style="background-color: #BA4E25; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 3px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; display: inline-block;">
                        Open Message Thread &rarr;
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="border-top: 1px solid #EFE8DE; margin-top: 30px; padding-top: 24px; text-align: center;">
                    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #9E9086; margin: 0;">
                      Art Qala Gallery · Barakhon Madrasah, Tashkent · info@artqala.uz
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendResendEmail({
    to,
    subject: `Art Qala Gallery — Curator reply regarding "${subjectTitle}"`,
    html,
  });
}

// Internal Resend API dispatcher
async function sendResendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<EmailSendResult> {
  if (!RESEND_API_KEY) {
    console.warn(
      `[Email Mock - No RESEND_API_KEY configured] Would send email to ${params.to} with subject "${params.subject}"`
    );
    return { success: true, id: 'mock-id' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [params.to],
        subject: params.subject,
        html: params.html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Resend Error]', data);
      return { success: false, error: data.message || 'Resend delivery failed' };
    }

    console.log(`[Resend Email Sent] Successfully sent email to ${params.to}, id: ${data.id}`);
    return { success: true, id: data.id };
  } catch (err: any) {
    console.error('[Resend Exception]', err);
    return { success: false, error: err.message || 'Network error sending email' };
  }
}
