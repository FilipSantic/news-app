import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Bookmark from "../models/Bookmark";
import { fetchArticleByUrl } from "../services/newsService";

export const addBookmark = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { articleUrl } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!articleUrl) {
      res.status(400).json({ message: "Article URL is required" });
      return;
    }

    const bookmark = new Bookmark({
      user: userId,
      articleUrl,
    });

    await bookmark.save();

    res.status(201).json({ message: "Bookmark added", bookmark });
  } catch (error: any) {
    console.error("Error adding bookmark:", error);

    if (error.code === 11000) {
      res.status(400).json({ message: "Article already bookmarked" });
      return;
    }

    res.status(500).json({ message: "Server error" });
  }
};

export const getBookmarks = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const bookmarks = await Bookmark.find({ user: userId }).sort({
      createdAt: -1,
    });

    const articles = await Promise.all(
      bookmarks.map(async (bookmark) => {
        try {
          const article = await fetchArticleByUrl(bookmark.articleUrl);
          return article;
        } catch (error) {
          console.error(
            `Error fetching article for URL ${bookmark.articleUrl}:`,
            error
          );
          return null;
        }
      })
    );

    const validArticles = articles.filter((article) => article !== null);

    res.status(200).json({ articles: validArticles });
  } catch (error: any) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeBookmark = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const bookmarkId = req.params.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const bookmark = await Bookmark.findOneAndDelete({
      _id: bookmarkId,
      user: userId,
    });

    if (!bookmark) {
      res.status(404).json({ message: "Bookmark not found" });
      return;
    }

    res.status(200).json({ message: "Bookmark removed" });
  } catch (error: any) {
    console.error("Error removing bookmark:", error);
    res.status(500).json({ message: "Server error" });
  }
};
