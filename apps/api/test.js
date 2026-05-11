const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const group = await prisma.group.findFirst({ include: { members: true } });
  console.log(JSON.stringify(group, null, 2));
}
main().finally(() => prisma.$disconnect());
