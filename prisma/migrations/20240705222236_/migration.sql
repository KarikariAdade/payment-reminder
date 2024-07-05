-- AlterTable
ALTER TABLE `invoices` ADD COLUMN `discount_amount` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `discount_total` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `discount_type` ENUM('Fixed', 'Percentage') NULL,
    ADD COLUMN `taxesId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Taxes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('Fixed', 'Percentage') NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0.0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Invoices` ADD CONSTRAINT `Invoices_taxesId_fkey` FOREIGN KEY (`taxesId`) REFERENCES `Taxes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
