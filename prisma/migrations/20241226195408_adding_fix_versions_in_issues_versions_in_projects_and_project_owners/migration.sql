/*
  Warnings:

  - Added the required column `fixVersion` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_byId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "fixVersion" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "created_byId" INTEGER NOT NULL,
ADD COLUMN     "versions" DOUBLE PRECISION[];

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_created_byId_fkey" FOREIGN KEY ("created_byId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
