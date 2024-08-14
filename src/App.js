// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Clothing from './Clothing';
import Footwear from './Footwear';
import Gear from './Gear';
import Accessories from './Accessories';
import Contact from './Contact';
import About from './About';
import PrivacyPolicy from './PrivacyPolicy';
import Footer from './Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>
            <Link to="/" className="logo-link">HikeGear Hub</Link>
          </h1>
          <div className="auth-buttons">
            <button>Sign In</button>
            <button>Sign Up</button>
          </div>
        </header>
        
        <nav className="App-nav">
          <ul>
            <li><Link to="/clothing">Clothing</Link></li>
            <li><Link to="/footwear">Footwear</Link></li>
            <li><Link to="/gear">Gear</Link></li>
            <li><Link to="/accessories">Accessories</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clothing" element={<Clothing />} />
          <Route path="/footwear" element={<Footwear />} />
          <Route path="/gear" element={<Gear />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="Home">
      <h2>Welcome to Hike Gear Hub – Your Ultimate Adventure Partner!</h2>
      <p>
        Planning your next outdoor adventure? Whether you’re a seasoned hiker or a first-time explorer, we’ve got you covered with top-quality hiking gear available for rent. From tents to trekking poles, and everything in between, Hike Gear Hub offers a wide range of equipment to suit all your needs.
      </p>
      <h3>Why Rent with Us?</h3>
      <ul>
        <li><strong>Premium Gear:</strong> Access top brands and well-maintained equipment without the hassle of ownership.</li>
        <li><strong>Affordable Prices:</strong> Enjoy great rates and flexible rental periods that fit your schedule and budget.</li>
        <li><strong>Convenient Shopping:</strong> Easily browse our extensive product catalog, create an account, and manage your rentals all in one place.</li>
      </ul>
      <h3>Start Your Adventure Now!</h3>
      <p>
        Don’t let a lack of gear hold you back. Explore our catalog, choose your gear, and get ready to hit the trails. Your next adventure is just a few clicks away!
      </p>
      <div className="home-image">
        <img src="/Homepage1.jpg" alt="Hiking Gear" />
      </div>
    </div>
  );
}


export default App;
