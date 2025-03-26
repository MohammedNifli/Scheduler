/*
  Warnings:

  - Changed the type of `day` on the `DayAvailability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DayAvailability" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "day",
ADD COLUMN     "day" TEXT NOT NULL;
