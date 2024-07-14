-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('Fixed', 'Percentage');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('success', 'failed', 'pending');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Password_Resets" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "otp" TEXT NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "expiration" TIMESTAMP(3),
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Password_Resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Taxes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DiscountType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoices" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "customer_id" INTEGER,
    "discount_type" "DiscountType",
    "discount_amount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "discount_total" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "taxes" JSONB,
    "tax_total" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "invoice_number" TEXT NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "amount_paid" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "sub_total" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "net_total" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "payment_due" TIMESTAMP(6),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice_Items" (
    "id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "item_name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_Items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "reference" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_email_key" ON "Customers"("email");

-- AddForeignKey
ALTER TABLE "Password_Resets" ADD CONSTRAINT "Password_Resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customers" ADD CONSTRAINT "Customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Taxes" ADD CONSTRAINT "Taxes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice_Items" ADD CONSTRAINT "Invoice_Items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "Invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "Invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
