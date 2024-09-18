import { motion } from "framer-motion"; // Import motion component from Framer Motion for animations
import "./Introduction.scss"; // Import the styling for this component
import {
  IoLogoLinkedin,
  IoLogoGithub,
  IoLogoInstagram,
  IoLogoFacebook,
} from "react-icons/io5"; // Import social media icons from react-icons library

const Title = () => {
  return (
    <div className="infoContainer">
      {" "}
      {/* Main container for the introduction section */}
      <div>
        <motion.div
          className="lineAnim"
          initial={{ width: 0 }} // Initial width of the line animation
          animate={{ width: "90%" }} // Final width of the line animation
          transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }} // Animation duration, delay, and easing function
          style={{
            height: 1, // Height of the line
            border: 1, // Border thickness of the line
            backgroundColor: "white", // Line color
            opacity: 0.5, // Line opacity
          }}
        />
        <motion.div
          className="name"
          initial={{ opacity: 0 }} // Initial opacity for the name
          animate={{ opacity: 1 }} // Final opacity for the name
          transition={{ delay: 2.5, duration: 1 }} // Delay and duration for the name's fade-in animation
          style={{ fontFamily: "open-sans, sans-serif" }} // Custom font styling
        >
          <h1>Mian Khizr Shah</h1> {/* Display the name */}
        </motion.div>

        <motion.div
          className="info"
          initial={{ opacity: 0 }} // Initial opacity for the info text
          animate={{ opacity: 1 }} // Final opacity for the info text
          transition={{ delay: 3, duration: 1 }} // Delay and duration for the info's fade-in animation
          style={{ fontFamily: "open-sans, sans-serif" }} // Custom font styling
        >
          <h2>Computer Scientist - Budapest</h2>{" "}
          {/* Display title and location */}
        </motion.div>

        <motion.div
          className="infotext"
          initial={{ opacity: 0 }} // Initial opacity for the info text
          animate={{ opacity: 1 }} // Final opacity for the info text
          transition={{ delay: 3.5, duration: 0.6 }} // Delay and duration for the text's fade-in animation
        >
          <p className="infotextsize">
            Made with three.js, Click the Sphere for music made by me.{" "}
            {/* Display additional info */}
          </p>
        </motion.div>

        <motion.div
          className="socials"
          initial={{ opacity: 0 }} // Initial opacity for the social icons
          animate={{ opacity: 1 }} // Final opacity for the social icons
          transition={{ delay: 4, duration: 0.6 }} // Delay and duration for the social icons' fade-in animation
        >
          {/* Links to social media profiles */}
          <a
            href="https://www.linkedin.com/in/mian-khizr-shah-151054231/"
            className="linkedin"
          >
            <IoLogoLinkedin /> {/* LinkedIn icon */}
          </a>
          <a href="https://github.com/Khizrkshah" className="github">
            <IoLogoGithub /> {/* GitHub icon */}
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Title; // Export the component for use in other parts of the application
