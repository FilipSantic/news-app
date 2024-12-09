import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Header from "../../components/Header/Header";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import SideBar from "../../components/SideBar/SideBar";
import LatestNews from "../../components/LatestNews/LatestNews";
import styles from "./Home.module.scss";

interface Article {
  title: string;
  author: string;
  url: string;
  urlToImage: string;
  category: string;
}

const Home: React.FC = () => {
  const { user, isLoggedIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const firstTwoRowsContent = firstTwoRows.map((article) => (
    <ArticleCard key={article.url} article={article} />
  ));

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <div className={styles.headerAndMenu}>
          <Header />
          <div
            className={styles.hamburgerIcon}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          {isMenuOpen && (
            <div className={styles.mobileMenu}>
              <div
                className={styles.closeIcon}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaTimes />
              </div>
              <div className={styles.mobileMenuContent}>
                <Header />
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search all news"
                />
              </div>
              <SideBar />
              <div className={styles.mobileAuthButtons}>
                {!isLoggedIn ? (
                  <>
                    <button
                      className={styles.signinButton}
                      onClick={() => navigate("/signin")}
                    >
                      SIGN IN
                    </button>
                  </>
                ) : (
                  <>
                    <button className={styles.signoutButton} onClick={signOut}>
                      SIGN OUT
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <SearchBar onSearch={handleSearch} placeholder="Search all news" />
        <div className={styles.authButtons}>
          {!isLoggedIn ? (
            <>
              <button
                className={styles.signinButton}
                onClick={() => navigate("/signin")}
              >
                SIGN IN
              </button>
            </>
          ) : (
            <>
              <span className={styles.welcomeMessage}>
                Hi, {user?.firstName}!
              </span>
              <button className={styles.signoutButton} onClick={signOut}>
                SIGN OUT
              </button>
            </>
          )}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.sidebarContent}>
          <SideBar />
        </div>
        <div className={styles.mainContent}>
          <h2 className={styles.desktopHeading}>News</h2>
          <div className={styles.mobileToggle}>
            <span
              className={`${styles.toggleButton} ${
                isFeatured ? styles.active : ""
              }`}
              onClick={() => setIsFeatured(true)}
            >
              Featured
            </span>
            <span
              className={`${styles.toggleButton} ${
                !isFeatured ? styles.active : ""
              }`}
              onClick={() => setIsFeatured(false)}
            >
              Latest
            </span>
          </div>
          <div className={styles.articleSection}>
            <div className={styles.twoColumnSection}>
              {isFeatured && (
                <div className={`${styles.articlesGrid}`}>
                  {firstTwoRowsContent}
                </div>
              )}
              <div
                className={`${styles.latestNewsWrapper} ${styles.desktopOnly}`}
              >
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
              {!isFeatured && (
                <div
                  className={`${styles.latestNewsWrapper} ${styles.mobileOnly}`}
                >
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
              )}
            </div>
            <div
              className={`${styles.threeColumnSection} ${
                !isFeatured ? styles.mobileHidden : ""
              }`}
            >
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
