import React from "react";
import { motion } from "framer-motion";
import "./Introduction.scss";
import {
  IoLogoLinkedin,
  IoLogoGithub,
  IoLogoInstagram,
  IoLogoFacebook,
} from "react-icons/io5";

const Title = () => {
  return (
    <div className="infoContainer">
      <div>
        <motion.div
          className="lineAnim"
          initial={{ width: 0 }}
          animate={{ width: "90%" }}
          transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
          style={{
            height: 1,
            border: 1,
            backgroundColor: "white",
            opacity: 0.5,
          }}
        />
        <motion.div
          className="name"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          style={{ fontFamily: "open-sans, sans-serif" }}
        >
          <h1>Mian Khizr Shah</h1>
        </motion.div>

        <motion.div
          className="info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          style={{ fontFamily: "open-sans, sans-serif" }}
        >
          <h2>Computer Scientist - Budapest</h2>
        </motion.div>

        <motion.div
          className="infotext"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 0.6 }}
        >
          <p className="infotextsize">
            Made with three.js, Click the Sphere for music made by me.
          </p>
        </motion.div>

        <motion.div
          className="socials"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 0.6 }}
        >
          <a
            href="https://www.linkedin.com/in/mian-khizr-shah-151054231/"
            className="linkedin"
          >
            <IoLogoLinkedin />
          </a>
          <a href="https://github.com/Khizrkshah" className="github">
            <IoLogoGithub />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Title;
