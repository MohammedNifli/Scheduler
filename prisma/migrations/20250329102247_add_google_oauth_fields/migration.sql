-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleOAuthToken" TEXT,
ADD COLUMN     "googleRefreshToken" TEXT,
ADD COLUMN     "googleTokenExpiry" TIMESTAMP(3);
