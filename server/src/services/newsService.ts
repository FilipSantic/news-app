import axios from "axios";

export const fetchArticleByUrl = async (articleUrl: string) => {
  try {
    const response = await axios.get(`${process.env.NEWS_API_URL}/everything`, {
      params: {
        apiKey: process.env.NEWS_API_KEY,
        q: `"${articleUrl}"`,
        pageSize: 1,
      },
    });

    const articles = response.data.articles;

    if (articles.length > 0) {
      return articles[0];
    } else {
      throw new Error("Article not found");
    }
  } catch (error) {
    console.error("Error fetching article by URL:", error);
    throw error;
  }
};
