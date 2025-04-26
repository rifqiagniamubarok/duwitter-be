/*
  Warnings:

  - You are about to drop the column `reset_token` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "reset_token",
ADD COLUMN     "remember_token" TEXT;
