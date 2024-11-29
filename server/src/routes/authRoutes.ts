import { Router } from "express";
import {
  signup,
  signin,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);

export default router;
