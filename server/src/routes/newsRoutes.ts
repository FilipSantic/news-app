import { Router } from "express";
import {
  getAllNews,
  getTopHeadlines,
  getNewsByCategory,
  searchNews,
} from "../controllers/newsController";

const router = Router();

router.get("/all", getAllNews);
router.get("/top-headlines", getTopHeadlines);
router.get("/categories", getNewsByCategory);
router.get("/search", searchNews);

export default router;
