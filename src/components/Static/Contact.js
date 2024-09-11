import React from 'react';
import './About.css';

function Contact() {
  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <p>We'd love to hear from you! Whether you have questions, need assistance, or want to give feedback, feel free to get in touch.</p>
      
      <div className="contact-details">
        <p><strong>Email:</strong> <a href="mailto:support@hikegearhub.com">support@hikegearhub.com</a></p>
        <p><strong>Phone:</strong> +64 123 456 789</p>
        <p><strong>Address:</strong> 165 Queen Street, CBD, Auckland 1010, New Zealand</p>
      </div>

      <p>Our team is available 7 days a week from 9 AM to 5 PM (NZT). We strive to respond to all inquiries 24 hours on calls</p>
    </div>
  );
}

export default Contact;
