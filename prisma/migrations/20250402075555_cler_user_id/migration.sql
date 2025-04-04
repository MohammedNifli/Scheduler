/*
  Warnings:

  - You are about to drop the column `clerkUsrId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_clerkUsrId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clerkUsrId";
