import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard"; // Component to display individual projects
import "./Projects.scss";

const Projects = () => {
  const [projects, setProjects] = useState([]); // State to hold projects data
  const [loading, setLoading] = useState(true); // Loading state while fetching data
  const containerRef = useRef(null); // Reference to the scrollable project container
  const [isDragging, setIsDragging] = useState(false); // State for tracking drag status
  const startX = useRef(0); // To store initial X-coordinate when dragging starts
  const scrollLeft = useRef(0); // To store the initial scroll position when dragging starts
  const velocity = useRef(0); // To keep track of the scroll velocity
  const lastScrollX = useRef(0); // To store the last known scroll position
  const animationFrameRef = useRef(null); // To store the animation frame ID for inertia scrolling

  // Fetch GitHub repositories
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "https://portfolio-site.khizrkshah-a83.workers.dev/github-repos"
        );

        if (response.ok) {
          const result = await response.json();
          const filteredProjects = result.data.viewer.repositories.nodes.filter(
            (project) => project.stargazers.totalCount >= 1 // Filter projects based on stars
          );
          setProjects(filteredProjects);
        } else {
          console.log(response.statusText);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Data fetched, stop showing loading indicator
      }
    };

    fetchProjects();
  }, []);

  // Handle mouse down event for drag-to-scroll functionality
  const handleMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.pageX - containerRef.current.offsetLeft; // Store initial X position
    scrollLeft.current = containerRef.current.scrollLeft; // Store initial scroll position
    cancelAnimationFrame(animationFrameRef.current); // Stop any previous inertia scroll
    velocity.current = 0; // Reset velocity
    lastScrollX.current = containerRef.current.scrollLeft; // Store last known scroll position
  };

  // Handle mouse leave event to stop dragging and initiate inertia scroll
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      inertiaScroll(); // Apply inertia scroll
    }
  };

  // Handle mouse up event to stop dragging and apply inertia scroll
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      inertiaScroll(); // Apply inertia scroll
    }
  };

  // Handle mouse move event to allow scrolling while dragging
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft; // Current mouse X position
    const walk = (x - startX.current) * 1; // Calculate scroll distance (adjust speed multiplier here)
    containerRef.current.scrollLeft = scrollLeft.current - walk; // Update scroll position
    velocity.current = containerRef.current.scrollLeft - lastScrollX.current; // Update velocity
    lastScrollX.current = containerRef.current.scrollLeft; // Update last scroll position
  };

  // Inertia scroll logic to smoothly scroll after drag ends
  const inertiaScroll = () => {
    const friction = 0.95; // Friction value to slow down the scroll
    let speed = velocity.current;

    const scroll = () => {
      if (Math.abs(speed) < 0.5) return; // Stop if the speed is very low

      containerRef.current.scrollLeft += speed; // Continue scrolling
      speed *= friction; // Apply friction to reduce speed

      animationFrameRef.current = requestAnimationFrame(scroll); // Continue animation
    };

    scroll();
  };

  return (
    <div className="projectBlock">
      <div className="projectSection">
        {/* Projects title animation */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }} // Initial position: off-screen (above)
          viewport={{ once: false }}
          whileInView={{ opacity: 1, y: 0 }} // Animate into view
          transition={{ duration: 1, ease: "easeOut" }} // Duration and easing settings
        >
          Projects
        </motion.h1>
        {/* Animated line under the title */}
        <motion.div
          className="headerLine"
          initial={{ width: 0 }}
          whileInView={{ width: "80%" }} // Expands to 80% of container width
          viewport={{ once: false }}
          transition={{ duration: 1, ease: "easeOut" }} // Animation duration and easing
        />
      </div>

      {loading ? ( // Show loading indicator if data is still being fetched
        <motion.div
          className="loadingIndicator"
          initial={{ x: "-100%" }} // Start off-screen
          animate={{ x: "0%" }} // Animate into view
          transition={{ duration: 0.5, ease: "easeOut" }} // Animation settings
        >
          <p>Loading projects...</p>
        </motion.div>
      ) : (
        // Projects container with drag-to-scroll functionality
        <div
          className="projectsWrapper"
          ref={containerRef}
          onMouseDown={handleMouseDown} // Handle mouse down event
          onMouseLeave={handleMouseLeave} // Handle mouse leave event
          onMouseUp={handleMouseUp} // Handle mouse up event
          onMouseMove={handleMouseMove} // Handle mouse move event
        >
          <div className="projectsContainer">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} /> // Render individual project cards
            ))}
          </div>
        </div>
      )}

      {/* Scroll notification and icon animation */}
      <div className="scrollNotification">
        <motion.div
          className="scrollIcon"
          initial={{ opacity: 0, y: 20 }} // Start off-screen (below)
          whileInView={{ opacity: 1, y: 0 }} // Animate into view
          viewport={{ once: false }}
          transition={{ duration: 1, ease: "easeOut" }} // Animation duration and easing
        >
          {/* Cursor and finger icons animation for PC and mobile */}
          <motion.div
            className="icon"
            initial={{ opacity: 0, x: -50 }} // Start off-screen (left)
            whileInView={{
              opacity: [1, 1, 0], // Fade in and out
              x: [-50, 50, -50], // Move left to right and back to left
            }}
            viewport={{ once: false }}
            transition={{
              duration: 4, // Duration of the animation
              ease: "easeInOut",
              repeatType: "loop", // Loop the animation
            }}
          >
            {/* Cursor icon */}
            <motion.img
              src="/cursor-icon.svg"
              alt="Click and Swipe"
              className="cursorIcon"
              initial={{ opacity: 0 }}
              whileInView={{
                opacity: [1, 1, 0], // Animation sequence
                x: [-50, 50, -50], // Move across the screen
              }}
              viewport={{ once: false }}
              transition={{
                duration: 4,
                ease: "easeInOut",
              }}
            />
            {/* Finger icon for mobile */}
            <motion.img
              src="/finger-icon.svg"
              alt="Swipe"
              className="fingerIcon"
              initial={{ opacity: 0 }}
              whileInView={{
                opacity: [1, 1, 0], // Animation sequence
                x: [-50, 50, -50], // Move across the screen
              }}
              viewport={{ once: false }}
              transition={{
                duration: 4,
                ease: "easeInOut",
              }}
            />
          </motion.div>
          <p>Scroll to see more</p> {/* Scroll instruction */}
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;
