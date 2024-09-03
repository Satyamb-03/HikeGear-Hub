import React from "react";
import { Nav } from "react-bootstrap";
import {Link} from "react-router-dom";

function Header(){
    return(
        <div>
            <header className="App-header">
              <h1>
                <Link to="/" className="logo-link">HikeGear Hub</Link>
              </h1>
              <div className="auth-buttons">
                <Link to="/signin"><button>Sign In</button></Link>
                <Link to="/signup"><button>Sign Up</button></Link>
              </div>
            </header>
            
            <Nav className="App-nav">
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
                
                    <Link to="/accessories/clothing">Clothing Accessories</Link>
                    <Link to="/accessories/footwear">Footwear Accessories</Link>
                    <Link to="/accessories/backpack">Backpack Accessories</Link>
                  </div>
                </li>
                <li>
                  <Link to="/cart" className="cart-link">Cart</Link>
                </li>
              </ul>
            </Nav>
        </div>
    );
}

export default Header();