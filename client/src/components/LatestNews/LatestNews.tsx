import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import ArticleCard from "../ArticleCard/ArticleCard";
import "./LatestNews.module.scss";

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
        setPage((prevPage) => prevPage + 1);
        if (articles.length >= response.data.totalResults) {
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching more articles:", error);
      });
  };

  useEffect(() => {
    fetchMoreData();
  }, []);

  return (
    <div className="latest-news-container">
      <h2>Latest News</h2>
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more articles</p>}
      >
        {articles.map((article) => (
          <ArticleCard key={article.url} article={article} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default LatestNews;
