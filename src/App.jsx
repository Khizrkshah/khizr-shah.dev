import { useState } from "react";
import "./App.scss";
import About from "./components/about/About";
import ThreejsComponent from "./components/threejs/ThreejsComponent";
import Sidebar from "./components/sidebar/Sidebar";
import Introduction from "./components/introduction/Introduction";
import Projects from "./components/projects/Projects";

function App() {
  return (
    <div>
      <section id="Homepage">
        <div className="particleContainer">
          <ThreejsComponent />
        </div>
        <div className="introduction">
          <Introduction />
        </div>
        <Sidebar />
      </section>
      <section id="About">
        <About />
      </section>
      <section id="Projects">
        <Projects />
      </section>
      <section id="Contact">Contact</section>
    </div>
  );
}

export default App;
