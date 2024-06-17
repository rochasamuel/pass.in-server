import { prisma } from '../src/lib/prisma';

async function seed() {
  await prisma.event.createMany({
    data: [
      {
        id: '2f2ad0c7-18d6-4e70-8811-d1dc90527076',
        title: 'Event React',
        slug: 'evento-react',
        details: 'very good react event',
        maximumAttendees: 100
      },
      {
        id: '4881d0de-b8df-4749-87f3-98e99bb53caa',
        title: 'Event NodeJS',
        slug: 'evento-nodejs',
        details: 'very goo node js event',
      },
      {
        id: 'a4b3e618-c27f-4254-a1b0-a8798ae5f98f',
        title: 'Event GoLang',
        slug: 'evento-go-lang',
        details: 'excellent go lang event',
        maximumAttendees: 2
      },
    ],
  });
}

seed().then(() => {
  console.log('Seed complete!')
  prisma.$disconnect();
});