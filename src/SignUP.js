import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useUserAuth } from "./UserAuth";


const signUp = () => {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [age, setAge] = useState("");
    const [contactNo, setContactNo]= useState("");
    const { signUp } = useUserAuth();
    let navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
  
      const newUser = {
        fullName,
        age,
        contactNo,
      
      };
  
      try {
        await signUp(username, password);
        await UserDataService.addUser(newUser);
        navigate("/");
      } catch (err) {
        setError(err.message);
      }
    };
  
    return (
      <>
        <div className="p-4 box">
          <h2 className="mb-3">Firebase Auth Signup</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicFullName">
              <Form.Control
                type="text"
                placeholder=" Name"
                onChange={(e) => setFullName(e.target.value)}
              />
            </Form.Group>
  
         
  
            <Form.Group className="mb-3" controlId="formBasicAge">
              <Form.Control
                type="number"
                placeholder="Age"
                onChange={(e) => setAge(e.target.value)}
              />
            </Form.Group>
  
            <Form.Group className="mb-3" controlId="formBasicContactNo">
              <Form.Control
                type="text"
                placeholder="Mobile number"
                onChange={(e) => setContactNo(e.target.value)}
              />
           
  
            </Form.Group>
  
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Control
                type="email"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
  
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
  
            <div className="d-grid gap-2">
              <Button variant="primary" type="Submit">
                Sign up
              </Button>
            </div>
          </Form>
        </div>
        <div className="p-4 box mt-3 text-center">
          Already have an account? <Link to="/">Log In</Link>
        </div>
      </>
    );
};


export default signUp;