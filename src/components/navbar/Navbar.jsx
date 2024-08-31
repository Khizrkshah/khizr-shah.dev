import React from "react";
import { motion } from "framer-motion";
import "./Navbar.scss";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="wrapper">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0, scale: 0.5 }}
        >
          Khizr Shah
        </motion.span>
        <div className="social">
          <a href="#">
            <img src="/LinkedIn.png" alt="" />
          </a>
          <a href="#">
            <img src="/GitHub.png" alt="" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
