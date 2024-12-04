import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import styles from "./LatestNews.module.scss";

const LatestNews: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    axios
      .get(`/api/news/all?page=${page}&pageSize=10`)
      .then((response) => {
        const newArticles = response.data.articles;
        setArticles((prevArticles) => [...prevArticles, ...newArticles]);
        if (
          newArticles.length === 0 ||
          articles.length + newArticles.length >= response.data.totalResults ||
          articles.length + newArticles.length >= 100
        ) {
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching more articles:", error);
      });
  };

  useEffect(() => {
    fetchMoreData();
  }, [page]);

  return (
    <div id="latestNewsContainer" className={styles.latestNews}>
      <div className={styles.scrollableContent}>
        <InfiniteScroll
          dataLength={articles.length}
          next={() => setPage((prevPage) => prevPage + 1)}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p>No more articles</p>}
          scrollableTarget="latestNewsContainer"
        >
          {articles.map((article) => (
            <div key={article.url} className={styles.article}>
              <span className={styles.time}>
                {new Date(article.publishedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <p className={styles.title}>{article.title}</p>
              <hr className={styles.separator} />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default LatestNews;
