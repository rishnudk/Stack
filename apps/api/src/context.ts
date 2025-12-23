import { PrismaClient } from "@prisma/client";
import type { FastifyRequest, FastifyReply } from "fastify";
import { Server } from "socket.io";
import { getIO } from "./socket.ts";
import jwt from "jsonwebtoken";



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

    if (!authHeader?.startsWith("Bearer ")) {
      console.log("🔐 [AUTH] No Bearer token found in Authorization header");
      return null;
    }

    const token = authHeader.substring(7);
    console.log("🔐 [AUTH] Bearer token found, verifying...");

    const decoded = jwt.verify(
      token,
      process.env.API_JWT_SECRET!
    ) as { sub: string };

    console.log("🔐 [AUTH] Token verified for sub:", decoded.sub);

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });

    if (!user) {
      console.log("🔐 [AUTH] User not found in DB for sub:", decoded.sub);
      return null;
    }

    console.log("🔐 [AUTH] Session established for user:", user.email);
    return { user };
  } catch (err) {
    console.error("❌ [AUTH] Invalid API token or verification error:", err);
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
  console.log("🛠️ [CONTEXT] createContext function execution started");
  const session = req ? await getSessionFromRequest(req) : null;

  const io = getIO(); // 🔥 ALWAYS RETURNS THE SAME SOCKET

  console.log("✅ [CONTEXT] io from getIO:", !!io);
  const debugCtx = {
    prisma,
    session,
    io,
    check: "created",
  };
  console.log("✅ [CONTEXT] returning ctx keys:", Object.keys(debugCtx));
  return debugCtx;
};
