// Footer.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const location = useLocation();
  const shouldHideFooter = location.pathname.includes('/admin'); // Add more conditions if needed

  if (shouldHideFooter) {
    return null; // Do not render the footer if the condition is met
  }

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
