/*
  Warnings:

  - You are about to drop the column `reset_token_expiry` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "reset_token_expiry",
ADD COLUMN     "current_token" TEXT;
