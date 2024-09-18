import { useState } from "react";
import "./App.scss";
import About from "./components/about/About";
import ThreejsComponent from "./components/threejs/ThreejsComponent";
import Sidebar from "./components/sidebar/Sidebar";
import Introduction from "./components/introduction/Introduction";

console.log(import.meta.env.VITE_GITHUB_API_KEY);
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
      <section id="Projects">Parallax</section>
      <section>Project1</section>
      <section>Project2</section>
      <section>Project3</section>
      <section>Project4</section>
      <section>Project5</section>
      <section id="Contact">Contact</section>
    </div>
  );
}

export default App;
