import { IUser } from "./src/models/user";

declare global {
  namespace Express {
    export interface Request {
      user?: IUser | null;
    }
  }
}
