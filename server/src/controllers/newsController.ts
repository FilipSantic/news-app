import { Request, Response } from "express";
import axios from "axios";

export const getAllNews = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    let currentPage = page;
    let articles: any[] = [];
    let totalResults = 0;

    while (articles.length < pageSize) {
      const response = await axios.get(
        `${process.env.NEWS_API_URL}/everything`,
        {
          params: {
            apiKey: process.env.NEWS_API_KEY,
            q: "news",
            language: "en",
            sortBy: "publishedAt",
            page: currentPage,
            pageSize,
          },
        }
      );

      const fetchedArticles = response.data.articles;
      totalResults = response.data.totalResults;

      const validArticles = fetchedArticles.filter(
        (article: any) => article.title !== "[Removed]"
      );

      articles = articles.concat(validArticles);

      if (fetchedArticles.length === 0 || articles.length >= pageSize) {
        break;
      }

      currentPage++;
    }

    articles = articles.slice(0, pageSize);

    if ((page - 1) * pageSize >= totalResults || (page - 1) * pageSize >= 100) {
      res.status(400).json({ message: "No more results available." });
      return;
    }

    res.status(200).json({
      articles,
      totalResults,
      currentPage: page,
      totalPages: Math.ceil(totalResults / pageSize),
    });
  } catch (error: any) {
    console.error("Error fetching all news:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTopHeadlines = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 16;
    let articles: any[] = [];
    let page = 1;

    while (articles.length < limit) {
      const response = await axios.get(
        `${process.env.NEWS_API_URL}/top-headlines`,
        {
          params: {
            apiKey: process.env.NEWS_API_KEY,
            country: "us",
            pageSize: limit,
            page,
          },
        }
      );

      const fetchedArticles = response.data.articles;

      const validArticles = fetchedArticles.filter(
        (article: any) => article.title !== "[Removed]"
      );

      articles = articles.concat(validArticles);

      if (fetchedArticles.length === 0 || articles.length >= limit) {
        break;
      }

      page++;
    }

    articles = articles.slice(0, limit);

    res.status(200).json({ articles });
  } catch (error: any) {
    console.error("Error fetching top headlines:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getNewsByCategory = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    if (!category) {
      res.status(400).json({ message: "Category is required" });
      return;
    }

    let articles: any[] = [];
    let currentPage = page;
    let totalResults = 0;

    while (articles.length < pageSize) {
      const response = await axios.get(
        `${process.env.NEWS_API_URL}/top-headlines`,
        {
          params: {
            apiKey: process.env.NEWS_API_KEY,
            category,
            country: "us",
            page: currentPage,
            pageSize,
          },
        }
      );

      const fetchedArticles = response.data.articles;
      totalResults = response.data.totalResults;

      const validArticles = fetchedArticles.filter(
        (article: any) => article.title !== "[Removed]"
      );

      articles = articles.concat(validArticles);

      if (fetchedArticles.length === 0 || articles.length >= pageSize) {
        break;
      }

      currentPage++;
    }

    articles = articles.slice(0, pageSize);

    res.status(200).json({
      articles,
      totalResults,
      currentPage: page,
      totalPages: Math.ceil(totalResults / pageSize),
    });
  } catch (error: any) {
    console.error("Error fetching news by category:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchNews = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.q as string | undefined;

    if (!searchQuery) {
      res.status(400).json({ message: "Search query is required" });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    let articles: any[] = [];
    let currentPage = page;
    let totalResults = 0;

    while (articles.length < pageSize) {
      const response = await axios.get(
        `${process.env.NEWS_API_URL}/everything`,
        {
          params: {
            apiKey: process.env.NEWS_API_KEY,
            q: searchQuery,
            language: "en",
            sortBy: "publishedAt",
            page: currentPage,
            pageSize,
          },
        }
      );

      const fetchedArticles = response.data.articles;
      totalResults = response.data.totalResults;

      const validArticles = fetchedArticles.filter(
        (article: any) => article.title !== "[Removed]"
      );

      articles = articles.concat(validArticles);

      if (fetchedArticles.length === 0 || articles.length >= pageSize) {
        break;
      }

      currentPage++;
    }

    articles = articles.slice(0, pageSize);

    res.status(200).json({
      articles,
      totalResults,
      currentPage: page,
      totalPages: Math.ceil(totalResults / pageSize),
    });
  } catch (error: any) {
    console.error("Error searching news:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
