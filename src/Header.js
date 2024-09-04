import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from './UserAuth'; // Adjust the path if necessary
import './Header.css';

function Header() {
    const { user, signOutUser } = useUserAuth(); // Use signOutUser instead of logOut
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOutUser(); // Call signOutUser function
            console.log("User logged out");
            navigate("/"); // Redirect to home after logout
        } catch (error) {
            console.error("Logout Error:", error.message); // Log any logout errors
        }
    };

    return (
        <header className="App-header">
            <div className="header-content">
                <Link to="/" className="site-title-link">
                    <h1 className="site-title">HikeGear Hub</h1>
                </Link>
                <div className="auth-links">
                    {user ? (
                        <button onClick={handleLogout} className="logout-button">
                            Log Out
                        </button>
                    ) : (
                        <>
                            <Link to="/signin">Sign In</Link>
                            <Link to="/signup">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
