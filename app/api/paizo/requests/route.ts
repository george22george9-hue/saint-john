import { NextResponse } from 'next/server';

// POST /api/paizo/requests - Deprecated (PAIZO requests now go directly to WhatsApp)
export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'طلبات PAIZO تُرسل الآن مباشرة عبر الواتساب بدون تخزين في قاعدة البيانات.',
    whatsappUrl: 'https://wa.me/201202074649',
  });
}

// GET /api/paizo/requests - Deprecated
export async function GET() {
  return NextResponse.json([], { status: 200 });
}
