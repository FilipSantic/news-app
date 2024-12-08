import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Header from "../../components/Header/Header";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import SideBar from "../../components/SideBar/SideBar";
import styles from "./Favourites.module.scss";

interface Article {
  title: string;
  author: string;
  url: string;
  urlToImage: string;
  category: string;
}

const Favourites: React.FC = () => {
  const { user, isLoggedIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (query: string) => {
    const filteredBookmarks = bookmarks.filter((bookmark) =>
      bookmark.title.toLowerCase().includes(query.toLowerCase())
    );
    setBookmarks(filteredBookmarks);

    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    axios
      .get(`/api/bookmarks?userId=${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        setBookmarks(response.data.articles);
      })
      .catch((error) => {
        console.error("Error fetching bookmarks:", error);
      });
  }, [user, navigate]);

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
                  placeholder="Search your favourite articles"
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
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search your favourite articles"
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
          <h2>Your Favourite Articles</h2>
          <div className={styles.articlesGrid}>
            {bookmarks.map((bookmark) => (
              <ArticleCard key={bookmark.url} article={bookmark} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favourites;
