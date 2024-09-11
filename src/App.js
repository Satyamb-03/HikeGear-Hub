import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';  // Importing main stylesheet

// Importing components for different sections of the app
import Clothing from './components/Clothing/Clothing';
import MensClothing from './components/Clothing/MensClothing';
import WomensClothing from './components/Clothing/WomensClothing';
import KidsClothing from './components/Clothing/KidsClothing';
import Footwear from './components/Footwear/Footwear';
import MenFootwear from './components/Footwear/MenFootwear';
import WomenFootwear from './components/Footwear/WomenFootwear';
import KidFootwear from './components/Footwear/KidFootwear';
import Gear from './components/Gear/Gear';
import SleepSystem from './components/Gear/SleepSystem';
import Packs from './components/Gear/Packs';
import Tents from './components/Gear/Tents';
import Accessories from './components/Accessories/Accessories';
import Contact from './components/Static/Contact';
import About from './components/Static/About';
import PrivacyPolicy from './components/Static/PrivacyPolicy';
import Footer from './components/Footer';  // Footer component
import Cart from './Cart';  // Cart page
import CampKitchen from './components/Gear/CampKitchen';  // Gear component
import { CartProvider } from './components/Context/CartContext';  // Cart context for managing cart state
import { UserAuthProvider } from './components/Context/UserAuth';  // Auth context for managing user authentication
import SignIn from './SignIn';  // Sign-in page
import SignUP from './SignUP';  // Sign-up page
import SupplierDashboard from './components/Dashboards/SupplierDashboard';  // Supplier dashboard
import UserDashboard from './components/Dashboards/UserDashboard';  // User dashboard
import AdditionalGear from './components/Gear/AdditionalGear';  // Additional gear page
import AdminDashboard from './components/Dashboards/AdminDashboard';  // Admin dashboard
import ClothingAccess from './components/Accessories/ClothingAccess';  // Clothing accessories
import FootwearAccess from './components/Accessories/FootwearAccess';  // Footwear accessories
import BagpackAccess from './components/Accessories/BagpackAccess';  // Backpack accessories
import ProtectedSupplierDashboard from './SupplierProtectedRoute';  // Protected route for supplier
import { AdminRoute } from './ProtectedRoute';  // Protected route for admin
import Header from './components/Header';  // Header component
import NavBar from './components/NavBar';  // Navbar component
import Home from './Home';  // Home page
import Checkout from './Checkout';  // Checkout page

function App() {
  return (
    <UserAuthProvider>  {/* Providing user authentication context to the app */}
      <CartProvider>  {/* Providing cart context to the app */}
        <Router>  {/* Enabling routing in the app */}
          <div className="App">
            <Header />  {/* Rendering header */}
            <NavBar />  {/* Rendering navigation bar */}

            <main>
              <Routes>  {/* Defining routes for various components */}
                <Route path="/" element={<Home />} />  {/* Home route */}
                <Route path="/clothing" element={<Clothing />} />  {/* Clothing category */}
                <Route path="/clothing/men" element={<MensClothing />} />  {/* Men's clothing subcategory */}
                <Route path="/clothing/women" element={<WomensClothing />} />  {/* Women's clothing subcategory */}
                <Route path="/clothing/kids" element={<KidsClothing />} />  {/* Kids' clothing subcategory */}
                <Route path="/footwear" element={<Footwear />} />  {/* Footwear category */}
                <Route path="/footwear/men" element={<MenFootwear />} />  {/* Men's footwear subcategory */}
                <Route path="/footwear/women" element={<WomenFootwear />} />  {/* Women's footwear subcategory */}
                <Route path="/footwear/kids" element={<KidFootwear />} />  {/* Kids' footwear subcategory */}
                <Route path="/gear" element={<Gear />} />  {/* Gear category */}
                <Route path="/accessories" element={<Accessories />} />  {/* Accessories category */}
                <Route path="/accessories/backpack" element={<BagpackAccess />} />  {/* Backpack accessories */}
                <Route path="/accessories/clothing" element={<ClothingAccess />} />  {/* Clothing accessories */}
                <Route path="/accessories/footwear" element={<FootwearAccess />} />  {/* Footwear accessories */}
                
                <Route path="/checkout" element={<Checkout />} />  {/* Checkout page */}
                <Route path="/contact" element={<Contact />} />  {/* Contact page */}
                <Route path="/about" element={<About />} />  {/* About page */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />  {/* Privacy policy page */}
                <Route path="/cart" element={<Cart />} />  {/* Cart page */}
                <Route path="/signin" element={<SignIn />} />  {/* Sign-in page */}
                <Route path="/signup" element={<SignUP />} />  {/* Sign-up page */}

                {/* Routes for gear subcategories */}
                <Route path="/gear/sleep" element={<SleepSystem />} />  {/* Sleep system gear */}
                <Route path="/gear/kitchen" element={<CampKitchen />} />  {/* Camp kitchen gear */}
                <Route path="/gear/packs" element={<Packs />} />  {/* Packs gear */}
                <Route path="/gear/tents" element={<Tents />} />  {/* Tents gear */}
                <Route path="/gear/additional" element={<AdditionalGear />} />  {/* Additional gear */}

                {/* Protected route for admin */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />  {/* Admin dashboard route */}
                
                {/* User and supplier dashboards */}
                <Route path="/user-dashboard" element={<UserDashboard />} />  {/* User dashboard */}
                <Route path="/supplier-dashboard" element={<ProtectedSupplierDashboard><SupplierDashboard /></ProtectedSupplierDashboard>} />  {/* Protected supplier dashboard */}
              </Routes>
            </main>

            <Footer />  {/* Rendering footer */}
          </div>
        </Router>
      </CartProvider>
    </UserAuthProvider>
  );
}

export default App;  {/* Exporting the App component */}
