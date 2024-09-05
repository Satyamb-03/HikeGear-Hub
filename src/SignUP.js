import React, { useState } from 'react';
import { Alert, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from './UserAuth';

import "./SignIn.css"

 

const SignUp = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { signUp } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !age || !mobile || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signUp(email, password, name, age, mobile);

      // Determine where to navigate based on role
      if (email === "hikeGear@gmail.com") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 box">
 
      <h2 className="mb-3">Sign Up</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name: </Form.Label>
          <Form.Control 
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicAge">
          <Form.Label>Age:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicMobile">
          <Form.Label>Mobile Number:</Form.Label>
          <Form.Control
            type="text"
            placeholder=" Mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username: </Form.Label>
          <Form.Control
            type="email"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label>Confirm Password: </Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
      <div className="mt-3">
        Already have an account? <Link to="/signin">Sign in</Link>
      </div>
    </div>
  );
};

export default SignUp;
