/*
  Warnings:

  - Added the required column `type` to the `UsersRelations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsersRelations" ADD COLUMN     "type" TEXT NOT NULL;
