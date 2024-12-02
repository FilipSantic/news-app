import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import "./ArticleCard.module.scss";

interface ArticleCardProps {
  article: {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
  };
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);

  const handleBookmark = () => {
    if (!user) {
      alert("Please log in to bookmark articles.");
      return;
    }

    axios
      .post("/api/bookmarks", { articleUrl: article.url })
      .then((response) => {
        setBookmarked(true);
        alert("Article bookmarked!");
      })
      .catch((error) => {
        console.error("Error bookmarking article:", error);
        alert("An error occurred while bookmarking.");
      });
  };

  return (
    <div className="article-card">
      <img src={article.urlToImage} alt={article.title} />
      <div className="article-content">
        <h3>{article.title}</h3>
        <p>{article.description}</p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="read-more-link"
        >
          Read More
        </a>
      </div>
      <button onClick={handleBookmark} className="bookmark-button">
        {bookmarked ? "Bookmarked" : "Bookmark"}
      </button>
    </div>
  );
};

export default ArticleCard;
