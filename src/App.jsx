import "./App.scss";
import About from "./components/about/About";
import ThreejsComponent from "./components/threejs/ThreejsComponent";
import Sidebar from "./components/sidebar/Sidebar";
import Introduction from "./components/introduction/Introduction";
import Projects from "./components/projects/Projects";
import ContactMe from "./components/contact/ContactMe";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <div>
      {/* Homepage Section with Three.js animation and introduction */}
      <section id="Homepage">
        <div className="particleContainer">
          <ThreejsComponent /> {/* Three.js background component */}
        </div>
        <div className="introduction">
          <Introduction /> {/* Introduction text/content */}
        </div>
        <Sidebar /> {/* Sidebar navigation */}
      </section>

      {/* About Section */}
      <section id="About">
        <About /> {/* About me content */}
      </section>

      {/* Projects Section */}
      <section id="Projects">
        <Projects /> {/* Displaying projects */}
      </section>

      {/* Contact and Footer Section */}
      <section id="Contact">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            justifyContent: "end", // Aligns Footer to the bottom
          }}
        >
          <ContactMe /> {/* Contact form section */}
          <Footer /> {/* Footer at the bottom of the Contact section */}
        </div>
      </section>
    </div>
  );
}

export default App;
