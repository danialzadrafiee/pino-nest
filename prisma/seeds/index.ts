import { PrismaClient } from '@prisma/client';
import { main as seedBusiness } from './business.seed';
import { main as seedUser } from './user.seed';
import { main as seedUserBusiness } from './userBusiness.seed';

const prisma = new PrismaClient();

async function main() {
    await seedUser();
    await seedBusiness();
    await seedUserBusiness();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });