import { motion } from "framer-motion"; // Import motion from Framer Motion for animations

// Define animation variants for the Links container
const variants = {
  open: {
    transition: {
      staggerChildren: 0.1, // When open, children will animate one after the other with a delay of 0.1s
    },
  },
  closed: {
    staggeredChildren: 0.05, // When closed, children will animate in reverse with a delay of 0.05s
    staggeredDirection: -1, // Animate children in reverse order when closing
  },
};

// Define animation variants for each link item
const itemVariants = {
  open: {
    y: 0, // Animate to its original Y position (no translation)
    opacity: 1, // Make the link fully visible
  },
  closed: {
    y: 50, // Animate downwards by 50 pixels
    opacity: 0, // Fade out the link
  },
};

// Handle click event when a link is clicked
function handleCLick(setOpen, name) {
  setOpen((prev) => !prev); // Toggle the open state of the menu
  const element = document.getElementById(name); // Get the element by its name (ID)
  if (element) {
    element.scrollIntoView({
      behavior: "smooth", // Smooth scroll to the target element
      block: "start", // Align the element to the top of the viewport
      inline: "nearest", // Scroll horizontally if necessary
    });
  } else {
    console.warn(`Element with class name ${name} not found.`); // Log a warning if the element isn't found
  }
}

// Define the Links component, which contains clickable links
const Links = ({ setOpen }) => {
  const items = ["Homepage", "About", "Projects", "Contact"]; // Define the list of items/sections

  return (
    <motion.div className="links" variants={variants}>
      {" "}
      {/* Apply the container animation */}
      {items.map((item) => (
        <motion.a
          key={item} // Unique key for each item (required for list rendering in React)
          variants={itemVariants} // Apply item-specific animations
          whileHover={{ scale: 1.1 }} // Scale up the link slightly when hovered
          whileTap={{ scale: 0.95 }} // Scale down slightly when clicked
          onClick={() => handleCLick(setOpen, item)} // Handle click event and scroll to the section
        >
          {item} {/* Display the name of the section (link text) */}
        </motion.a>
      ))}
    </motion.div>
  );
};

export default Links; // Export the Links component for use in other parts of the application
