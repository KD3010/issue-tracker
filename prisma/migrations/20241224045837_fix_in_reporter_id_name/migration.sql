/*
  Warnings:

  - You are about to drop the column `reprterId` on the `Issue` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reporterId]` on the table `Issue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reporterId` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_reprterId_fkey";

-- DropIndex
DROP INDEX "Issue_reprterId_key";

-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "reprterId",
ADD COLUMN     "reporterId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Issue_reporterId_key" ON "Issue"("reporterId");

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
