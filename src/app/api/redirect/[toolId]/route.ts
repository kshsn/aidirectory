import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

const BOT_UA_PATTERNS = [
  /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i, /baiduspider/i,
  /yandexbot/i, /sogou/i, /exabot/i, /facebot/i, /ia_archiver/i,
  /semrushbot/i, /ahrefsbot/i, /mj12bot/i, /dotbot/i,
];

function isBot(userAgent: string): boolean {
  return BOT_UA_PATTERNS.some((p) => p.test(userAgent));
}

function appendUtm(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'aidirectory');
    u.searchParams.set('utm_medium', 'affiliate');
    u.searchParams.set('utm_campaign', 'tools');
    return u.toString();
  } catch {
    return url;
  }
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip + (process.env.NEXTAUTH_SECRET || 'salt')).digest('hex');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ toolId: string }> }
) {
  const { toolId } = await params;
  const locale = request.nextUrl.searchParams.get('locale') || 'en';

  const tool = await prisma.tool.findFirst({
    where: { id: toolId, isPublished: true, isDeleted: false },
    select: { id: true, websiteUrl: true, affiliateUrl: true },
  });

  if (!tool) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
  }

  const destination = appendUtm(tool.affiliateUrl || tool.websiteUrl);
  const ua = request.headers.get('user-agent') || '';

  if (!isBot(ua)) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') || 'unknown';

    prisma.affiliateClick.create({
      data: {
        toolId: tool.id,
        locale,
        referrer: request.headers.get('referer')?.slice(0, 500) || null,
        userAgent: ua.slice(0, 500),
        hashedIp: hashIp(ip),
      },
    }).catch(() => {});

    prisma.tool.update({
      where: { id: tool.id },
      data: { clickCount: { increment: 1 } },
    }).catch(() => {});
  }

  return NextResponse.redirect(destination, { status: 302 });
}
