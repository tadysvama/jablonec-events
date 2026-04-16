import { PrismaClient } from '@prisma/client';
import { MOCK_EVENTS } from '../src/data/events';
import { MOCK_BADGES, CURRENT_USER, MOCK_FRIENDS, MOCK_CHALLENGES } from '../src/data/users';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Postgres…');

  // Vymaž v správném pořadí (nejdřív závislé tabulky)
  await prisma.userReward.deleteMany();
  await prisma.userChallenge.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.eventPhoto.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.checkin.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Hlavní uživatel
  const me = await prisma.user.create({
    data: {
      id: CURRENT_USER.id,
      email: 'tereza@example.com',
      username: CURRENT_USER.username,
      name: CURRENT_USER.name,
      avatarUrl: CURRENT_USER.avatarUrl,
      bio: CURRENT_USER.bio,
      birthYear: CURRENT_USER.birthYear,
      gender: CURRENT_USER.gender,
      city: CURRENT_USER.city,
      interests: JSON.stringify(CURRENT_USER.interests),
      privacyMode: CURRENT_USER.privacyMode,
      totalPoints: CURRENT_USER.totalPoints,
      currentStreak: CURRENT_USER.currentStreak,
      longestStreak: CURRENT_USER.longestStreak,
      streakFreezes: CURRENT_USER.streakFreezes,
      currentLeague: CURRENT_USER.currentLeague,
      leaguePoints: CURRENT_USER.leaguePoints,
    },
  });

  for (const f of MOCK_FRIENDS) {
    const friend = await prisma.user.create({
      data: {
        id: f.id,
        email: `${f.username}@example.com`,
        username: f.username,
        name: f.name,
        avatarUrl: f.avatarUrl,
        interests: '[]',
        totalPoints: f.totalPoints,
        currentStreak: f.currentStreak,
        currentLeague: f.currentLeague,
      },
    });
    await prisma.friendship.create({
      data: { requesterId: me.id, receiverId: friend.id, status: 'accepted' },
    });
  }

  for (const e of MOCK_EVENTS) {
    await prisma.event.create({
      data: {
        id: e.id,
        title: e.title,
        description: e.description,
        category: e.category,
        coverImage: e.coverImage,
        location: e.location,
        address: e.address,
        latitude: e.latitude,
        longitude: e.longitude,
        startsAt: new Date(e.startsAt),
        endsAt: e.endsAt ? new Date(e.endsAt) : null,
        capacity: e.capacity,
        price: e.price,
        basePoints: e.basePoints,
        sizeTier: e.sizeTier,
        externalUrl: e.externalUrl,
      },
    });
  }

  // Ukázkové komentáře – uloží se do DB, aby při spuštění existovaly
  const sampleComments = [
    { eventId: 'evt_001', userId: 'usr_002', content: 'Derby se Slovanem nikdy nezklame. Kdo se přidá ve žluto-modré?' },
    { eventId: 'evt_001', userId: 'usr_003', content: 'Stadion bude narvaný, lístky došly už minulý týden. Těšíme se!' },
    { eventId: 'evt_002', userId: 'usr_006', content: 'Čarodějnice na přehradě jsou každý rok fakt pecka. Vezmu celou rodinu!' },
    { eventId: 'evt_002', userId: 'usr_005', content: 'A přijde někdo v opravdovém kostýmu? Loni jich bylo málo 🧙‍♀️' },
    { eventId: 'evt_004', userId: 'usr_004', content: 'Exnarova tvorba je tam nádherně vybraná. Doporučuji jít po 15:00.' },
    { eventId: 'evt_006', userId: 'usr_005', content: 'Pobavila jsem se tam hrozně. Ty rady ze začátku 20. století jsou poklad 😂' },
    { eventId: 'evt_011', userId: 'usr_002', content: 'Lyžařský bál je vždycky super rozlučka se sezónou. Tombola bývá bohatá.' },
  ];

  for (const c of sampleComments) {
    try {
      await prisma.comment.create({
        data: {
          eventId: c.eventId,
          userId: c.userId,
          content: c.content,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        },
      });
    } catch (err) {
      // Pokračuj pokud event/user neexistuje
    }
  }

  for (const b of MOCK_BADGES) {
    await prisma.badge.create({
      data: {
        id: b.id,
        slug: b.slug,
        name: b.name,
        description: b.description,
        icon: b.icon,
        tier: b.tier,
        category: b.category,
      },
    });
    if (b.earned) {
      await prisma.userBadge.create({
        data: { userId: me.id, badgeId: b.id, earnedAt: new Date(b.earnedAt!) },
      });
    }
  }

  for (const c of MOCK_CHALLENGES) {
    await prisma.challenge.create({
      data: {
        id: c.id,
        title: c.title,
        description: c.description,
        icon: c.icon,
        targetType: c.targetType,
        targetValue: c.targetValue,
        categoryFilter: c.categoryFilter,
        rewardPoints: c.rewardPoints,
        startsAt: new Date(c.startsAt),
        endsAt: new Date(c.endsAt),
      },
    });
    await prisma.userChallenge.create({
      data: {
        userId: me.id,
        challengeId: c.id,
        progress: c.progress,
        completed: c.completed,
        completedAt: c.completed ? new Date() : null,
      },
    });
  }

  console.log('✅ Seed kompletní.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
