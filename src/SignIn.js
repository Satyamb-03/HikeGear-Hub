import React, { useState, useEffect } from 'react';
import { Alert, Form, Button } from 'react-bootstrap';
import GoogleButton from 'react-google-button';
import { useUserAuth } from './UserAuth'; // Adjust path if needed
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false); // Add state for login status

  const { logIn, googleSignIn, user } = useUserAuth(); // Ensure user is provided by useUserAuth
  const navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (user) {
        setAlreadyLoggedIn(true);
        navigate("/user-dashboard"); // Redirect to user dashboard if already logged in
      } else {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      navigate("/user-dashboard"); // Navigate to user dashboard on successful login
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/user-dashboard"); // Navigate to user dashboard on successful Google sign-in
    } catch (error) {
      console.log(error.message);
      setError(error.message); // Set error state if needed
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading message while checking auth status
  }

  if (alreadyLoggedIn) {
    return <div className="p-4 box"><Alert variant="info">You are already logged in. Redirecting...</Alert></div>;
  }

  return (
    <div className="p-4 box">
      <h2 className="mb-3">Sign In</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <label style={{ fontWeight: 700, marginRight: 10 }}>Username:</label>
          <Form.Control
            type="email"
            placeholder="Username"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <label style={{ fontWeight: 700, marginRight: 10 }}>Password:</label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <div className="d-grid gap-2">
          <Button variant="primary" type="submit">Sign In</Button>
        </div>
      </Form>
      <hr />
      <div className="text-center">
        <GoogleButton
          className="g-btn"
          type="dark"
          onClick={handleGoogleSignIn}
        />
      </div>
      <div className="p-4 box mt-3 text-center">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
};

export default SignIn;
