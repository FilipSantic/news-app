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
    const categories = [
      "general",
      "business",
      "health",
      "science",
      "sports",
      "technology",
    ];
    const categoryLimit = Math.floor(limit / categories.length);
    const remaining = limit % categories.length;
    let articles: any[] = [];

    const fetchCategoryArticles = async (category: string, count: number) => {
      let page = 1;
      let categoryArticles: any[] = [];
      while (categoryArticles.length < count) {
        const response = await axios.get(
          `${process.env.NEWS_API_URL}/top-headlines`,
          {
            params: {
              apiKey: process.env.NEWS_API_KEY,
              country: "us",
              category,
              pageSize: count,
              page,
            },
          }
        );

        const fetchedArticles = response.data.articles;

        const validArticles = fetchedArticles.filter(
          (article: any) => article.title !== "[Removed]"
        );

        categoryArticles = categoryArticles.concat(validArticles);

        if (fetchedArticles.length === 0 || categoryArticles.length >= count) {
          break;
        }

        page++;
      }

      return categoryArticles.slice(0, count).map((article: any) => ({
        ...article,
        category,
      }));
    };

    const categoryFetchPromises = categories.map((category, index) => {
      const count = index < remaining ? categoryLimit + 1 : categoryLimit;
      return fetchCategoryArticles(category, count);
    });

    const results = await Promise.all(categoryFetchPromises);
    articles = results.flat();

    articles = articles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

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
    const pageSize = parseInt(req.query.pageSize as string) || 18;

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
    const pageSize = parseInt(req.query.pageSize as string) || 16;

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

export const searchNewsByCategory = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.q as string | undefined;
    const category = req.query.category as string | undefined;

    if (!category) {
      res.status(400).json({ message: "Category is required" });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 18;

    let articles: any[] = [];
    let currentPage = page;
    let totalResults = 0;

    while (articles.length < pageSize) {
      const response = await axios.get(
        `${process.env.NEWS_API_URL}/everything`,
        {
          params: {
            apiKey: process.env.NEWS_API_KEY,
            q: searchQuery || undefined,
            category,
            language: "en",
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
    console.error("Error searching news by category:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
