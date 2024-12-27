-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_created_byId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "created_byId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_created_byId_fkey" FOREIGN KEY ("created_byId") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
