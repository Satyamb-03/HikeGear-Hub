import React, { useState, useEffect } from "react"; // Keep this import
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Button } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { useUserAuth } from "./UserAuth"; // Adjust the import path if needed
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase"; // Adjust the import path if needed
import './SignIn.css';
 

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  // Function to set default role as 'User' if not found
  const setDefaultUserRole = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, { role: "User" }, { merge: true });
    return "User";
  };

  // Function to redirect users based on their role
  const handleRoleBasedRedirect = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      let userRole;

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        userRole = userData.role || await setDefaultUserRole(uid);
      } else {
        userRole = await setDefaultUserRole(uid);
      }

      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "supplier") {
        navigate("/supplier");
      } else if (userRole === "User") {
        navigate("/user-dashboard");
      } else {
        setError("Role not recognized.");
        console.error("Unrecognized role:", userRole);
      }
    } catch (err) {
      setError("Failed to fetch user data.");
      console.error("Error fetching user data:", err);
    }
  };

  // Function to handle standard email/password sign-in
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await logIn(email, password);
      await handleRoleBasedRedirect(userCredential.user.uid);
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to handle Google sign-in
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await googleSignIn();
      await handleRoleBasedRedirect(userCredential.user.uid);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="main-content">
      <div className="form-section">
        <div className="p-4 box">
 
          <h2 className="mb-3">Sign In</h2>
          <div className="p-4 box">
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username: </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password: </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit">
                  Sign In
                </Button>
              </div>
            </Form>
            <hr />
            <GoogleButton className="g-btn" type="dark" onClick={handleGoogleSignIn} />
            <div className="p-4 box mt-3 text-center">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
