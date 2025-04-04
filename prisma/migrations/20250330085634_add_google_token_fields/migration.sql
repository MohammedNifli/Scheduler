/*
  Warnings:

  - You are about to drop the column `googleOAuthToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "googleOAuthToken",
ADD COLUMN     "googleAccessToken" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;
