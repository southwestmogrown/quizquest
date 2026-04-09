-- CreateTable
CREATE TABLE "CoachLog" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonSlug" TEXT NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "userMessage" TEXT NOT NULL,
    "coachResponse" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoachLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CoachLog_userId_idx" ON "CoachLog"("userId");

-- CreateIndex
CREATE INDEX "CoachLog_lessonSlug_idx" ON "CoachLog"("lessonSlug");

-- CreateIndex
CREATE INDEX "CoachLog_sessionId_idx" ON "CoachLog"("sessionId");
