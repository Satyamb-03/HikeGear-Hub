import React, { useEffect, useState } from 'react';
import { useUserAuth } from './UserAuth';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Card } from 'react-bootstrap';
import './UserDashboard.css'; 
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; 

const UserDashboard = () => {
  const { user, signOutUser } = useUserAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('User object:', user); 
      console.log('User ID (uid):', user?.uid); 
  
      if (!user) {
        console.log('User is null or not loaded');
        setLoading(false);
        return;
      }
  
      console.log('Fetching data for user UID:', user.uid);
  
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          console.log('User data from Firestore:', userDocSnap.data()); 
          setUserData(userDocSnap.data());
        } else {
          console.log("No such document for UID:", user.uid); 
          setUserData(null); 
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError('Error fetching user data'); 
        setUserData(null); 
      } finally {
        setLoading(false); 
      }
    };
  
    fetchUserData();
  }, [user]); 
  
  const handleLogout = async () => {
    try {
      await signOutUser(); 
      navigate('/signin');
    } catch (error) {
      console.error("Logout Error:", error);
      setError('Error logging out'); 
    }
  };

  if (loading) {
    return <p>Loading...</p>; 
  }

  if (error) {
    return <p>{error}</p>; 
  }

  if (!user) {
    return <p>User is not logged in or not loaded yet.</p>; 
  }

  return (
    <Container className="dashboard-container">
      <h2 className="welcome-message">Welcome, {userData?.name || "User"}!</h2>
      <Card className="dashboard-card shadow-lg">
        <Card.Body>
          <Card.Title>User Profile</Card.Title>
          <Card.Text><strong>Age:</strong> {userData?.age || 'Not provided'}</Card.Text>
          <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
          <Card.Text><strong>Mobile:</strong> {userData?.mobile || 'Not provided'}</Card.Text>
          <Card.Text><strong>Name:</strong> {userData?.name || 'Not provided'}</Card.Text>
        </Card.Body>
      </Card>
      <div className="dashboard-buttons">
        <Button variant="danger" onClick={handleLogout}>Log Out</Button>
      </div>
    </Container>
  );
};

export default UserDashboard;
