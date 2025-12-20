import { PrismaClient } from '@prisma/client'
import { jwtVerify } from 'jose';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { Server } from 'socket.io'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient;
  session: {
    user: {
      id: string;
      email: string | null;
      name: string | null;
      image: string | null;
    };
  } | null;
  io?: Server;
}

// Helper to extract JWT token from request
async function getSessionFromRequest(
  request: FastifyRequest
): Promise<Context['session']> {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.authorization;
    let token: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Try to get from cookie (NextAuth stores JWT in cookies)
      const cookieHeader = request.headers.cookie;
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
        token = cookies['next-auth.session-token'] || cookies['__Secure-next-auth.session-token'];
      }
    }

    if (!token) {
      return null;
    }

    // Decode the JWT token using NextAuth secret
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.warn('NEXTAUTH_SECRET not set');
      return null;
    }

    try {
      const secretKey = new TextEncoder().encode(secret);
      const { payload } = await jwtVerify(token, secretKey);

      if (!payload || !payload.sub) {
        return null;
      }

      // Payload might have email in 'email' or 'sub' might be the user ID
      // NextAuth typically stores user ID in 'sub'
      const userId = payload.sub as string;
      
      // Fetch user from database to get full user info
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      });

      if (!user) {
        return null;
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        },
      };
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// createContext will be called for every request
export const createContext = async (
  req?: FastifyRequest,
  res?: FastifyReply,
  io?: Server,
): Promise<Context> => {
  const session = req ? await getSessionFromRequest(req) : null;

  return {
    prisma,
    session,
    io,
  }
}
