-- AlterTable
ALTER TABLE "Issue" ALTER COLUMN "fixVersion" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "versions" SET DATA TYPE TEXT[];
