import { useState } from "react";
import "./App.scss";
import Navbar from "./components/navbar/Navbar";
import ParticlesHomepage from "./components/particles/ParticlesHomepage";
import ThreejsComponent from "./components/threejs/ThreejsComponent";

function App() {
  return (
    <div>
      <section id="Homepage">
        <Navbar />
        <div className="particleContainer">
          <ThreejsComponent />
        </div>
      </section>
      <section id="Services">Parallax</section>
      <section>Services</section>
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
