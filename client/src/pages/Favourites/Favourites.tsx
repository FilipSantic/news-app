import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import "./Favourites.module.scss";

const Favorites: React.FC = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`/api/bookmarks?userId=${user?.id}`)
      .then((response) => {
        setBookmarks(response.data.bookmarks);
      })
      .catch((error) => {
        console.error("Error fetching bookmarks:", error);
      });
  }, []);

  return (
    <div className="favorites-container">
      <h2>Your Bookmarked Articles</h2>
      <div className="articles-grid">
        {bookmarks.map((bookmark) => (
          <ArticleCard key={bookmark.articleUrl} article={bookmark} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
