import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/comments/[eventId]
// Vrátí všechny komentáře pro danou akci
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

// POST /api/comments/[eventId]
// Přidá nový komentář
export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = params;
  const body = await req.json();
  const content = typeof body?.content === 'string' ? body.content.trim() : '';
  const userId = body?.userId ?? 'usr_me'; // v reálu z auth session

  if (!content || content.length > 500) {
    return NextResponse.json(
      { error: 'Komentář musí mít 1–500 znaků' },
      { status: 400 }
    );
  }

  try {
    // Ověř, že event existuje
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: 'Akce neexistuje' }, { status: 404 });
    }

    // Zajisti, že uživatel existuje (pro demo účely)
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@demo.local`,
        username: userId === 'usr_me' ? 'tereza_jbc' : userId,
        name: userId === 'usr_me' ? 'Tereza Nováková' : 'Demo User',
        avatarUrl: 'https://i.pravatar.cc/200?img=47',
      },
    });

    const comment = await prisma.comment.create({
      data: { userId, eventId, content },
      include: {
        user: {
          select: { id: true, name: true, username: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('POST comment error:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se uložit komentář' },
      { status: 500 }
    );
  }
}
