import '../Styles/Footer.css';
import footerImg from "../Img/footerImg.png"

const Footer = () => {
    return (
        <footer className="footer">
        <img src={footerImg} alt="footerImage" className="footerImg" />
    
        <div className="footer-content">
            <div className="footer-columns">
    
                <div className="footer-column">
                    <h3>About CastL</h3>
                    <p className="footer-text">
                        CastL egy modern platform tartalomkészítőknek és közösségeknek.
                    </p>
                </div>
    
                <div className="footer-column">
                    <h3>Legal</h3>
                    <ul>
                        <li><a href='/privacypolicy'>Privacy Policy</a></li>
                        <li><a href="/terms">Terms of Service</a></li>
                    </ul>
                </div>
    
                <div className="footer-column">
                    <h3>Links</h3>
                    <ul>
                        <li><a href="/about">About</a></li>
                        <li><a href="/faq">FAQ</a></li>
                    </ul>
                </div>
    
                <div className="footer-column">
                    <h3>Follow us</h3>
                    <ul>
                        <li><a href="https://www.instagram.com">Instagram</a></li>
                        <li><a href="https://www.facebook.com">Facebook</a></li>
                        <li><a href="https://twitter.com">Twitter | X</a></li>
                    </ul>
                </div>
    
            </div>
    
            <div className="footer-bottom">
                <p>&copy; 2025 CastL. All rights reserved.</p>
            </div>
        </div>
    </footer>
    
);

};

export default Footer;
