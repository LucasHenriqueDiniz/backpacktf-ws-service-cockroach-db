/*
  Warnings:

  - You are about to drop the column `buy_out_only` on the `Listing` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Listing` table. The data in that column will be cast from `BigInt` to `String`. This cast may fail. Please make sure the data in the column can be cast.
  - Added the required column `only_buyout` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
CREATE TABLE "_prisma_new_Listing" (
    "id" STRING NOT NULL,
    "steamid" STRING NOT NULL,
    "currencies" JSONB NOT NULL,
    "trade_offers_preferred" BOOL NOT NULL,
    "only_buyout" BOOL NOT NULL,
    "listed_at" INT8 NOT NULL,
    "bumped_at" INT8 NOT NULL,
    "intent" STRING NOT NULL,
    "user_agent" JSONB NOT NULL,
    "item_name" STRING NOT NULL,
    "item_id" INT8 NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);
INSERT INTO "_prisma_new_Listing" ("bumped_at","currencies","id","intent","item_id","item_name","listed_at","steamid","trade_offers_preferred","user_agent") SELECT "bumped_at","currencies","id","intent","item_id","item_name","listed_at","steamid","trade_offers_preferred","user_agent" FROM "Listing";
DROP TABLE "Listing" CASCADE;
ALTER TABLE "_prisma_new_Listing" RENAME TO "Listing";
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
