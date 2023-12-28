import multer from "multer";
import { extname, join } from "path";
import { existsSync, mkdirSync } from "fs";
import { paths } from "@paths";
import { ErrorResponse } from "@/utils/errorResponse";

interface FileFilterCallback {
  (error: Error): void;
  (error: ErrorResponse | null, acceptFile: boolean): void;
}

/* File Upload via Multer */
const uploader = (dir?: string) => {
  let storageDir = paths.publicStorageDir;
  if (dir) {
    storageDir = join(storageDir, dir);
    if (!existsSync(storageDir)) {
      mkdirSync(storageDir, {
        recursive: true,
      });
    }
  }
  return multer({
    storage: multer.diskStorage({
      destination: storageDir,
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
          null,
          file.fieldname + "-" + uniqueSuffix + extname(file.originalname)
        );
      },
    }),
    fileFilter: function (req, file, cb: FileFilterCallback) {
      const mimetype = file.mimetype;
      const mimes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/jpg",
      ];
      if (mimes.indexOf(mimetype) === -1) {
        return cb(
          new ErrorResponse(
            "File should of type jpeg, jpg, png, bmp and gif",
            422
          ),
          false
        );
      }
      cb(null, true);
    },
  });
};
export default uploader;
