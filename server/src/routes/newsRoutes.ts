import { Router } from "express";
import {
  getAllNews,
  getTopHeadlines,
  getNewsByCategory,
  searchNews,
  searchNewsByCategory,
} from "../controllers/newsController";

const router = Router();

router.get("/all", getAllNews);
router.get("/top-headlines", getTopHeadlines);
router.get("/categories", getNewsByCategory);
router.get("/search", searchNews);
router.get("/search-by-category", searchNewsByCategory);

export default router;
