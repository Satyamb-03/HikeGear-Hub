import React from "react";
import { Link } from "react-router-dom";
 

function Home() {
    return (
      <div className="Home">
         
        <div className="home-image">
          <img src="/Homepage1.jpg" alt="Hiking Gear" />
        </div>
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
        <Link to="/user-dashboard">
          <button className="go-to-dashboard-button">Go to User Dashboard</button>
        </Link>
        <Link to="/admin-dashboard">
          <button className="go-to-dashboard-button">Go to Admin Dashboard</button>
        </Link>
      </div>
    );
  }

export default Home;