import React, { useState } from 'react';
import { Alert, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useUserAuth } from './UserAuth';

const SignUp = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [error, setError] = useState("");
  const { signUp } = useUserAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check if all fields are filled
    if (!name || !age || !mobile || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signUp(email, password, name, age, mobile);
      // Redirect to Sign In page after successful sign up
      navigate("/signin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 box">
      <h2 className="mb-3">Sign Up</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <label style={{ fontWeight: 700, marginRight: 10 }}>Name:</label>
          <Form.Control 
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicAge">
          <label style={{ fontWeight: 700, marginRight: 10 }}>Age:</label>
          <Form.Control
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicMobile">
          <label style={{ fontWeight: 700, marginRight: 10 }}>Mobile Number:</label>
          <Form.Control
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <label style={{ fontWeight: 700, marginRight: 10 }}>Username:</label>
          <Form.Control
            type="email"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <label style={{ fontWeight: 700, marginRight: 10 }}>Password:</label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <label style={{ fontWeight: 700, marginRight: 10 }}>Confirm Password:</label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <div className="d-grid gap-2">
          <Button variant="primary" type="submit">Sign Up</Button>
        </div>
      </Form>
      <div className="p-4 box mt-3 text-center">
        Already have an account? <Link to="/signin">Sign in</Link>
      </div>
    </div>
  );
};

export default SignUp;
