import { motion } from "framer-motion";
import "./Footer.scss"; // Ensure this imports the correct CSS file

const Footer = () => {
  return (
    <motion.div
      className="footer"
      initial={{ opacity: 0, y: 50 }} // Initial state: hidden and translated down
      whileInView={{ opacity: 1, y: 0 }} // Animate to full visibility when in view
      viewport={{ once: false }} // Animates every time it scrolls into view
      transition={{ duration: 1, ease: "easeInOut" }} // Smooth animation with 1s duration
    >
      <div className="footer-content">
        <div className="footer-info">
          <span>Mian Khizr Shah</span>
          <span>&copy; 2024</span> {/* Copyright information */}
        </div>
        <p>Give me a call: +36307525617</p> {/* Contact information */}
        <a
          href="https://www.flaticon.com/free-icons/portfolio"
          title="portfolio icons"
        >
          Portfolio icons created by Freepik - Flaticon
        </a>
      </div>
    </motion.div>
  );
};

export default Footer;
