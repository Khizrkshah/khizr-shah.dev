import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Sidebar.scss";
import ToggleButton from "./toggleButton/ToggleButton";
import Links from "./links/Links";

const variants = {
  open: {
    clipPath: "circle(1200px at 50px 50px)",
    transition: {
      type: "spring",
      stiffness: 20,
    },
  },
  closed: {
    clipPath: "circle(30px at 50px 50px)",
    x: [0, -0.5, 0.5, -0.5, 0], // Very slight left-right movement
    y: [0, 0.5, -0.5, 0.5, 0], // Very slight up-down movement
    transition: {
      clipPath: {
        delay: 0.5,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
      x: {
        duration: 0.6, // Duration of the wobble
        ease: "easeInOut", // Smooth easing
        repeat: Infinity, // Repeats the wobble infinitely
        repeatType: "loop", // Continuous looping
      },
      y: {
        duration: 0.6, // Duration of the wobble
        ease: "easeInOut", // Smooth easing
        repeat: Infinity, // Repeats the wobble infinitely
        repeatType: "loop", // Continuous looping
      },
    },
  },
};

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // New state to track mounting

  // useEffect to set isMounted to true once component has mounted
  useEffect(() => {
    setIsMounted(true); // Only after mount should we show the sidebar
  }, []);

  return (
    // Only render motion.div once isMounted is true to avoid initial flash
    isMounted && (
      <motion.div className="sidebar" animate={open ? "open" : "closed"}>
        <motion.div className="bg" variants={variants}>
          <Links setOpen={setOpen} />
        </motion.div>
        <ToggleButton setOpen={setOpen} />
      </motion.div>
    )
  );
};

export default Sidebar;
