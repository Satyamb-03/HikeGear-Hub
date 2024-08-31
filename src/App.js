import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

import Clothing from './Clothing';
import MensClothing from './MensClothing';
import WomensClothing from './WomensClothing';
import KidsClothing from './KidsClothing';
import Footwear from './Footwear';
import MenFootwear from './MenFootwear';
import WomenFootwear from './WomenFootwear';
import KidFootwear from './KidFootwear';
import Gear from './Gear';
import FootwearAccess from './FootwearAccess';
import Headwear from './Headwear';
import SleepSystem from './SleepSystem';
import Packs from './Packs';
import Tents from './Tents';
import BagpackAccess from './BagpackAccess';
import Accessories from './Accessories';
import Contact from './Contact';
import About from './About';
import PrivacyPolicy from './PrivacyPolicy';
import Footer from './Footer';
import Cart from './Cart';
import CampKitchen from './CampKitchen';
import AdditionalGear from './AdditionalGear';
import { CartProvider } from './CartContext';
import { UserAuthContextProvider } from './UserAuth';
import SignIn from './SignIn';
import SignUp from './SignUP';
import SupplierDashboard from './SupplierDashboard';
import { CardLink } from 'react-bootstrap';

function App() {
  return (
    <UserAuthContextProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <header className="App-header">
              <h1>
                <Link to="/" className="logo-link">HikeGear Hub</Link>
              </h1>
              <div className="auth-buttons">
                <Link to="/signin"><button>Sign In</button></Link>
                <Link to="/signup"><button>Sign Up</button></Link>
              </div>
            </header>
            
            <nav className="App-nav">
              <ul>
                <li className="dropdown">
                  <Link to="/clothing" className="dropbtn">Clothing</Link>
                  <div className="dropdown-content">
                    <Link to="/clothing/men">Men's Clothing</Link>
                    <Link to="/clothing/women">Women's Clothing</Link>
                    <Link to="/clothing/kids">Kid's Clothing</Link>
                  </div>
                </li>
                <li className="dropdown">
                  <Link to="/footwear" className="dropbtn">Footwear</Link>
                  <div className="dropdown-content">
                    <Link to="/footwear/men">Men's Footwear</Link>
                    <Link to="/footwear/women">Women's Footwear</Link>
                    <Link to="/footwear/kids">Kid's Footwear</Link>
                  </div>
                </li>
                <li className="dropdown">
                  <Link to="/gear" className="dropbtn">Gear</Link>
                  <div className="dropdown-content">
                    <Link to="/gear/kitchen">Camp Kitchen</Link>
                    <Link to="/gear/packs">Packs</Link>
                    <Link to="/gear/sleep">Sleep Systems</Link>
                    <Link to="/gear/tents">Tents & Bivvies</Link>
                    <Link to="/gear/additional">Additional Gear</Link>
                  </div>
                </li>
                <li className="dropdown">
                  <Link to="/accessories" className="dropbtn">Accessories</Link>
                  <div className="dropdown-content">
                    <Link to="/accessories/headwear">Headwear</Link>
                    <Link to="/accessories/clothing">Clothing Accessories</Link>
                    <Link to="/accessories/footwear">Footwear Accessories</Link>
                    <Link to="/accessories/backpack">Backpack Accessories</Link>
                  </div>
                </li>
                <li>
                  <Link to="/cart" className="cart-link">Cart</Link>
                </li>
              </ul>
            </nav>

            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/clothing" element={<Clothing />} />
                <Route path="/clothing/men" element={<MensClothing />} />
                <Route path="/clothing/women" element={<WomensClothing />} />
                <Route path="/clothing/kids" element={<KidsClothing />} />
                <Route path="/footwear" element={<Footwear />} />
                <Route path="/footwear/men" element={<MenFootwear />} />
                <Route path="/footwear/women" element={<WomenFootwear />} />
                <Route path="/footwear/kids" element={<KidFootwear />} />
                <Route path="/gear" element={<Gear />} />
                <Route path="/accessories" element={<Accessories />} />
                <Route path="/accessories/backpack" element={<BagpackAccess />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
                <Route path='/gear/sleep' element={<SleepSystem />} />
                <Route path='/gear/kitchen' element={<CampKitchen/>} />
                <Route path='/gear/Packs' element={<Packs />} />
                <Route path='/gear/Tents' element={<Tents />}/>
                <Route path='/gear/Additional' element={<AdditionalGear/>}/>
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </UserAuthContextProvider>
  );
}

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
      <Link to="/supplier-dashboard">
        <button className="go-to-dashboard-button">Go to Supplier Dashboard</button>
      </Link>
    </div>
  );
}

export default App;
