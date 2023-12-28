import { Router, Request, Response } from "express";
import authRoutes from "@/routes/auth";
import profileRoutes from "@/routes/profile";
import { auth } from "@/middleware/auth";

const router = Router();
router.get("/", (req: Request, res: Response) => {
  res.send("v1.0.0");
});
/* Guest Routes */
router.use(authRoutes);
/* Auth Routes */
router.use(auth, profileRoutes);

export default router;
