import { useLocation } from "react-router-dom";
import "../Styles/News.css";
import { useEffect, useState } from "react";
import api from "../api/api";

const NewsPage = () => {
  const location = useLocation();

  const [newsItems, setNewsItems] = useState([])

  if (location.pathname === "/news") {
    document.title = "News";
  }

  useEffect(() => {
    async function GetNews() {
      try {
        const res = await api.get("main/News");
        setNewsItems(res.data.result)
        console.log(res.data.result);
      }
      catch (err) {
        console.log(err);
      }
    }
    GetNews();
  }, [])




  return (
    <div className="news-page">
      <main className="news-inner">
        <header className="news-header">
          <h1>News</h1>
          <p>
            Latest updates, balance changes and behind‑the‑scenes insights about
            the game and the platform.
          </p>
        </header>

        <section className="news-list">
          {newsItems.map((item) => (
            <article key={item.id} className="news-card">
              <header className="news-card-header">
                <div className="news-avatar-circle">C</div>
                <div className="news-header-text">
                  <p className="news-main-title">{item.title}</p>
                  <span className="news-date">
                    {new Date(item.date).toLocaleDateString("hu-HU")}
                  </span>
                </div>
              </header>

              {item.image && (
                <div className="news-image-wrapper">
                  <img
                    src={item.image}
                    alt={item.cim}
                    className="news-image"
                  />
                </div>
              )}

              <div className="news-content">
                <p>{item.content}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default NewsPage;

