-- CreateTable
CREATE TABLE `Invoices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `customer_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Invoices` ADD CONSTRAINT `Invoices_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoices` ADD CONSTRAINT `Invoices_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
