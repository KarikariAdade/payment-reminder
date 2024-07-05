/*
  Warnings:

  - You are about to drop the column `taxesId` on the `invoices` table. All the data in the column will be lost.
  - Added the required column `invoice_number` to the `Invoices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `invoices` DROP FOREIGN KEY `Invoices_taxesId_fkey`;

-- AlterTable
ALTER TABLE `invoices` DROP COLUMN `taxesId`,
    ADD COLUMN `amount_paid` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `invoice_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `net_total` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `payment_due` DATETIME(3) NULL,
    ADD COLUMN `payment_status` ENUM('success', 'failed', 'pending') NOT NULL DEFAULT 'pending',
    ADD COLUMN `sub_total` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `tax_total` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `taxes` JSON NULL;

-- CreateTable
CREATE TABLE `InvoiceItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` INTEGER NOT NULL,
    `item_name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL DEFAULT 0.0,
    `quantity` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InvoiceItems` ADD CONSTRAINT `InvoiceItems_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `Invoices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
