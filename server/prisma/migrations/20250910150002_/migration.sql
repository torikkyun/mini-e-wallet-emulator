-- AddForeignKey
ALTER TABLE "public"."bill_payments" ADD CONSTRAINT "bill_payments_customer_code_fkey" FOREIGN KEY ("customer_code") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
