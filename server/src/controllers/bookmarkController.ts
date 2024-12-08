import { Response } from "express";
import { ObjectId } from "mongodb";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Bookmark from "../models/Bookmark";

export const addBookmark = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, article } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!article) {
      res.status(400).json({ message: "Article is required" });
      return;
    }

    const existingBookmark = await Bookmark.findOne({
      user: new ObjectId(userId),
      "article.url": article.url,
    });

    if (existingBookmark) {
      res.status(400).json({ message: "Article already bookmarked" });
      return;
    }

    const bookmark = new Bookmark({
      user: new ObjectId(userId),
      article,
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
    const userId = req.query.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const bookmarks = await Bookmark.find({ user: userId }).sort({
      createdAt: -1,
    });

    if (!bookmarks.length) {
      res.status(404).json({ message: "No bookmarks found" });
      return;
    }

    const articles = bookmarks.map((bookmark) => bookmark.article);

    res.status(200).json({ articles });
  } catch (error: any) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const bookmarkStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { userId, articleUrl } = req.query;

    if (!userId || !articleUrl) {
      res.status(400).json({ message: "Invalid request parameters" });
      return;
    }

    const bookmark = await Bookmark.findOne({
      user: userId,
      "article.url": articleUrl,
    });

    res.status(200).json({ bookmarked: !!bookmark });
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeBookmark = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { userId, articleUrl } = req.body;

    if (!userId || !articleUrl) {
      res.status(400).json({ message: "Invalid request parameters" });
      return;
    }

    await Bookmark.findOneAndDelete({
      user: userId,
      "article.url": articleUrl,
    });

    res.status(200).json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).json({ message: "Server error" });
  }
};
