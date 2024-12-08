import { Router } from "express";
import authenticateToken from "../middleware/authMiddleware";
import {
  addBookmark,
  getBookmarks,
  bookmarkStatus,
  removeBookmark,
} from "../controllers/bookmarkController";

const router = Router();

router.use(authenticateToken);

router.post("/", addBookmark);
router.get("/", getBookmarks);
router.get("/status", bookmarkStatus);
router.delete("/", removeBookmark);

export default router;
