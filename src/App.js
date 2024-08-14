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
      <h2>Welcome to HikeGear Hub</h2>
      <p>Your one-stop shop for all your hiking needs.</p>
      <div className="home-image">
        <img src="/Homepage1.jpg" alt="Hiking Gear" />
      </div>
    </div>
  );
}

export default App;
