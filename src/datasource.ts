import { Listing } from "@prisma/client";
import print from "../utils/consolePrinter";
import { prisma } from "./PrismaClient ";

// async function createListing(listing: Listing, item_id: bigint) {
//   try {
//     const createdListing = await prisma.listing.create({
//       data: {
//         steamid: listing.steamid ?? "null",
//         currencies: listing.currencies,
//         trade_offers_preferred: listing.trade_offers_preferred ?? false,
//         buy_out_only: listing.buy_out_only ?? false,
//         listed_at: listing.listed_at ?? -1,
//         bumped_at: listing.bumped_at ?? -1,
//         intent: listing.intent,
//         user_agent: listing.user_agent ?? {},
//         item_id: BigInt(item_id),
//         item_name: listing.item_name,
//       },
//     });
//     return createdListing;
//   } catch (error) {
//     print("Error creating listing:", "error");
//   }
// }

async function createListing(listing: Listing, item_id?: bigint) {
  try {
    await prisma.listing.upsert({
      where: {
        id: listing.id,
      },
      update: {
        currencies: listing.currencies,
        trade_offers_preferred: listing.trade_offers_preferred ?? false,
        only_buyout: listing.only_buyout ?? false,
        listed_at: listing.listed_at ?? -1,
        bumped_at: listing.bumped_at ?? -1,
        user_agent: listing.user_agent ?? {},
      },
      create: {
        id: listing.id,
        steamid: listing.steamid ?? "null",
        currencies: listing.currencies,
        trade_offers_preferred: listing.trade_offers_preferred ?? false,
        only_buyout: listing.only_buyout ?? false,
        listed_at: listing.listed_at ?? -1,
        bumped_at: listing.bumped_at ?? -1,
        intent: listing.intent,
        user_agent: listing.user_agent ?? {},
        item_name: listing.item_name,
        item_id: item_id ?? listing.item_id,
      },
    });
  } catch (error) {
    print("Error creating listing:", "error");
  }
}

async function bulkCreateListings(listings: Listing[]) {
  try {
    //delete all the existing listings from the argument because prisma dont have upsertMany
    await prisma.listing
      .deleteMany({
        where: {
          id: {
            in: listings.map((listing) => listing.id),
          },
        },
      })
      .then(async () => {
        function checkIfExistsRepeatedIds(listings: Listing[]) {
          const seen = new Set();
          const hasDuplicates = listings.some((currentObject) => {
            return seen.size === seen.add(currentObject.id).size;
          });

          return hasDuplicates;
        }

        console.log("Checking for repeated ids in the listings array");
        const test = checkIfExistsRepeatedIds(listings);
        if (test) {
          console.log(test);
          throw new Error("There are repeated ids in the listings array");
        }

        await prisma.listing.createMany({
          data: listings,
        });
      });
  } catch (error) {
    print(`Error creating listings: ${error}`, "error");
  }
}

async function bulkDeleteListings(listings: Listing[]) {
  try {
    const result = await prisma.listing.deleteMany({
      where: {
        AND: listings.map((listing) => {
          return {
            item_name: listing.item_name,
            intent: listing.intent,
            steamid: listing.steamid,
          };
        }),
      },
    });
  } catch (error) {
    print("Error deleting listings:", "error");
  }
}

async function deleteListing(itemName: string, intent: string, userAgent: string) {
  await prisma.listing.deleteMany({
    where: {
      item: {
        name: itemName,
      },
      intent: intent,
      user_agent: {
        equals: { client: userAgent },
      },
    },
  });
  print(`Deleted listings for ${itemName} with steamid ${userAgent}`, "info");
}

async function checkIfItemExistsIfNotCreate(formatedItem: { name: string; prices: string }) {
  const itemName = formatedItem.name;
  const itemPrices = formatedItem.prices ?? {};

  const item = await prisma.item.upsert({
    where: {
      name: itemName,
    },
    update: {
      prices: itemPrices,
    },
    create: {
      name: itemName,
      prices: itemPrices,
    },
  });

  return item;
}

async function deleteOldListings() {
  const oneHourAgo = Date.now() - 9000000; // 3600000 ms = 1 hour

  try {
    const result = await prisma.listing.deleteMany({
      where: {
        listed_at: {
          lt: oneHourAgo,
        },
      },
    });

    print(`Deleted ${result.count} old listings`, "info");
  } catch (error) {
    print("Error deleting old listings", "error");
  }
}

async function countListings() {
  const count = await prisma.listing.count();
  return count;
}

export {
  createListing,
  deleteListing,
  checkIfItemExistsIfNotCreate,
  deleteOldListings,
  countListings,
  bulkCreateListings,
  bulkDeleteListings,
};
