/*
  Warnings:

  - You are about to drop the column `deviceToken` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "deviceToken",
ADD COLUMN     "deviceTokenFCM" TEXT;
