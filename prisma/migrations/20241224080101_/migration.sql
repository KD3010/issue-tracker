/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Contributor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Contributor" DROP CONSTRAINT "Contributor_userId_fkey";

-- AlterTable
ALTER TABLE "Contributor" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Contributor_userId_key" ON "Contributor"("userId");

-- AddForeignKey
ALTER TABLE "Contributor" ADD CONSTRAINT "Contributor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
