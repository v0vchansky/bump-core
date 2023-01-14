/*
  Warnings:

  - You are about to drop the column `phone` on the `Verifications` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userUuid]` on the table `Verifications` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userUuid` to the `Verifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Verifications_phone_key";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "email" TEXT,
ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Verifications" DROP COLUMN "phone",
ADD COLUMN     "userUuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Verifications_userUuid_key" ON "Verifications"("userUuid");

-- AddForeignKey
ALTER TABLE "Verifications" ADD CONSTRAINT "Verifications_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "Users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
