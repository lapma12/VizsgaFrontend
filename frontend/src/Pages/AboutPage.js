import { useLocation } from "react-router-dom";
import "../Styles/About.css"

const AboutPage = () => {
  const location = useLocation()
  if (location.pathname == "/about") {
    document.title = "About"
  }

  const teamMembers = [
    {
      name: "Dongesz",
      role: "Game Developer",
      bio: "Developer of the game engine and mechanics. Responsible for gameplay and technical implementation.",
      image: "https://avatars.githubusercontent.com/u/83972650?v=4"
    },
    {
      name: "Lapma",
      role: "Website Developer",
      bio: "Responsible for the animations of the game characters. Brings movements and characters to life.",
      image: 'https://scontent-vie1-1.xx.fbcdn.net/v/t39.30808-1/455037356_1227391901621943_2585659180847469402_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_ohc=k6Z-Si2nGqQQ7kNvwGlgoF3&_nc_oc=Adns4iJpYGfU-zL4RlfznBOs1HYzUOjxlSaJkp49IPlP49InHVmEZ5mciV2Q8Ajf9zM0_VqwNMD8MVTuSRpJ3yzr&_nc_zt=24&_nc_ht=scontent-vie1-1.xx&_nc_gid=0umAl1PnOfAB6qrBJaPiLA&oh=00_AfiEPfe6bi_a3vFTdobrQInqANEJeSkkPR4zpnBK5MoS0Q&oe=69128EBD'
    }
  ];

  return (
    <div className="about-page">
      <div className="about-header">
        <h1>About us</h1>
        <p>
          Welcome to the website of our 3D game development team! Our goal is to create an impressive 3D game that offers a unique experience for players. Our team is committed to quality and innovation.
        </p>
      </div>
      <div className="about-section">
        <h2>About Our Game</h2>
        <div className="about-content">
          <p> Our game takes place in a stunning 3D world where players embark on unique adventures. We're developing the game using modern graphics solutions and innovative gameplay mechanics. </p> <p> Throughout the project, we utilize the latest 3D modeling and animation techniques to create a realistic and captivating world. </p> <p> We believe that quality and player experience are the most important aspects, which is why we pay close attention to every detail during development. </p>
        </div>
      </div>
      <div className="team-section">
        <h2>Our Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member-card">
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
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default AboutPage;
