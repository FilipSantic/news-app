import { Router } from "express";
import { signup, signin, verifyEmail } from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/verify-email", verifyEmail);

export default router;
