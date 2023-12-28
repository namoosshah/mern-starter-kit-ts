import { Router } from "express";
import { updateProfile } from "@/controllers/profile";
import { validate } from "@/middleware/requestValidator";
import { profileDTO } from "@/dto/profile.dto";
import uploader from "@/utils/uploader";

const router = Router();

router.put(
  "/profile",
  uploader("users").single("avatar"),
  validate(profileDTO),
  updateProfile
);

export default router;
