import * as fs from "fs";

function createErrorFile(error: Error, path: string) {
  const errorString = error.stack || error.message;
  fs.writeFileSync(path, errorString);
}

export default createErrorFile;
