import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  // Create test groups
  const group1 = await prisma.group.create({
    data: {
      name: "React Developers",
      description: "A community for React.js enthusiasts",
      privacy: "PUBLIC",
      image: "https://github.com/facebook.png",
    },
  });
  const group2 = await prisma.group.create({
    data: {
      name: "Startup Founders",
      description: "Connect with other founders",
      privacy: "PUBLIC",
      image: "https://github.com/ycombinator.png",
    },
  });
  console.log("✅ Created groups:", group1.name, group2.name);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });