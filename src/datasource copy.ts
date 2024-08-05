import { Item, Listing, Prisma, PrismaClient } from "@prisma/client";
import print from "../utils/consolePrinter";

declare global {
  var prisma: PrismaClient; // This must be a `var` and not a `let / const`
}

if (global.prisma) {
  throw new Error("Prisma client already initialized");
} else {
  global.prisma = new PrismaClient();
}

class PrismaDatabase {
  private prisma: PrismaClient;

  static async initialize() {
    print("Prisma client initialized", "info");
    // await prisma.$connect();
    print("Prisma client connected", "info");
  }

  static async close() {
    await prisma.$disconnect();
  }

  static async createListing(listing: Listing, item_id: bigint) {
    try {
      return prisma.listing.create({
        data: {
          steamid: listing.steamid ?? "null",
          currencies: listing.currencies,
          trade_offers_preferred: listing.trade_offers_preferred ?? false,
          buy_out_only: listing.buy_out_only ?? false,
          listed_at: listing.listed_at ?? -1,
          bumped_at: listing.bumped_at ?? -1,
          intent: listing.intent,
          user_agent: listing.user_agent ?? {},
          only_buyout: listing.only_buyout ?? false,
          item_id: item_id,
        },
      });
    } catch (error) {
      print("Error creating listing:", "error");
    }
  }

  static async deleteListing(itemName: string, intent: string, steamid: string) {
    return prisma.listing.deleteMany({
      where: {
        item: {
          name: itemName,
        },
        intent: intent,
        steamid: steamid,
      },
    });
  }

  static async checkIfItemExistsIfNotCreate(itemName: string) {
    const item = await prisma.item.findFirst({
      where: {
        name: itemName,
      },
    });

    if (item === null) {
      return prisma.item.create({
        data: {
          name: itemName,
        },
      });
    }

    return item;
  }

  static async updateListing(
    itemName: string,
    intent: string,
    steamid: string,
    listingData: Listing
  ) {
    return prisma.listing.updateMany({
      where: {
        item: {
          name: itemName,
        },
        intent: intent,
        steamid: steamid,
      },
      data: listingData,
    });
  }

  static async deleteOldListings() {
    const oneHourAgo = Date.now() - 9000000; // 3600000 ms = 1 hour

    try {
      const result = await prisma.listing.deleteMany({
        where: {
          listed_at: {
            lt: oneHourAgo,
          },
        },
      });

      console.log(`Deleted ${result.count} old listings`);
    } catch (error) {
      console.error("Error deleting old listings:", error);
    }
  }

  static async countListings() {
    return prisma.listing.count();
  }

  static async listingFindFirst(itemName: string, intent: string, steamid: string) {
    return prisma.listing.findFirst({
      where: {
        item: {
          name: itemName,
        },
        intent: intent,
        steamid: steamid,
      },
    });
  }

  static async returnAllItems() {
    return prisma.item.findMany();
  }
}

export { PrismaDatabase };
