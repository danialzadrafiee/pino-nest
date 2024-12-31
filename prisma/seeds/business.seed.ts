import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function main() {
  await prisma.business.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      name: 'Sword',
      description: 'Slice through enemies with a mighty sword',
      initial_cost: 1.5,
      coefficient: 1.05,
      initial_aps: 1,
      initial_tap_reward: 0.5,
      tiers: [
        { requiredLevel: 0, image: '/pixel_icons/sword/sword_02a.png', achievement: { type: 'self', multiplier: 1 } },
        { requiredLevel: 25, image: '/pixel_icons/sword/sword_02a.png', achievement: { type: 'self', multiplier: 1.1 } },
        { requiredLevel: 50, image: '/pixel_icons/sword/sword_02b.png', achievement: { type: 'self', multiplier: 1.5 } },
        { requiredLevel: 100, image: '/pixel_icons/sword/sword_02b.png', achievement: { type: 'self', multiplier: 1.8 } },
        { requiredLevel: 150, image: '/pixel_icons/sword/sword_02c.png', achievement: { type: 'all', multiplier: 1.2 } },
        { requiredLevel: 200, image: '/pixel_icons/sword/sword_02c.png', achievement: { type: 'self', multiplier: 2 } },
        { requiredLevel: 250, image: '/pixel_icons/sword/sword_02d.png', achievement: { type: 'all', multiplier: 1.3 } },
        { requiredLevel: 300, image: '/pixel_icons/sword/sword_02d.png', achievement: { type: 'self', multiplier: 2.2 } },
        { requiredLevel: 350, image: '/pixel_icons/sword/sword_02e.png', achievement: { type: 'self', multiplier: 2.5 } },
        { requiredLevel: 400, image: '/pixel_icons/sword/sword_02e.png', achievement: { type: 'all', multiplier: 1.5 } },
      ],
      requirements: { businesss: [], totalApples: 0 }
    },
    update: {
      name: 'Sword',
      description: 'Slice through enemies with a mighty sword',
      initial_cost: 1.5,
      coefficient: 1.05,
      initial_aps: 1,
      initial_tap_reward: 0.5,
      tiers: [
        { requiredLevel: 0, image: '/pixel_icons/sword/sword_02a.png', achievement: { type: 'self', multiplier: 1 } },
        { requiredLevel: 25, image: '/pixel_icons/sword/sword_02a.png', achievement: { type: 'self', multiplier: 1.1 } },
        { requiredLevel: 50, image: '/pixel_icons/sword/sword_02b.png', achievement: { type: 'self', multiplier: 1.5 } },
        { requiredLevel: 100, image: '/pixel_icons/sword/sword_02b.png', achievement: { type: 'self', multiplier: 1.8 } },
        { requiredLevel: 150, image: '/pixel_icons/sword/sword_02c.png', achievement: { type: 'all', multiplier: 1.2 } },
        { requiredLevel: 200, image: '/pixel_icons/sword/sword_02c.png', achievement: { type: 'self', multiplier: 2 } },
        { requiredLevel: 250, image: '/pixel_icons/sword/sword_02d.png', achievement: { type: 'all', multiplier: 1.3 } },
        { requiredLevel: 300, image: '/pixel_icons/sword/sword_02d.png', achievement: { type: 'self', multiplier: 2.2 } },
        { requiredLevel: 350, image: '/pixel_icons/sword/sword_02e.png', achievement: { type: 'self', multiplier: 2.5 } },
        { requiredLevel: 400, image: '/pixel_icons/sword/sword_02e.png', achievement: { type: 'all', multiplier: 1.5 } },
      ],
      requirements: { businesss: [], totalApples: 0 }
    }
  });

  await prisma.business.upsert({
    where: { id: 2 },
    create: {
      id: 2,
      name: 'Bow',
      description: 'Strike from afar with a powerful bow',
      initial_cost: 10,
      coefficient: 1.07,
      initial_aps: 5,
      initial_tap_reward: 2,
      tiers: [
        { requiredLevel: 0, image: '/pixel_icons/bow/bow_03a.png', achievement: { type: 'self', multiplier: 1 } },
        { requiredLevel: 25, image: '/pixel_icons/bow/bow_03a.png', achievement: { type: 'self', multiplier: 1.5 } },
        { requiredLevel: 50, image: '/pixel_icons/bow/bow_03b.png', achievement: { type: 'all', multiplier: 1.1 } },
        { requiredLevel: 100, image: '/pixel_icons/bow/bow_03b.png', achievement: { type: 'self', multiplier: 1.8 } },
        { requiredLevel: 150, image: '/pixel_icons/bow/bow_03c.png', achievement: { type: 'self', multiplier: 2 } },
        { requiredLevel: 200, image: '/pixel_icons/bow/bow_03c.png', achievement: { type: 'all', multiplier: 1.2 } },
        { requiredLevel: 250, image: '/pixel_icons/bow/bow_03d.png', achievement: { type: 'self', multiplier: 2.2 } },
        { requiredLevel: 300, image: '/pixel_icons/bow/bow_03d.png', achievement: { type: 'all', multiplier: 1.3 } },
        { requiredLevel: 350, image: '/pixel_icons/bow/bow_03e.png', achievement: { type: 'self', multiplier: 2.5 } },
        { requiredLevel: 400, image: '/pixel_icons/bow/bow_03e.png', achievement: { type: 'all', multiplier: 1.5 } },
      ],
      requirements: { businesss: [{ id: 1, level: 10 }], totalApples: 0 }
    },
    update: {
      name: 'Bow',
      description: 'Strike from afar with a powerful bow',
      initial_cost: 10,
      coefficient: 1.07,
      initial_aps: 5,
      initial_tap_reward: 2,
      tiers: [
        { requiredLevel: 0, image: '/pixel_icons/bow/bow_03a.png', achievement: { type: 'self', multiplier: 1 } },
        { requiredLevel: 25, image: '/pixel_icons/bow/bow_03a.png', achievement: { type: 'self', multiplier: 1.5 } },
        { requiredLevel: 50, image: '/pixel_icons/bow/bow_03b.png', achievement: { type: 'all', multiplier: 1.1 } },
        { requiredLevel: 100, image: '/pixel_icons/bow/bow_03b.png', achievement: { type: 'self', multiplier: 1.8 } },
        { requiredLevel: 150, image: '/pixel_icons/bow/bow_03c.png', achievement: { type: 'self', multiplier: 2 } },
        { requiredLevel: 200, image: '/pixel_icons/bow/bow_03c.png', achievement: { type: 'all', multiplier: 1.2 } },
        { requiredLevel: 250, image: '/pixel_icons/bow/bow_03d.png', achievement: { type: 'self', multiplier: 2.2 } },
        { requiredLevel: 300, image: '/pixel_icons/bow/bow_03d.png', achievement: { type: 'all', multiplier: 1.3 } },
        { requiredLevel: 350, image: '/pixel_icons/bow/bow_03e.png', achievement: { type: 'self', multiplier: 2.5 } },
        { requiredLevel: 400, image: '/pixel_icons/bow/bow_03e.png', achievement: { type: 'all', multiplier: 1.5 } },
      ],
      requirements: { businesss: [{ id: 1, level: 10 }], totalApples: 0 }
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });