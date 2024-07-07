/*
  Warnings:

  - Added the required column `user_id` to the `Taxes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoices` MODIFY `payment_due` TIMESTAMP(6) NULL;

-- AlterTable
ALTER TABLE `taxes` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Taxes` ADD CONSTRAINT `Taxes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
