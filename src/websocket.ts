import { Listing } from "@prisma/client";
import print from "../utils/consolePrinter";
import {
  checkIfItemExistsIfNotCreate,
  createListing,
  deleteListing,
  deleteOldListings,
  countListings,
  bulkDeleteListings,
  bulkCreateListings,
} from "./datasource";

function reformatEvent(payload): any {
  if (!payload) {
    console.error("Payload is empty");
    return {};
  }

  const steamid = payload.steamid;
  const currencies = payload.currencies;

  let listed_at = "";
  let bumped_at = "";
  let trade_offers_preferred = false;
  let id = payload.id;
  let item_name = payload.item.name;

  if (payload.bumpedAt) {
    listed_at = payload.listedAt ?? "";
    bumped_at = payload.bumpedAt ?? "";
    trade_offers_preferred = payload.tradeOffersPreferred;
  } else {
    listed_at = payload.timestamp ?? "";
    bumped_at = payload.bump ?? "";
    trade_offers_preferred = payload.offers ?? false;
  }

  const intent = payload.intent;
  const item = payload.item;
  const user_agent = payload.userAgent ?? {};
  const only_buyout = payload.buyoutOnly ?? false;

  return {
    listing: {
      id,
      steamid,
      currencies,
      trade_offers_preferred,
      listed_at,
      bumped_at,
      intent,
      user_agent,
      only_buyout,
      item_name,
    },
    item: item,
  };
}

async function handleWebSocketMessage(messageJSON) {
  if (!messageJSON) {
    print("Message is empty", "warning");
    return;
  }

  const listingsToDelete = [];
  const listingsToCreate = [];

  await messageJSON.forEach(async (item) => {
    let event = item.event;
    let data = item.payload;

    switch (event) {
      case "listing-update":
        const formatedEvent = reformatEvent(data);

        const listingData = formatedEvent.listing as Listing;
        const itemData = formatedEvent.item;

        if (itemData !== null && listingData !== null) {
          if (
            listingData.id === undefined ||
            (listingData.id === null &&
              listingData.id === "" &&
              listingData.currencies === null &&
              listingData.currencies === undefined)
          ) {
            print(`data is null: ${formatedEvent}`, "warning");
            return;
          }

          const itemId = await checkIfItemExistsIfNotCreate(itemData);
          listingData.item_id = itemId.id;
          listingsToCreate.push(listingData);
        } else {
          print(`data is null: ${formatedEvent}`, "warning");
        }
        break;
      case "listing-delete":
        listingsToDelete.push(data);
        break;
      case "client-limit-exceeded":
        print("Client limit exceeded", "warning");
        console.log(messageJSON);
        break;

      default:
        print(`Unknown event: ${event}`, "warning");
    }
  });
  print(`Finished processing ${messageJSON.length} messages`, "info");

  if (listingsToDelete.length > 0) {
    print(`Deleting ${listingsToDelete.length} listings`, "info");
    await bulkDeleteListings(listingsToDelete);
  }

  if (listingsToCreate.length > 0) {
    print(`Creating ${listingsToCreate.length} listings`, "info");
    listingsToCreate.forEach(async (listing) => {
      await createListing(listing);
    });
  }
}

let isConnected = false;
let reconnectAttempts = 0;
let messageQueue = [];

function connectToWebsocket() {
  const ws = new WebSocket(process.env.WEBSOCKET_URL);
  if (isConnected) return; // Evita múltiplas conexões simultâneas
  isConnected = true;

  ws.onopen = async () => {
    reconnectAttempts = 0;
    isConnected = true;

    print("Connected to websocket", "sucess");

    deleteOldListings();
    let itemsCount = await countListings();
    print(`Total items in database: ${itemsCount}`, "info");
  };

  ws.onmessage = async (message) => {
    const messageJSON = JSON.parse(message.data);
    print("Received message:", "info");
    await handleWebSocketMessage(messageJSON);
  };

  ws.onclose = async () => {
    print("Connection closed", "warning");
    isConnected = false;
    reconnectAttempts++;
    setTimeout(() => connectToWebsocket(), Math.min(2 ** reconnectAttempts * 1000, 60000));
  };

  ws.onerror = (error) => {
    console.error("Error connecting to websocket:", error);
  };
}

export default connectToWebsocket;
