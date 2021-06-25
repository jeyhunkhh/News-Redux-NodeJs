import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { IAppState } from "../../redux/interface";
import { getNews } from "../actions";
import "./index.scss";
import NewsItem from "./NewsItem";

const News = () => {
  const dispatch = useDispatch();
  const [newsCount, setNewsCount] = useState(6);
  const news = useSelector((state: IAppState) => state.news);
  const { data } = news;

  useEffect(() => {
    dispatch(getNews());
  }, [dispatch]);

  const computedNews = useMemo(() => {
    let computed = data;

    if (computed !== null) {
      computed = computed!.slice(0, newsCount);
    }

    return [computed];
  }, [data, newsCount]);

  const handleAddShow = useCallback(() => {
    setNewsCount(newsCount + 6);
  }, [newsCount]);

  return (
    <div className="all-news my-3">
      <div className="row">
        {news.status === "SUCCESS" &&
          computedNews[0]?.map((item) => (
            <div className="col-lg-4 mb-3" key={item._id}>
              <NewsItem news={item} />
            </div>
          ))}
      </div>
      <div className="text-center">
        {data !== null && newsCount < data.length && (
          <Button onClick={handleAddShow} variant="success">
            {console.log(newsCount)}
            Show More
          </Button>
        )}
      </div>
    </div>
  );
};

export default News;