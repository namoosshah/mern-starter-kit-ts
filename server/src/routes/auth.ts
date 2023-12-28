import { Router } from "express";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
} from "@/controllers/auth";
import { validate } from "@/middleware/requestValidator";
import { registrationDTO } from "@/dto/registration.dto";
import { loginDTO } from "@/dto/login.dto";
import { forgotPasswordDTO } from "@/dto/forgotPassword.dto";
import { resetPasswordDTO } from "@/dto/resetPassword.dto";

const router = Router();

router.post("/register", validate(registrationDTO), register);
router.post("/login", validate(loginDTO), login);
router.post("/forgot-password", validate(forgotPasswordDTO), forgotPassword);
router.post("/reset-password", validate(resetPasswordDTO), resetPassword);

export default router;
