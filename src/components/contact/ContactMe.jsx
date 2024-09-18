import { useRef } from "react"; // Import the useRef hook from React
import { motion } from "framer-motion"; // Import the motion component from Framer Motion for animations
import "./ContactMe.scss"; // Import the styling for this component

const ContactMe = () => {
  const formRef = useRef(); // Create a reference to the form element

  // Function to handle form submission and send email
  const sendEmail = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Collect form data using FormData API
    const formData = new FormData(formRef.current);
    const data = {
      form_name: formData.get("name"), // Get the 'name' input value
      form_email: formData.get("email"), // Get the 'email' input value
      message: formData.get("message"), // Get the 'message' textarea value
    };

    try {
      // Send the form data to the specified email API endpoint
      const response = await fetch(
        "https://portfolio-site.khizrkshah-a83.workers.dev/send-email",
        {
          method: "POST", // Use POST method
          headers: {
            "Content-Type": "application/json", // Set content type as JSON
          },
          body: JSON.stringify(data), // Convert form data to JSON
        }
      );

      if (response.ok) {
        console.log("SUCCESS!"); // Log success if email was sent successfully
        // Optionally, show a success message or clear the form
      } else {
        const errorText = await response.text();
        console.error("FAILED...", errorText); // Log error if sending email failed
        // Optionally, show an error message to the user
      }
    } catch (error) {
      console.error("Error sending email:", error.message); // Log any errors that occur during the fetch request
      // Optionally, show an error message to the user
    }
  };

  return (
    <div className="contactContainer">
      {" "}
      {/* Main container for the contact form */}
      <div className="contactImage">
        {" "}
        {/* Container for the contact icon */}
        <motion.svg
          className="contactIcon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="100"
          height="100"
          fill="none"
          viewport={{ once: false }}
          whileInView={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }} // Animate the icon when in view
          transition={{ duration: 1, ease: "easeInOut" }} // Animation settings for the icon
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
        {" "}
        {/* Container for the contact form and title */}
        <motion.div
          className="contactMe"
          initial={{ opacity: 0, scale: 0.9 }} // Initial state of the form container
          whileInView={{ opacity: 1, scale: 1 }} // Animation when the form comes into view
          viewport={{ once: false }}
          transition={{ duration: 0.6, ease: "easeOut" }} // Animation settings
        >
          <motion.h2
            className="contactTitle"
            initial={{ opacity: 0, y: -20 }} // Initial animation state for the title
            whileInView={{ opacity: 1, y: 0 }} // Title animation when in view
            viewport={{ once: false }}
            transition={{ duration: 0.5, ease: "easeOut" }} // Animation settings for the title
          >
            Contact Me {/* Title text */}
          </motion.h2>

          <motion.form
            ref={formRef} // Form reference for accessing form data
            className="contactForm"
            initial={{ opacity: 0, y: 20 }} // Initial animation state for the form
            whileInView={{ opacity: 1, y: 0 }} // Form animation when in view
            viewport={{ once: false }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} // Animation settings with a delay
            onSubmit={sendEmail} // Event handler for form submission
          >
            <motion.input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              className="contactInput" // Input field for user's name
            />
            <motion.input
              type="email"
              name="email"
              required
              placeholder="Your Email"
              className="contactInput" // Input field for user's email
            />
            <motion.textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              className="contactTextarea" // Textarea for user's message
            />
            <motion.button
              type="submit"
              className="contactButton"
              whileHover={{ scale: 1.05 }} // Button hover effect
              whileTap={{ scale: 0.95 }} // Button tap effect
            >
              Send {/* Button text */}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactMe; // Export the component for use in other parts of the application
