import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard"; // Adjust the path as necessary
import "./Projects.scss";

const query = `
              query {
                viewer {
                  repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}) {
                    nodes {
                      id
                      name
                      description
                      stargazers {
                        totalCount
                      }
                      defaultBranchRef {
                        name
                      }
                      owner {
                        login
                      }
                      url
                      openGraphImageUrl
                    }
                  }
                }
              }
            `;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const lastScrollX = useRef(0);
  const animationFrameRef = useRef(null);

  // Fetch GitHub Repos
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_KEY}`,
          },
          body: JSON.stringify({
            query,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          const filteredProjects = result.data.viewer.repositories.nodes.filter(
            (project) => project.stargazers.totalCount >= 1
          );
          setProjects(filteredProjects);
          console.log(filteredProjects);
        } else {
          console.log(response.statusText);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    cancelAnimationFrame(animationFrameRef.current);
    velocity.current = 0;
    lastScrollX.current = containerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      inertiaScroll();
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      inertiaScroll();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1; // Adjust scroll speed here
    containerRef.current.scrollLeft = scrollLeft.current - walk;
    velocity.current = containerRef.current.scrollLeft - lastScrollX.current;
    lastScrollX.current = containerRef.current.scrollLeft;
  };

  const inertiaScroll = () => {
    const friction = 0.95; // Adjust friction to control deceleration
    let speed = velocity.current;

    const scroll = () => {
      if (Math.abs(speed) < 0.5) return; // Stop if speed is very low

      // Smooth scrolling by adjusting the scrollLeft value
      containerRef.current.scrollLeft += speed;
      speed *= friction; // Reduce speed

      animationFrameRef.current = requestAnimationFrame(scroll);
    };

    scroll();
  };

  return (
    <div className="projectBlock">
      <div className="projectSection">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          viewport={{ once: false }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Projects
        </motion.h1>
        <motion.div
          className="headerLine"
          initial={{ width: 0 }}
          whileInView={{ width: "80%" }}
          viewport={{ once: false }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div
        className="projectsWrapper"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="projectsContainer">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
      <div className="scrollNotification">
        <motion.div
          className="scrollIcon"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="icon"
            initial={{ opacity: 0, x: -50 }}
            animate={{
              opacity: [1, 1, 0],
              x: [-50, 50, -50], // Move left to right and back to left
            }}
            transition={{
              duration: 4, // Duration of the animation
              ease: "easeInOut",
              loop: Infinity,
              repeatType: "loop",
            }}
          >
            <motion.img
              src="/cursor-icon.svg"
              alt="Click and Swipe"
              className="cursorIcon"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [1, 1, 0],
                x: [-50, 50, -50], // Animation path
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
            <motion.img
              src="/finger-icon.svg"
              alt="Swipe"
              className="fingerIcon"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [1, 1, 0],
                x: [-50, 50, -50], // Animation path
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          </motion.div>
          <p>Scroll to see more</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;
