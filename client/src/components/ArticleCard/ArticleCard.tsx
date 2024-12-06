import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import styles from "./ArticleCard.module.scss";

interface ArticleCardProps {
  article: {
    title: string;
    category: string;
    source: {
      name: string;
    };
    author: string;
    url: string;
    urlToImage: string;
  };
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);

  const handleBookmark = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user) {
      alert("Please log in to bookmark articles.");
      return;
    }

    axios
      .post("/api/bookmarks", { userId: user.id, articleUrl: article.url })
      .then(() => {
        setBookmarked(true);
        alert("Article bookmarked!");
      })
      .catch((error) => {
        console.error("Error bookmarking article:", error);
        alert("An error occurred while bookmarking.");
      });
  };

  return (
    <div className={styles.articleCard}>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.a}
      >
        <img src={article.urlToImage} alt={article.title} />
        <div className={styles.articleContent}>
          <div className={styles.category}>{article.category}</div>
          <h3>{article.title}</h3>
          <p className={styles.writer}>{article.author}</p>
        </div>
      </a>
      <button
        onClick={handleBookmark}
        className={`${styles.bookmarkButton} ${
          bookmarked ? styles.bookmarked : styles.notBookmarked
        }`}
      >
        {bookmarked ? "★" : "☆"}
      </button>
    </div>
  );
};

export default ArticleCard;
