import { resolve } from "path";
import { existsSync, mkdirSync } from "fs";

/* Create directory if not existed */
const storageDir = resolve(__dirname, "public/storage");
if (!existsSync(storageDir)) {
  mkdirSync(storageDir, {
    recursive: true,
  });
}

export const paths = {
  baseDir: resolve(__dirname),
  publicStorageDir: storageDir,
};
