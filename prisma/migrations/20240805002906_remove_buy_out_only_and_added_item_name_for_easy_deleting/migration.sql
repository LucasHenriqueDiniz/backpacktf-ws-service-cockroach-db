/*
  Warnings:

  - You are about to drop the column `only_buyout` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `item_name` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "only_buyout";
ALTER TABLE "Listing" ADD COLUMN     "item_name" STRING NOT NULL;
