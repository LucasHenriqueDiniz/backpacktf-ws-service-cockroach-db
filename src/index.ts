import print from "../utils/consolePrinter";
import connectToWebsocket from "./websocket";

async function main() {
  print("Starting main", "info");
  try {
    connectToWebsocket();
  } catch (error) {
    print("Error in main", "error");
  }
}

main();
