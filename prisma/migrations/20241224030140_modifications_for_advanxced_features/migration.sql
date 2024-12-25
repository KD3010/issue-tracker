/*
  Warnings:

  - You are about to drop the column `authorId` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `statuses` on the `Issue` table. All the data in the column will be lost.
  - Added the required column `priority` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reprterId` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'CONTRIBUTOR');

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_authorId_fkey";

-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "authorId",
DROP COLUMN "statuses",
ADD COLUMN     "priority" VARCHAR(255) NOT NULL,
ADD COLUMN     "projectId" INTEGER NOT NULL,
ADD COLUMN     "reprterId" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "organizationId" INTEGER,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CONTRIBUTOR';

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "issueId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "issueId" INTEGER NOT NULL,
    "uploaded_byId" INTEGER NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "organizationId" INTEGER,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_reprterId_fkey" FOREIGN KEY ("reprterId") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_uploaded_byId_fkey" FOREIGN KEY ("uploaded_byId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
