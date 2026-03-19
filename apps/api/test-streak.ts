import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const secret = process.env.API_JWT_SECRET;
  console.log('Secret length:', secret?.length, 'prefix:', secret?.substring(0, 8));

  const user = await prisma.user.findFirst({ select: { id: true, email: true } });
  if (!user) { console.log('No users in DB'); return; }
  console.log('User:', user.email, user.id);

  // Generate token - same as auth.ts does
  const token = jwt.sign({ sub: user.id, email: user.email }, secret!, { expiresIn: '30d' });
  console.log('Token length:', token.length);

  // Verify token - same as context.ts does
  const decoded = jwt.verify(token, secret!) as { sub: string };
  console.log('Decoded sub matches:', decoded.sub === user.id);

  // Test streak query
  const streak = await prisma.streak.findUnique({ where: { userId: user.id } });
  console.log('Streak:', streak ?? 'No streak record yet (will be created on first call)');

  await prisma.$disconnect();
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
