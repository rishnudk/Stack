import { PrismaClient } from "@prisma/client";
import type { FastifyRequest, FastifyReply } from "fastify";
import { jwtDecrypt } from "jose";
import { Server } from "socket.io";
import { getIO } from "./socket.ts";

// ... existing code ...


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

    console.log("🔐 [AUTH] Headers:", JSON.stringify(request.headers));

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
      console.log("🔐 [AUTH] Found Bearer token");
    } else {
      const cookieHeader = request.headers.cookie;
      if (cookieHeader) {
        const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);

        console.log("🔐 [AUTH] Cookies received:", Object.keys(cookies));

        token =
          cookies["next-auth.session-token"] ||
          cookies["__Secure-next-auth.session-token"];

        if (token) console.log("🔐 [AUTH] Found session token in cookies");
        else console.log("🔐 [AUTH] NO session token found in cookies");
      } else {
        console.log("🔐 [AUTH] No cookie header found");
      }
    }

    if (!token) {
      console.log("🔐 [AUTH] No token found in request");
      return null;
    }

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error("❌ [AUTH] FATAL: NEXTAUTH_SECRET is missing in env!");
      return null;
    }

    const { payload } = await jwtDecrypt(
      token,
      new TextEncoder().encode(secret)
    );

    if (!payload?.sub) {
      console.log("🔐 [AUTH] Token decrypted but no 'sub' in payload");
      return null;
    }

    console.log("🔐 [AUTH] Token decrypted for user:", payload.sub);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      select: { id: true, email: true, name: true, image: true },
    });

    if (!user) {
      console.log("🔐 [AUTH] User not found in DB");
      return null;
    }

    return { user };
  } catch (err) {
    console.error("❌ [AUTH] Verification error:", err);
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
