-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "deployStatus" TEXT DEFAULT 'not_deployed',
ADD COLUMN     "deployUrl" TEXT,
ADD COLUMN     "deployedAt" TIMESTAMP(3),
ADD COLUMN     "lastDeployAt" TIMESTAMP(3),
ADD COLUMN     "railwayProjectId" TEXT;
