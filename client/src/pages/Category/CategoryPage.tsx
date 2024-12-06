import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import Header from "../../components/Header/Header";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import SideBar from "../../components/SideBar/SideBar";
import styles from "./CategoryPage.module.scss";

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

interface CategoryPageProps {
  category: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const { user, isLoggedIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);

  const handleSearch = (query: string) => {
    axios
      .get(
        `/api/news/search-by-category?category=${category}&q=${encodeURIComponent(
          query
        )}`
      )
      .then((response) => {
        const articlesWithCategory = response.data.articles.map(
          (article: Article) => ({
            ...article,
            category,
          })
        );
        setArticles(articlesWithCategory);
      })
      .catch((error) => {
        console.error("Error searching articles:", error);
      });
  };

  useEffect(() => {
    axios
      .get(`/api/news/categories?category=${category}`)
      .then((response) => {
        const articlesWithCategory = response.data.articles.map(
          (article: Article) => ({
            ...article,
            category,
          })
        );
        setArticles(articlesWithCategory);
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
      });
  }, [category]);

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <Header />
        <SearchBar
          onSearch={handleSearch}
          placeholder={`Search ${category} news`}
        />
        <div className={styles.authButtons}>
          {!isLoggedIn ? (
            <>
              <button
                className={styles.signinButton}
                onClick={() => navigate("/signin")}
              >
                SIGN IN
              </button>
              <button
                className={styles.signupButton}
                onClick={() => navigate("/signup")}
              >
                SIGN UP
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
        <SideBar />
        <div className={styles.mainContent}>
          <h2>{category.charAt(0).toUpperCase() + category.slice(1)} News</h2>
          <div className={styles.articlesGrid}>
            {articles.map((article) => (
              <ArticleCard key={article.url} article={article} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
