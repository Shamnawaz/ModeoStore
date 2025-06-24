import { PrismaClient } from '@prisma/client';
import sampleData from "./sample-data";
import { hash } from 'argon2';

async function main() {
    const prisma = new PrismaClient();
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();

    await prisma.product.createMany({
        data: sampleData.products
    });

    const userWithHashedPasswords = await Promise.all(
        sampleData.users.map(async (user) => ({
            ...user,
            password: await hash(user.password)
        }))
    );

    await prisma.user.createMany({
        data: userWithHashedPasswords
    });

    console.log('Database filled successfully');
}

main();