import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import './NavBar.css';

function NavBar() {
    const [hoveredDropdown, setHoveredDropdown] = useState(null);

    return (
        <Navbar bg="custom" expand="lg" className="custom-navbar">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto nav-links">
                    <Nav.Link
                        as={Link}
                        to="/clothing"
                        className={`nav-item ${hoveredDropdown === 'clothing' ? 'active' : ''}`}
                        onMouseEnter={() => setHoveredDropdown('clothing')}
                        onMouseLeave={() => setHoveredDropdown(null)}
                    >
                        Clothing
                        <div className={`dropdown-menu ${hoveredDropdown === 'clothing' ? 'show' : ''}`}>
                            <Link className="dropdown-item" to="/clothing/men">Men's Clothing</Link>
                            <Link className="dropdown-item" to="/clothing/women">Women's Clothing</Link>
                            <Link className="dropdown-item" to="/clothing/kids">Kid's Clothing</Link>
                        </div>
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/footwear"
                        className={`nav-item ${hoveredDropdown === 'footwear' ? 'active' : ''}`}
                        onMouseEnter={() => setHoveredDropdown('footwear')}
                        onMouseLeave={() => setHoveredDropdown(null)}
                    >
                        Footwear
                        <div className={`dropdown-menu ${hoveredDropdown === 'footwear' ? 'show' : ''}`}>
                            <Link className="dropdown-item" to="/footwear/men">Men's Footwear</Link>
                            <Link className="dropdown-item" to="/footwear/women">Women's Footwear</Link>
                            <Link className="dropdown-item" to="/footwear/kids">Kid's Footwear</Link>
                        </div>
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/gear"
                        className={`nav-item ${hoveredDropdown === 'gear' ? 'active' : ''}`}
                        onMouseEnter={() => setHoveredDropdown('gear')}
                        onMouseLeave={() => setHoveredDropdown(null)}
                    >
                        Gear
                        <div className={`dropdown-menu ${hoveredDropdown === 'gear' ? 'show' : ''}`}>
                            <Link className="dropdown-item" to="/gear/kitchen">Camp Kitchen</Link>
                            <Link className="dropdown-item" to="/gear/packs">Packs</Link>
                            <Link className="dropdown-item" to="/gear/sleep">Sleep Systems</Link>
                            <Link className="dropdown-item" to="/gear/tents">Tents & Bivvies</Link>
                            <Link className="dropdown-item" to="/gear/additional">Additional Gear</Link>
                        </div>
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/accessories"
                        className={`nav-item ${hoveredDropdown === 'accessories' ? 'active' : ''}`}
                        onMouseEnter={() => setHoveredDropdown('accessories')}
                        onMouseLeave={() => setHoveredDropdown(null)}
                    >
                        Accessories
                        <div className={`dropdown-menu ${hoveredDropdown === 'accessories' ? 'show' : ''}`}>
                            <Link className="dropdown-item" to="/accessories/clothing">Clothing Accessories</Link>
                            <Link className="dropdown-item" to="/accessories/footwear">Footwear Accessories</Link>
                            <Link className="dropdown-item" to="/accessories/backpack">Backpack Accessories</Link>
                        </div>
                    </Nav.Link>
                    {/* Add nav-item class to Cart link */}
                    <Nav.Link
                        as={Link}
                        to="/cart"
                        className="nav-item"
                    >
                        Cart
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavBar;
