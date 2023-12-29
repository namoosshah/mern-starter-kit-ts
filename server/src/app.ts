import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import router from "@/routes/router";
import { errorHandler } from "@/middleware/errorHandler";
import { paths } from "@paths";

/* Configurations */
dotenv.config();

const app: Application = express();

const logsPath = join(__dirname, "../logs");
if (!existsSync(logsPath)) {
  mkdirSync(logsPath, {
    recursive: true,
  });
}

/* Middlewares */
app.use("/storage", express.static(paths.publicStorageDir));
app.use(express.json());
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(
  morgan("combined", {
    stream: createWriteStream(join(logsPath, "access.log"), {
      flags: "a",
    }),
  })
);
app.use(cors());

/* Routes */
app.use("/api/v1", router, errorHandler);

/* Mongo Database Connection */
if (process.env.NODE_ENV !== "test") {
  mongoose.connect(process.env.MONGO_CONNECTION_URL!).catch((err) => {
    console.log(`Unable to connect to db: ${err}`);
  });
}
export default app;
