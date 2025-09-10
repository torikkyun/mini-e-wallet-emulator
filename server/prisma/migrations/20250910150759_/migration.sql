-- DropForeignKey
ALTER TABLE "public"."bill_payments" DROP CONSTRAINT "bill_payments_transaction_id_fkey";

-- AlterTable
ALTER TABLE "public"."bill_payments" ALTER COLUMN "transaction_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."bill_payments" ADD CONSTRAINT "bill_payments_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
