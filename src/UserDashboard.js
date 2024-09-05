import React, { useEffect, useState } from 'react';
import { useUserAuth } from './UserAuth';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Card, Form } from 'react-bootstrap';
import './UserDashboard.css'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
 

const UserDashboard = () => {
  const { user, signOutUser } = useUserAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ age: '', mobile: '', name: '' });
  const [isSupplierFormVisible, setIsSupplierFormVisible] = useState(false);
  const [idFile, setIdFile] = useState(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false); 

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

  const handleApplyForSupplier = async () => {
    if (!idFile || !termsAgreed) {
      setError("Please upload an ID and agree to all terms.");
      return;
    }

    setIsSubmitting(true);
    try {
      const idFileRef = ref(storage, `supplier-ids/${idFile.name}`);
      const snapshot = await uploadBytes(idFileRef, idFile);
      const idFileUrl = await getDownloadURL(idFileRef);

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { 
        ...userData, 
        supplierRequest: {
          status: 'pending', 
          idFileUrl, 
          termsAgreed 
        } 
      }, { merge: true });

      setIsApplicationSubmitted(true); 
    } catch (error) {
      console.error('Error applying to be a supplier:', error);
      setError('Error submitting application');
    } finally {
      setIsSubmitting(false);
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

  const handleFileChange = (e) => {
    setIdFile(e.target.files[0]);
  };

  const handleTermsChange = (e) => {
    setTermsAgreed(e.target.checked);
  };

  const toggleSupplierFormVisibility = () => {
    setIsSupplierFormVisible(!isSupplierFormVisible);
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
          <Card.Title>Your Profile</Card.Title>
          {isEditing ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
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
              <Button variant="success" onClick={handleSaveChanges}>Save Changes</Button>
              <Button variant="secondary" onClick={handleEditToggle}>Cancel</Button>
            </Form>
          ) : (
            <>
              <Card.Text><strong>Name:</strong> {userData?.name || 'Not provided'}</Card.Text>
              <Card.Text><strong>Age:</strong> {userData?.age || 'Not provided'}</Card.Text>
              <Card.Text><strong>Mobile:</strong> {userData?.mobile || 'Not provided'}</Card.Text>
              <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
              <Button variant="primary" onClick={handleEditToggle}>Edit Profile</Button>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Button to toggle supplier form visibility */}
      {!isApplicationSubmitted && (
        <div className="supplier-form-toggle">
          <Button variant="info" onClick={toggleSupplierFormVisibility}>
            {isSupplierFormVisible ? "Hide Supplier Form" : "Want to Become a Supplier?"}
          </Button>
        </div>
      )}

      {/* Apply to be a Supplier Form */}
      {isSupplierFormVisible && !isApplicationSubmitted && (
        <Card className="supplier-application-card shadow-lg mt-4">
          <Card.Body>
            <Card.Title>Apply to be a Supplier</Card.Title>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Upload ID (Passport, License, etc.)</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} className="file-upload" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label={
                    <div>
                      I agree to the terms and conditions:
                      <ul>
                        <li> All information provided must be accurate.</li>
                        <li> The uploaded ID must be valid and clear.</li>
                        <li> We reserve the right to verify all details provided.</li>
                        <li> Any misuse of our platform may lead to termination of application.</li>
                      </ul>
                    </div>
                  }
                  checked={termsAgreed}
                  onChange={handleTermsChange}
                />
              </Form.Group>
              <Button
                variant="info"
                disabled={!idFile || !termsAgreed || isSubmitting}
                onClick={handleApplyForSupplier}
                className="apply-btn"
              >
                {isSubmitting ? 'Submitting...' : 'Apply to be a Supplier'}
              </Button>
              {error && <p className="error-text">{error}</p>}
            </Form>
          </Card.Body>
        </Card>
      )}

      {isApplicationSubmitted && (
        <p className="application-status mt-4">Your request is in review. We will notify you once it is reviewed.</p>
      )}

      <Button variant="info" className="mt-4" onClick={() => navigate('/supplier-dashboard')}>
        Go to Supplier Dashboard
      </Button>
    </Container>
  );
};

export default UserDashboard;
