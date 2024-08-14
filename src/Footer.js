// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="App-footer">
      <div className="footer-links">
        <Link to="/contact">Contact Us</Link>
        <Link to="/about">About Us</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
      </div>
      <div className="footer-copyright">
        <p>© {new Date().getFullYear()} HikeGear Hub. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
