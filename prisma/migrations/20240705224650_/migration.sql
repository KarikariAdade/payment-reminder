/*
  Warnings:

  - You are about to drop the `invoiceitems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `invoiceitems` DROP FOREIGN KEY `InvoiceItems_invoice_id_fkey`;

-- DropTable
DROP TABLE `invoiceitems`;

-- CreateTable
CREATE TABLE `Invoice_Items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` INTEGER NOT NULL,
    `item_name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL DEFAULT 0.0,
    `quantity` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Invoice_Items` ADD CONSTRAINT `Invoice_Items_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `Invoices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
