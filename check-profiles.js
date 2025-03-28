const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const profiles = await prisma.profiles.findMany();
    console.log(JSON.stringify(profiles, null, 2));
  } catch (error) {
    console.error('Error fetching profiles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 