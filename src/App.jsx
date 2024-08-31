import { useState } from "react";
import "./App.scss";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div>
      <section>
        <Navbar />
      </section>
      <section>Parallax</section>
      <section>Services</section>
      <section>Project1</section>
      <section>Project2</section>
      <section>Project3</section>
      <section>Project4</section>
      <section>Project5</section>
      <section>Contact</section>
    </div>
  );
}

export default App;
