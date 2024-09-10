import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from './UserAuth'; // Adjust the path if necessary
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { db } from "./firebase"; // Firestore initialization
import './Header.css';

function Header() {
    const { user, signOutUser } = useUserAuth();
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);

    // Fetch user role from Firestore
    useEffect(() => {
        const fetchUserRole = async () => {
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setUserRole(userData.role);
                }
            }
        };
        fetchUserRole();
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOutUser();
            console.log("User logged out");
            navigate("/"); // Redirect to home after logout
        } catch (error) {
            console.error("Logout Error:", error.message);
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
                        <>
                            {/* Display "User Dashboard" for non-admin users */}
                            {userRole && userRole !== 'admin' && (
                                <Link to={`/${userRole}-dashboard`} className="dashboard-button">
                                    User Dashboard
                                </Link>
                            )}

                            {/* Display "Admin Dashboard" for admin users */}
                            {userRole === 'admin' && (
                                <Link to="/admin" className="dashboard-button">
                                    Admin Dashboard
                                </Link>
                            )}

                            <button onClick={handleLogout} className="logout-button">
                                Log Out
                            </button>
                        </>
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
