import React, { useState } from 'react';
import { Alert, Form, Button } from 'react-bootstrap';
import GoogleButton from 'react-google-button';
import { useUserAuth } from './UserAuth'; // Adjust path if needed
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate(); // Get the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      // Redirect or handle successful login
      navigate("/home"); // Navigate to Home on successful login
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/"); // Navigate to Home on successful Google sign-in
    } catch (error) {
      console.log(error.message);
      setError(error.message); // Set error state if needed
    }
  };

  return (
    <div className="p-4 box">
      <h2 className="mb-3">Sign In</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail"><label  style={{ fontWeight: 700, marginRight: 10 }}>Username:</label>
          <Form.Control
            type="email"
            placeholder="Username"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword"><label  style={{ fontWeight: 700, marginRight: 10 }}>Password:</label>
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
