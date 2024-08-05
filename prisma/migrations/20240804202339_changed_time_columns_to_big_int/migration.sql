-- CreateTable
CREATE TABLE "Item" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" STRING NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "steamid" STRING NOT NULL,
    "currencies" JSONB NOT NULL,
    "trade_offers_preferred" BOOL NOT NULL,
    "buy_out_only" BOOL NOT NULL,
    "listed_at" INT8 NOT NULL,
    "bumped_at" INT8 NOT NULL,
    "intent" STRING NOT NULL,
    "user_agent" JSONB NOT NULL,
    "only_buyout" BOOL NOT NULL,
    "item_id" INT8 NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
