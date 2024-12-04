import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header/Header";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import SideBar from "../../components/SideBar/SideBar";
import LatestNews from "../../components/LatestNews/LatestNews";
import styles from "./Home.module.scss";

interface Article {
  title: string;
  source: {
    name: string;
  };
  author: string;
  url: string;
  urlToImage: string;
  category: string;
}

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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
      .get("/api/news/top-headlines")
      .then((response) => {
        const fetchedArticles = response.data.articles;
        setArticles(fetchedArticles);
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
      });
  }, []);

  const firstTwoRows = articles.slice(0, 4);
  const remainingArticles = articles.slice(4);

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <Header />
        <SearchBar onSearch={handleSearch} />
        <div className={styles.authButtons}>
          {!isLoggedIn ? (
            <>
              <button className={styles.signinButton}>SIGN IN</button>
              <button className={styles.signupButton}>SIGN UP</button>
            </>
          ) : null}
        </div>
      </div>
      <div className={styles.content}>
        <SideBar />
        <div className={styles.mainContent}>
          <h2>News</h2>
          <div className={styles.articleSection}>
            <div className={styles.twoColumnSection}>
              <div className={styles.articlesGrid}>
                {firstTwoRows.map((article) => (
                  <ArticleCard key={article.url} article={article} />
                ))}
              </div>
              <div className={styles.latestNewsWrapper}>
                <h2>
                  <img
                    src="/images/latest_news.png"
                    alt="Latest News Icon"
                    className={styles.newsIcon}
                  />{" "}
                  Latest news
                </h2>
                <LatestNews />
              </div>
            </div>
            <div className={styles.threeColumnSection}>
              <div className={styles.articlesGrid}>
                {remainingArticles.map((article) => (
                  <ArticleCard key={article.url} article={article} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
