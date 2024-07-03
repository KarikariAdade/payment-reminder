/*
  Warnings:

  - The required column `token` was added to the `Password_Resets` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `password_resets` ADD COLUMN `token` VARCHAR(191) NOT NULL;
