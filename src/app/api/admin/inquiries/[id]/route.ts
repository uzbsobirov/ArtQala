import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('artqala_user')?.value;

    if (!userCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const existingInquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        painting: true,
        user: true,
      },
    });

    if (!existingInquiry) {
      return NextResponse.json({ success: false, error: 'Inquiry not found' }, { status: 404 });
    }

    // Auto-link user_id if missing
    let effectiveUserId = existingInquiry.user_id;
    if (!effectiveUserId && existingInquiry.guest_email) {
      const u = await prisma.user.findUnique({
        where: { email: existingInquiry.guest_email.toLowerCase() },
      });
      if (u) effectiveUserId = u.id;
    }

    const newStatus = body.status || (body.admin_reply ? 'ANSWERED' : existingInquiry.status);

    const updated = await prisma.inquiry.update({
      where: { id },
      data: {
        status: newStatus,
        admin_reply: body.admin_reply !== undefined ? body.admin_reply : existingInquiry.admin_reply,
        user_id: effectiveUserId,
      },
      include: {
        painting: true,
      },
    });

    // Send email notification to customer if admin provided a reply
    if (body.admin_reply && existingInquiry.guest_email) {
      const recipientEmail = existingInquiry.guest_email;
      const recipientName = existingInquiry.guest_name || 'Valued Customer';
      const paintingTitle = existingInquiry.painting?.title_en || 'Artwork';

      const emailHtml = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E7E0D8; background-color: #FAF4EC; color: #281C18;">
          <h2 style="color: #BA4E25; margin-bottom: 8px;">Art Qala Gallery</h2>
          <p style="font-size: 12px; color: #726861; text-transform: uppercase; letter-spacing: 2px; margin-top: 0;">Samarkand, Uzbekistan</p>
          <hr style="border: 0; border-top: 1px solid #E7E0D8; margin: 20px 0;" />
          <p style="font-size: 15px;">Dear ${recipientName},</p>
          <p style="font-size: 14px; line-height: 1.6; color: #554740;">
            Thank you for reaching out regarding <strong>"${paintingTitle}"</strong>. Our curator has reviewed your message and replied:
          </p>
          <div style="background-color: #FFFFFF; border-left: 4px solid #BA4E25; padding: 16px; margin: 20px 0; font-style: italic; font-size: 14px; color: #281C18;">
            "${body.admin_reply}"
          </div>
          <p style="font-size: 13px; color: #726861;">
            You can view this inquiry and track its status anytime in your personal account at <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/account" style="color: #BA4E25;">Art Qala Account</a>.
          </p>
          <hr style="border: 0; border-top: 1px solid #E7E0D8; margin: 20px 0;" />
          <p style="font-size: 12px; color: #8F8178; margin-bottom: 0;">
            Art Qala Gallery · 4 Registan Street, Samarkand · Tel: +998 66 233 44 55
          </p>
        </div>
      `;

      if (process.env.RESEND_API_KEY) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: 'Art Qala Gallery <onboarding@resend.dev>',
              to: [recipientEmail],
              subject: `Art Qala Gallery — Reply regarding "${paintingTitle}"`,
              html: emailHtml,
            }),
          });
          console.log(`[Resend] Reply email dispatched to ${recipientEmail}`);
        } catch (mailErr) {
          console.error('[Resend Error]', mailErr);
        }
      } else {
        console.log(`[Resend Mock - No RESEND_API_KEY configured] Reply notification simulated for ${recipientEmail}: "${body.admin_reply}"`);
      }
    }

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error('Update inquiry error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update inquiry' }, { status: 500 });
  }
}
