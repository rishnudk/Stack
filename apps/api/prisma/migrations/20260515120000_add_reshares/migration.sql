-- CreateTable
CREATE TABLE IF NOT EXISTS "Reshare" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reshare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Reshare_postId_userId_key" ON "Reshare"("postId", "userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Reshare_postId_idx" ON "Reshare"("postId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Reshare_userId_idx" ON "Reshare"("userId");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Reshare_postId_fkey'
    ) THEN
        ALTER TABLE "Reshare" ADD CONSTRAINT "Reshare_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Reshare_userId_fkey'
    ) THEN
        ALTER TABLE "Reshare" ADD CONSTRAINT "Reshare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
