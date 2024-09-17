import { motion } from "framer-motion";

const variants = {
  open: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  closed: {
    staggeredChildren: 0.05,
    staggeredDirection: -1,
  },
};

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
  },
  closed: {
    y: 50,
    opacity: 0,
  },
};

function handleCLick(setOpen, name) {
  setOpen((prev) => !prev);
  const element = document.getElementById(name);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  } else {
    console.warn(`Element with class name ${name} not found.`);
  }
}
const Links = ({ setOpen }) => {
  const items = ["Homepage", "About", "Projects", "Contact"];

  return (
    <motion.div className="links" variants={variants}>
      {items.map((item) => (
        <motion.a
          key={item}
          variants={itemVariants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleCLick(setOpen, item)}
        >
          {item}
        </motion.a>
      ))}
    </motion.div>
  );
};

export default Links;
