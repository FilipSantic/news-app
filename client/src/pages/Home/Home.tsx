import React, { useEffect, useState } from "react";
import axios from "axios";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import SideBar from "../../components/SideBar/SideBar";
import "./Home.module.scss";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  category: string;
}

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  const handleSearch = (query: string) => {
    axios
      .get(`/api/news/search?q=${encodeURIComponent(query)}`)
      .then((response) => {
        const fetchedArticles = response.data.articles;
        setArticles(fetchedArticles);
      })
      .catch((error) => {
        console.error("Error searching articles:", error);
      });
  };

  useEffect(() => {
    axios
      .get("/api/news/all")
      .then((response) => {
        const fetchedArticles = response.data.articles;
        setArticles(fetchedArticles);
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
      });
  }, []);

  return (
    <div className="home-container">
      <SearchBar onSearch={handleSearch} />
      <SideBar />
      <div className="category-section">
        <h2>News</h2>
        <div className="articles-grid">
          {articles.map((article) => (
            <ArticleCard key={article.url} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
