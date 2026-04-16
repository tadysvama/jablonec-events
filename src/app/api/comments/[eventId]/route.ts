import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = params;

  try {
    const comments = await prisma.comment.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, username: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('GET comments error:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se načíst komentáře' },
      { status: 500 }
    );
  }
}

/**
 * POST přijímá:
 *  - content: text komentáře
 *  - user: { id, name, username } – data z localStorage onboardingu
 * API zajistí, že uživatel v DB existuje (upsert), pak uloží komentář.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = params;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Neplatný JSON' }, { status: 400 });
  }

  const content = typeof body?.content === 'string' ? body.content.trim() : '';
  const user = body?.user;

  if (!content || content.length > 500) {
    return NextResponse.json(
      { error: 'Komentář musí mít 1–500 znaků' },
      { status: 400 }
    );
  }

  if (!user?.id || !user?.name || !user?.username) {
    return NextResponse.json(
      { error: 'Chybí informace o uživateli' },
      { status: 400 }
    );
  }

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: 'Akce neexistuje' }, { status: 404 });
    }

    // Upsert uživatele – použijeme ID ze zařízení jako unikátní klíč
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        username: user.username,
      },
      create: {
        id: user.id,
        email: `${user.id}@local.jbc`,
        username: user.username,
        name: user.name,
        avatarUrl: null,
        interests: '[]',
      },
    });

    const comment = await prisma.comment.create({
      data: { userId: user.id, eventId, content },
      include: {
        user: {
          select: { id: true, name: true, username: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error: any) {
    console.error('POST comment error:', error);
    // Unique constraint na username může kolidovat mezi zařízeními
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Uživatelské jméno už někdo používá. Zkus jiné v profilu.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Nepodařilo se uložit komentář' },
      { status: 500 }
    );
  }
}
