import { useRef, useState } from "react"; // Import useRef and useState from React
import { motion } from "framer-motion"; // Import the motion component from Framer Motion for animations
import "./ContactMe.scss"; // Import the styling for this component

const ContactMe = () => {
  const formRef = useRef(); // Create a reference to the form element
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  }); // State for form input values

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // Update the corresponding form field
  };

  // Function to handle form submission and send email
  const sendEmail = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Send the form data to the specified email API endpoint
      setSuccessMessage("Please Wait...");
      const response = await fetch(
        "https://portfolio-site.khizrkshah-a83.workers.dev/send-email",
        {
          method: "POST", // Use POST method
          headers: {
            "Content-Type": "application/json", // Set content type as JSON
          },
          body: JSON.stringify(formData), // Convert form data to JSON
        }
      );

      if (response.ok) {
        setSuccessMessage("Email sent successfully!"); // Set success message
        setErrorMessage(""); // Clear any previous error message
        setFormData({ name: "", email: "", message: "" }); // Clear form fields
      } else {
        const errorText = await response.text();
        setErrorMessage(`Failed to send email: ${errorText}`); // Set error message
        setSuccessMessage(""); // Clear any previous success message
      }
    } catch (error) {
      setErrorMessage(`Error sending email: ${error.message}`); // Log any errors that occur during the fetch request
      setSuccessMessage(""); // Clear any previous success message
    }
  };

  return (
    <div className="contactContainer">
      <div className="contactImage">
        <motion.svg
          className="contactIcon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="100"
          height="100"
          fill="none"
          viewport={{ once: false }}
          whileInView={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <path
            d="M1 5.5A2.5 2.5 0 0 1 3.5 3h17A2.5 2.5 0 0 1 23 5.5v13A2.5 2.5 0 0 1 20.5 21h-17A2.5 2.5 0 0 1 1 18.5v-13Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1 5l11 7 11-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </div>
      <div className="contactBox">
        <motion.div
          className="contactMe"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h2
            className="contactTitle"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Contact Me
          </motion.h2>
          {successMessage && <p className="successMessage">{successMessage}</p>}{" "}
          {/* Display success message */}
          {errorMessage && <p className="errorMessage">{errorMessage}</p>}{" "}
          {/* Display error message */}
          <motion.form
            ref={formRef}
            className="contactForm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            onSubmit={sendEmail}
          >
            <motion.input
              type="text"
              name="name"
              required
              value={formData.name} // Controlled input
              onChange={handleChange} // Update value on change
              placeholder="Your Name"
              className="contactInput"
            />
            <motion.input
              type="email"
              name="email"
              required
              value={formData.email} // Controlled input
              onChange={handleChange} // Update value on change
              placeholder="Your Email"
              className="contactInput"
            />
            <motion.textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              className="contactTextarea"
              value={formData.message} // Controlled input
              onChange={handleChange} // Update value on change
            />
            <motion.button
              type="submit"
              className="contactButton"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactMe; // Export the component for use in other parts of the application
