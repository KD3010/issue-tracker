/*
  Warnings:

  - A unique constraint covering the columns `[reprterId]` on the table `Issue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Issue_reprterId_key" ON "Issue"("reprterId");
