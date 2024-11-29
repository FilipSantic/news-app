import { Router } from "express";
import authenticateToken from "../middleware/authMiddleware";
import {
  addBookmark,
  getBookmarks,
  removeBookmark,
} from "../controllers/bookmarkController";

const router = Router();

router.use(authenticateToken);

router.post("/", addBookmark);
router.get("/", getBookmarks);
router.delete("/:id", removeBookmark);

export default router;
