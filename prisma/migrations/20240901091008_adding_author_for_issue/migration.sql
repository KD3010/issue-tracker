/*
  Warnings:

  - Added the required column `author` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "authorId" TEXT NOT NULL;
