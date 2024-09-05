// About.js
import React from 'react';
import Header from "./Header";
import NavBar from "./NavBar";

function About() {
  return (
    <div className="About">
      <Header/>
      <NavBar/>
      <h2>About Us</h2>
      <p>Welcome to HikeGear Hub! We provide the best gear for your outdoor adventures.</p>
    </div>
  );
}

export default About;
