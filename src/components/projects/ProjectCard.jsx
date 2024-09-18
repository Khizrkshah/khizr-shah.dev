import { motion } from "framer-motion"; // Import motion component from Framer Motion for animations
import "./Projects.scss"; // Import the styling for the ProjectCard component

const ProjectCard = ({ project }) => {
  // Define the ProjectCard component, receiving project as a prop
  return (
    <motion.div
      className="projectsCard" // Class for styling the project card
      initial={{ opacity: 0 }} // Initial opacity, starting fully transparent
      animate={{ opacity: 0 }} // Keep opacity 0 while out of view
      whileInView={{ opacity: 1 }} // Fade in when at least 10% of the card is in view
      viewport={{
        once: false, // Keeps tracking the element as it comes in and out of view
        amount: 0.1, // Start the animation when 10% of the card is in view
      }}
      transition={{
        opacity: { duration: 0.5 }, // Duration of the fade-in animation
      }}
    >
      <div className="projectHeader">
        {" "}
        {/* Container for the project image */}
        <img
          src={project.openGraphImageUrl} // Image URL from project data
          alt="thumbnail" // Alt text for the image
          className="thumbnail" // Class for styling the thumbnail
        />
      </div>
      <div className="projectTitle">
        {" "}
        {/* Display the project title */}
        <strong>{project.name}</strong>{" "}
        {/* Strong emphasis on the project name */}
      </div>
      <div className="projectDescription">
        {" "}
        {/* Display the project description */}
        {project.description} {/* Project description content */}
      </div>
      <div className="projectLinks">
        {" "}
        {/* Section for project links (e.g., GitHub) */}
        <a href={project.url} target="_blank" rel="noopener noreferrer">
          {" "}
          {/* Link to the project's GitHub repository */}
          Github Repo
        </a>
      </div>
    </motion.div>
  );
};

export default ProjectCard; // Export the ProjectCard component for use in other parts of the application
