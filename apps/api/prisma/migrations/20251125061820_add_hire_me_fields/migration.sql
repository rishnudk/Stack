-- AlterTable
ALTER TABLE "User" ADD COLUMN     "availableForHire" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hourlyRate" TEXT,
ADD COLUMN     "preferredWorkType" TEXT,
ADD COLUMN     "resumeUrl" TEXT;
