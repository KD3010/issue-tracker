-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "assigneeId" TEXT;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;
