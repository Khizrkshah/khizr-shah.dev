import { motion } from "framer-motion";

// ToggleButton component receives setOpen function as a prop
const ToggleButton = ({ setOpen }) => {
  return (
    <button onClick={() => setOpen((prev) => !prev)}>
      {/* SVG icon used for the toggle button */}
      <svg width="23" height="23" viewBox="0 0 23 23">
        {/* Motion path for the top line of the menu icon */}
        <motion.path
          strokeWidth="3" // Width of the path stroke
          stroke="#000000" // Color of the path stroke
          strokeLinecap="round" // Rounded end caps for the path
          variants={{
            closed: { d: "M 2 3 L 20 3.5" }, // Path definition when closed
            open: { d: "M 3 16.5 L 17 2.5" }, // Path definition when open
          }}
        />
        {/* Motion path for the middle line of the menu icon */}
        <motion.path
          strokeWidth="3" // Width of the path stroke
          stroke="#000000" // Color of the path stroke
          strokeLinecap="round" // Rounded end caps for the path
          d="M 2 9.423 L 20 9.423" // Static path definition
          variants={{
            closed: { opacity: 1 }, // Fully visible when closed
            open: { opacity: 0 }, // Hidden when open
          }}
        />
        {/* Motion path for the bottom line of the menu icon */}
        <motion.path
          strokeWidth="3" // Width of the path stroke
          stroke="#000000" // Color of the path stroke
          strokeLinecap="round" // Rounded end caps for the path
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" }, // Path definition when closed
            open: { d: "M 3 2.5 L 17 16.346" }, // Path definition when open
          }}
        />
      </svg>
    </button>
  );
};

export default ToggleButton;
