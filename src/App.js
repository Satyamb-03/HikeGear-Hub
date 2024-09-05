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
import SleepSystem from './SleepSystem';
import Packs from './Packs';
import Tents from './Tents';
import Accessories from './Accessories';
import Contact from './Contact';
import About from './About';
import PrivacyPolicy from './PrivacyPolicy';
import Footer from './Footer';
import Cart from './Cart';
import CampKitchen from './CampKitchen';
import { CartProvider } from './CartContext';
import { UserAuthProvider } from './UserAuth';
import SignIn from './SignIn';
import SignUP from './SignUP';
import SupplierDashboard from './SupplierDashboard';
import UserDashboard from './UserDashboard';
import AdditionalGear from './AdditionalGear';
import AdminDashboard from './AdminDashboard';
import ClothingAccess from './ClothingAccess';
import FootwearAccess from './FootwearAccess';
import BagpackAccess from './BagpackAccess';
import Header from './Header';
import Home from './Home';

function App() {
  return (
    <UserAuthProvider>
      <CartProvider>
      
        <Router>
          <div className="App">
            
            
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
                <Route path="/accessories/clothing" element={<ClothingAccess />} />
                <Route path="/accessories/footwear" element={<FootwearAccess />} />

                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUP />} />
                <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path='/gear/sleep' element={<SleepSystem />} />
                <Route path='/gear/kitchen' element={<CampKitchen />} />
                <Route path='/gear/packs' element={<Packs />} />
                <Route path='/gear/tents' element={<Tents />} />
                <Route path='/gear/additional' element={<AdditionalGear />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      
      </CartProvider>
    </UserAuthProvider>
  );
}



export default App;
