import React from "react";
import { motion } from "framer-motion";
import "./About.scss";

const About = () => {
  return (
    <div className="aboutContainer">
      {/* About Heading */}
      <motion.h1
        className="aboutHeading"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        About me
      </motion.h1>

      {/* Horizontal Line Animation */}
      <motion.div
        className="horizontalLine"
        initial={{ height: 0 }}
        whileInView={{ height: "70%" }}
        viewport={{ once: false }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ width: 1, border: 1, backgroundColor: "white", opacity: 0.5 }}
      />

      {/* About Content with Fade-in and Bounce-in Animation */}
      <motion.div
        className="aboutContent"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
      >
        <p>
          Hi, I’m Khizr, a 28 year old developer originally from Pakistan, now
          living in Budapest, Hungary for the past five years. I graduated from
          the University of Debrecen, and since then, I’ve been building my
          career with a strong focus on software development and technology.
        </p>
        <p>
          I have worked with a range of technologies, including the Unity game
          engine, where I created a VR application as well as games in C#. I've
          also worked with Java, using JavaFX to develop a game, and have done
          online testing using Selenium. I utilize the Android SDK for Android
          programming and Spring Boot to manage the backend of a virtual reality
          ecommerce project. In terms of web programming, I am adept in
          JavaScript and the React framework. I also have some expertise with
          PostgreSQL and Docker. My love of technology motivates me to
          constantly learn new tools and frameworks while honing my present
          skill set.
        </p>
        <p>
          Beyond my professional endeavors, I embrace an adventurous spirit.
          Climbing and disc golf are two hobbies that fuel my sense of
          exploration and provide a balance to my technical pursuits. These
          activities not only challenge me physically but also foster
          resilience, problem-solving, and a deep appreciation for nature.
        </p>
        <p>
          Outside of work, I’m a music enthusiast. I love producing music,
          playing the guitar, and I’m always looking for ways to improve my
          knowledge of music theory. Video games are also a huge part of my
          life, both as a player and as someone fascinated by the development
          process.
        </p>
        <p>
          I’m always eager to take on new challenges, whether it’s in tech or my
          creative hobbies. Let’s connect and explore how we can collaborate!
        </p>
      </motion.div>
    </div>
  );
};

export default About;
