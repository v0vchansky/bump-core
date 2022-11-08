/*
  Warnings:

  - A unique constraint covering the columns `[userName]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Users_userName_key" ON "Users"("userName");
