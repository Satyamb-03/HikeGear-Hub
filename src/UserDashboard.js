import React, { useEffect, useState } from 'react';
import { useUserAuth } from './UserAuth';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Card, Form } from 'react-bootstrap';
import './UserDashboard.css'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import ProductService from './ProductService';

const UserDashboard = () => {
  const { user, signOutUser } = useUserAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ age: '', mobile: '', name: '' });
  const [isSupplierFormVisible, setIsSupplierFormVisible] = useState(false);

  // Supplier Form States
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [category, setCategory] = useState('Clothing');
  const [subcategory, setSubcategory] = useState('Men');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
          setEditForm({
            age: userDocSnap.data().age || '',
            mobile: userDocSnap.data().mobile || '',
            name: userDocSnap.data().name || ''
          });
        } else {
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

  const handleApplyForSupplier = async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { ...userData, supplierRequest: 'pending' }, { merge: true });
      alert('Application submitted. You will be notified once it is reviewed.');
    } catch (error) {
      console.error('Error applying to be a supplier:', error);
      setError('Error submitting application');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { age: editForm.age, mobile: editForm.mobile, name: editForm.name }, { merge: true });
      setUserData(prevData => ({ ...prevData, ...editForm }));
      setIsEditing(false);
      alert('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile');
    }
  };

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImageFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      name: productName,
      description,
      pricePerDay: parseInt(pricePerDay),
      category,
      subcategory
    };

    try {
      await ProductService.addProduct(newProduct, mainImageFile, additionalImageFiles);
      setProductName('');
      setDescription('');
      setPricePerDay('');
      setMainImageFile(null);
      setAdditionalImageFiles([]);
      setIsSupplierFormVisible(false); // Hide form after submission
    } catch (error) {
      console.error("Error adding product:", error);
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
          {isEditing ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="text"
                  name="age"
                  value={editForm.age}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  type="text"
                  name="mobile"
                  value={editForm.mobile}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Button variant="success" onClick={handleSaveChanges}>Save Changes</Button>
              <Button variant="secondary" onClick={handleEditToggle}>Cancel</Button>
            </Form>
          ) : (
            <>
              <Card.Text><strong>Age:</strong> {userData?.age || 'Not provided'}</Card.Text>
              <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
              <Card.Text><strong>Mobile:</strong> {userData?.mobile || 'Not provided'}</Card.Text>
              <Card.Text><strong>Name:</strong> {userData?.name || 'Not provided'}</Card.Text>
              <Button variant="primary" onClick={handleEditToggle}>Edit Profile</Button>
            </>
          )}
        </Card.Body>
      </Card>
      
      {/* Apply to be a Supplier Form */}
      <div className="supplier-form-container">
        <Button variant="info" onClick={handleApplyForSupplier}>Apply to be a Supplier</Button>
      </div>

      {/* Navigation Button to Supplier Dashboard */}
      <Button variant="info" onClick={() => navigate('/supplier-dashboard')}>
        Go to Supplier Dashboard
      </Button>

      <Button variant="danger" onClick={handleLogout}>Logout</Button>
    </Container>
  );
};

export default UserDashboard;
