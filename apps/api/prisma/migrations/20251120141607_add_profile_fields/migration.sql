-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "githubUsername" TEXT,
ADD COLUMN     "leetcodeUsername" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "socialLinks" JSONB;
