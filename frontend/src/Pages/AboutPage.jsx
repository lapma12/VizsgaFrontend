import { useLocation } from "react-router-dom";
import "../Styles/About.css"

const AboutPage = () => {
  const location = useLocation()
  if (location.pathname === "/about") {
    document.title = "About"
  }

  const teamMembers = [
    {
      name: "Dongesz",
      role: "Game Developer",
      bio: "Developer of the game engine and mechanics. Responsible for gameplay and technical implementation.",
      image: "https://avatars.githubusercontent.com/u/83972650?v=4",
    },
    {
      name: "Lapma",
      role: "Website Developer",
      bio: "Responsible for the website, UI, and integrations. Keeps the experience fast and modern.",
      image: "https://avatars.githubusercontent.com/u/112930985?v=4",
    },
  ];

  return (
    <div className="about-page">
      <main className="about-inner">
        <section className="about-header">
          <h1>About us</h1>
          <p>
            Welcome to the website of our 2D game development team! Our goal is to
            create a unique, immersive experience where gameplay, visuals and
            technology work perfectly together.
          </p>
        </section>

        <section className="about-section">
          <h2>What is this project?</h2>
          <div className="about-content">
            <p>
              This project started as a passion for games and storytelling. Step by
              step, we are building a world where every match, every decision and
              every victory matters. Our focus is on smooth gameplay, fair
              competition and a rewarding progression system.
            </p>
            <p>
              Behind the scenes we combine a custom 2D environment with a modern
              web experience. That means fast loading, responsive design and a
              consistent visual style across the whole site.
            </p>
          </div>

          <div className="about-highlights">
            <div className="about-highlight-card">
              <h3>Gameplay First</h3>
              <p>
                Every feature is designed around player experience – clear feedback,
                responsive controls and satisfying results.
              </p>
            </div>
            <div className="about-highlight-card">
              <h3>Modern UI</h3>
              <p>
                Clean, readable layouts with a consistent medieval-inspired color
                palette for both game and website.
              </p>
            </div>
            <div className="about-highlight-card">
              <h3>Continuous Improvement</h3>
              <p>
                We iterate based on feedback, add new features and polish details so
                the experience gets better over time.
              </p>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <article key={index} className="team-member-card">
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="team-member-image"
                  />
                )}
                <h3 className="team-member-name">{member.name}</h3>
                <p className="team-member-role">{member.role}</p>
                <p className="team-member-bio">{member.bio}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
