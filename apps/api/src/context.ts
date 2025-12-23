import { PrismaClient } from "@prisma/client";
import type { FastifyRequest, FastifyReply } from "fastify";
import { jwtVerify } from "jose";
import { Server } from "socket.io";
import { getIO } from "./socket.ts";

const prisma = new PrismaClient();

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
  io: Server; // ❗ NOT optional
}

// -----------------------------
// SESSION EXTRACTION
// -----------------------------
async function getSessionFromRequest(
  request: FastifyRequest
): Promise<Context["session"]> {
  try {
    const authHeader = request.headers.authorization;
    let token: string | undefined;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      const cookieHeader = request.headers.cookie;
      if (cookieHeader) {
        const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);

        token =
          cookies["next-auth.session-token"] ||
          cookies["__Secure-next-auth.session-token"];
      }
    }

    if (!token) return null;

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) return null;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    if (!payload?.sub) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      select: { id: true, email: true, name: true, image: true },
    });

    if (!user) return null;

    return { user };
  } catch {
    return null;
  }
}

// -----------------------------
// CONTEXT (THIS IS THE KEY FIX)
// -----------------------------
export const createContext = async (
  req?: FastifyRequest,
  _res?: FastifyReply
): Promise<Context> => {
  const session = req ? await getSessionFromRequest(req) : null;

  const io = getIO(); // 🔥 ALWAYS RETURNS THE SAME SOCKET

  console.log("✅ [CONTEXT] io attached:", !!io);

  return {
    prisma,
    session,
    io,
  };
};
