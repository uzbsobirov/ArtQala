import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { requireAdmin } from '@/lib/auth';
import { checkRateLimit, recordFailedAttempt } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const LANG_NAMES: Record<string, string> = {
  uz: 'Uzbek (Latin script)',
  ru: 'Russian',
  en: 'English',
};

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: 'GEMINI_API_KEY is not configured on the server.' },
      { status: 500 }
    );
  }

  const rateLimitKey = `translate:${auth.user.id}`;
  const rateCheck = await checkRateLimit(rateLimitKey, 60, 15 * 60 * 1000);
  if (!rateCheck.allowed) {
    const minutesLeft = Math.ceil(rateCheck.retryAfterSeconds / 60);
    return NextResponse.json(
      { success: false, error: `Juda ko'p so'rov. ${minutesLeft} daqiqadan so'ng qayta urinib ko'ring.` },
      { status: 429 }
    );
  }
  await recordFailedAttempt(rateLimitKey);

  try {
    const body = await request.json();
    const { text, sourceLang } = body as { text?: string; sourceLang?: string };

    if (!text || !text.trim() || !sourceLang || !LANG_NAMES[sourceLang]) {
      return NextResponse.json({ success: false, error: 'text and a valid sourceLang are required' }, { status: 400 });
    }

    const targetLangs = (['uz', 'ru', 'en'] as const).filter((l) => l !== sourceLang);

    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_TEXT_MODEL || 'gemini-3.6-flash';

    const prompt =
      `Translate the following art-gallery text from ${LANG_NAMES[sourceLang]} into ${targetLangs.map((l) => LANG_NAMES[l]).join(' and ')}. ` +
      `Keep the tone natural and gallery-appropriate, do not add commentary. ` +
      `Respond with ONLY a compact JSON object with keys ${targetLangs.map((l) => `"${l}"`).join(', ')}, no markdown, no code fences.\n\n` +
      `Text: ${text.trim()}`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const rawText = response.text || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ success: false, error: 'Translation model returned an unexpected format' }, { status: 502 });
    }

    let parsed: Record<string, string>;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json({ success: false, error: 'Failed to parse translation result' }, { status: 502 });
    }

    const translations: Record<string, string> = {};
    for (const lang of targetLangs) {
      if (typeof parsed[lang] === 'string') translations[lang] = parsed[lang];
    }

    return NextResponse.json({ success: true, translations });
  } catch (error) {
    console.error('Translation error:', error);
    const message = error instanceof Error ? error.message : 'Translation failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
