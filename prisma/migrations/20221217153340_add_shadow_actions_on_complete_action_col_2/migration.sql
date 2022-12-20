/*
  Warnings:

  - You are about to drop the column `onCompleteAction` on the `ShadowActions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShadowActions" DROP COLUMN "onCompleteAction",
ADD COLUMN     "onCompleteActions" JSONB;
