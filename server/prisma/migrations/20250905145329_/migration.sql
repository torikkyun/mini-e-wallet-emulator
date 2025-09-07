-- CreateEnum
CREATE TYPE "public"."BillType" AS ENUM ('electricity', 'water', 'telecom', 'internet', 'tv');

-- CreateEnum
CREATE TYPE "public"."BillStatus" AS ENUM ('pending', 'success', 'failed', 'cancelled');

-- AlterEnum
ALTER TYPE "public"."TransactionType" ADD VALUE 'pay_bill';

-- CreateTable
CREATE TABLE "public"."bill_payments" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "bill_type" "public"."BillType" NOT NULL,
    "provider_id" TEXT NOT NULL,
    "customer_code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT,
    "status" "public"."BillStatus" NOT NULL DEFAULT 'pending',
    "paid_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bill_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."service_providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "bill_types" "public"."BillType"[] DEFAULT ARRAY[]::"public"."BillType"[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_providers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bill_payments_transaction_id_key" ON "public"."bill_payments"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_providers_name_key" ON "public"."service_providers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "service_providers_code_key" ON "public"."service_providers"("code");

-- AddForeignKey
ALTER TABLE "public"."bill_payments" ADD CONSTRAINT "bill_payments_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bill_payments" ADD CONSTRAINT "bill_payments_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
