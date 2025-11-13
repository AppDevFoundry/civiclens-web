import { marked } from "marked";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

import ArticleMeta from "../../components/article/ArticleMeta";
import CommentList from "../../components/comment/CommentList";
import { Article } from "../../lib/types/articleType";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";

const ArticlePage = () => {
  const router = useRouter();
  const {
    query: { pid },
  } = router;

  const {
    data: fetchedArticle,
    error,
    isLoading,
  } = useSWR(
    pid ? `${SERVER_BASE_URL}/articles/${encodeURIComponent(String(pid))}` : null,
    fetcher
  );

  // Handle loading state
  if (isLoading || !pid) {
    return (
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>Loading article...</h1>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>Error loading article</h1>
            <p>Could not load the article. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle no data state
  if (!fetchedArticle || !fetchedArticle.article) {
    return (
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>Article not found</h1>
          </div>
        </div>
      </div>
    );
  }

  const { article }: Article = fetchedArticle;

  const markup = {
    __html: marked(article.body),
  };

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleMeta article={article} />
        </div>
      </div>
      <div className="container page">
        <div className="row article-content">
          <div className="col-xs-12">
            <div dangerouslySetInnerHTML={markup} />
            <ul className="tag-list">
              {article.tagList.map((tag) => (
                <li key={tag} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <hr />
        <div className="article-actions" />
        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <CommentList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
