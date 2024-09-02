import { useState } from "react";
import "./App.scss";
import Navbar from "./components/Navbar/Navbar";
import ParticlesHomepage from "./components/particles/ParticlesHomepage";

function App() {
  return (
    <div>
      <section id="Homepage">
        <Navbar />
        <div className="particleContainer">
          <img className="hero" src="./hero.png"></img>
          <ParticlesHomepage />
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
