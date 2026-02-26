import { useLocation } from "react-router-dom";
import "../Styles/News.css";

const NewsPage = () => {
  const location = useLocation();

  if (location.pathname === "/news") {
    document.title = "News";
  }

  const newsItems = [
    {
      id: 1,
      cim: "Ranked mode – first season",
      title: "Season 1 is live",
      image:
        "https://images.pexels.com/photos/7862591/pexels-photo-7862591.jpeg?auto=compress&cs=tinysrgb&w=1200",
      datum: "2026-02-20",
      content:
        "The very first ranked season has started. Climb the ladder, unlock unique cosmetics and show everyone who rules the castle.",
    },
    {
      id: 2,
      cim: "New arena & visual update",
      title: "Castle courtyard rework",
      image:
        "https://images.pexels.com/photos/235986/pexels-photo-235986.jpeg?auto=compress&cs=tinysrgb&w=1200",
      datum: "2026-02-10",
      content:
        "We rebuilt the main courtyard with better lighting, clearer silhouettes and more readable combat spaces for competitive play.",
    },
    {
      id: 3,
      cim: "Quality of life patch",
      title: "Smarter UI & faster matches",
      image:
        "https://images.pexels.com/photos/9071736/pexels-photo-9071736.jpeg?auto=compress&cs=tinysrgb&w=1200",
      datum: "2026-01-28",
      content:
        "Shorter queue times, clearer damage numbers and improved keyboard / controller hints for a smoother first‑time experience.",
    },
  ];

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
                  <h2 className="news-main-title">{item.cim}</h2>
                  <p className="news-subtitle">{item.title}</p>
                  <span className="news-date">
                    {new Date(item.datum).toLocaleDateString()}
                  </span>
                </div>
              </header>

              {item.image && (
                <div className="news-image-wrapper">
                  <img src={item.image} alt={item.cim} className="news-image" />
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

