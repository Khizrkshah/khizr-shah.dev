import React from "react";
import { motion } from "framer-motion";
import "./Projects.scss";

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      className="projectsCard"
      initial={{ opacity: 0 }} // Start fully transparent
      animate={{ opacity: 0 }} // Keep opacity 0 while out of view
      whileInView={{ opacity: 1 }} // Fade in when in view
      viewport={{
        once: false, // Keep watching as it moves in and out of view
        amount: 0.1, // Start animation when 10% of the card is in view
      }}
      transition={{
        opacity: { duration: 0.5 }, // Fade-in duration
      }}
    >
      <div className="projectHeader">
        <img
          src={project.openGraphImageUrl}
          alt="thumbnail"
          className="thumbnail"
        />
      </div>
      <div className="projectTitle">
        <strong>{project.name}</strong>
      </div>
      <div className="projectDescription">{project.description}</div>
      <div className="projectLinks">
        <a href={project.url} target="_blank" rel="noopener noreferrer">
          Github Repo
        </a>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
