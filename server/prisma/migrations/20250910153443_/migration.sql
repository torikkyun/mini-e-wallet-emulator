/*
  Warnings:

  - A unique constraint covering the columns `[account_number]` on the table `service_providers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[account_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account_number` to the `service_providers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_number` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."service_providers" ADD COLUMN     "account_number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "account_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "service_providers_account_number_key" ON "public"."service_providers"("account_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_account_number_key" ON "public"."users"("account_number");
