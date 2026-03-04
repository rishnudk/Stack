import type { PrismaClient } from "@prisma/client";

const HIRE_ME_SELECT = {
    availableForHire: true,
    hourlyRate: true,
    preferredWorkType: true,
    resumeUrl: true,
} as const;

// ──────────────────────────────────────────────
// GET STATUS
// ──────────────────────────────────────────────
export async function getStatus(
    prisma: PrismaClient,
    userId: string
) {
    return prisma.user.findUnique({
        where: { id: userId },
        select: HIRE_ME_SELECT,
    });
}

// ──────────────────────────────────────────────
// UPDATE SETTINGS
// ──────────────────────────────────────────────
export async function updateSettings(
    prisma: PrismaClient,
    userId: string,
    input: {
        availableForHire: boolean;
        hourlyRate?: string;
        preferredWorkType?: string;
        resumeUrl?: string;
    }
) {
    return prisma.user.update({
        where: { id: userId },
        data: {
            availableForHire: input.availableForHire,
            hourlyRate: input.hourlyRate,
            preferredWorkType: input.preferredWorkType,
            resumeUrl: input.resumeUrl,
        },
        select: HIRE_ME_SELECT,
    });
}
