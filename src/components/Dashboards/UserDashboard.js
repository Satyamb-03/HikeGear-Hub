import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../Context/UserAuth';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Card, Form } from 'react-bootstrap';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../Context/firebase'; // Assuming Firebase storage is imported for file uploads
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import OrderHistory from '../../OrderHistory';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useUserAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ age: '', mobile: '', name: '' });
  const [isSupplierFormVisible, setIsSupplierFormVisible] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false);
  const [file, setFile] = useState(null);
  const [isOrderHistoryVisible, setIsOrderHistoryVisible] = useState(false);
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

  const toggleOrderHistoryVisibility = () => {
    setIsOrderHistoryVisible(!isOrderHistoryVisible);
  };

  const handleNavigateToSupplierDashboard = () => {
    navigate('/supplier-dashboard');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTermsChange = (e) => {
    setTermsAgreed(e.target.checked);
  };

  const handleApplyForSupplier = async () => {
    if (!file) {
      setError('Please upload a valid ID.');
      return;
    }

    if (!termsAgreed) {
      setError('You must agree to the terms and conditions.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Upload the file to Firebase Storage
      const fileRef = ref(storage, `supplier-ids/${file.name}`);
      await uploadBytes(fileRef, file);

      // Get the file's download URL
      const idFileUrl = await getDownloadURL(fileRef);

      // Update Firestore with supplier request details
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
      setUserData(prevData => ({
        ...prevData,
        supplierRequest: {
          status: 'pending',
          idFileUrl,
          termsAgreed
        }
      }));
    } catch (error) {
      console.error('Error applying to be a supplier:', error);
      setError('Error applying to be a supplier');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>You need to sign in first.</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <Container className="dashboard-container">
      <Card className="dashboard-card">
        <Card.Body>
          <h2 className="welcome-message">Welcome, {userData?.name || "User"}!</h2>

          {userData && (
            <>
              <p className="card-text"><strong>Name:</strong> {userData.name}</p>
              <p className="card-text"><strong>Age:</strong> {userData.age}</p>
              <p className="card-text"><strong>Mobile:</strong> {userData.mobile}</p>
              <Card.Text><strong>Email:</strong> {user.email}</Card.Text>

              {isEditing ? (
                <Form className="edit-profile-form">
                  <Form.Group controlId="formName">
                    <Form.Label>Name: </Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name" 
                      value={editForm.name} 
                      onChange={handleInputChange} 
                      placeholder="Enter your name"
                    />
                  </Form.Group>
                  <br />
                  <Form.Group controlId="formAge">
                    <Form.Label>Age: </Form.Label>
                    <Form.Control 
                      type="number" 
                      name="age" 
                      value={editForm.age} 
                      onChange={handleInputChange} 
                      placeholder="Enter your age"
                    />
                  </Form.Group>
                  <br />
                  <Form.Group controlId="formMobile">
                    <Form.Label>Mobile: </Form.Label>
                    <Form.Control 
                      type="text" 
                      name="mobile" 
                      value={editForm.mobile} 
                      onChange={handleInputChange} 
                      placeholder="Enter your mobile number"
                    />
                  </Form.Group>

                  <div className="button-group">
                    <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
                    <Button variant="secondary" onClick={handleEditToggle}>Cancel</Button>
                  </div>
                </Form>
              ) : (
                <div className="button-group">
                  <Button variant="info" onClick={handleEditToggle}>Edit Profile</Button>
                </div>
              )}

              {userData?.isSupplier ? (
                <Button 
                  variant="info" 
                  onClick={handleNavigateToSupplierDashboard}
                >
                  Go to Supplier Dashboard
                </Button>
              ) : (
                <>
                  {!userData?.supplierRequest && (
                    <>
                      <Button 
                        variant="warning" 
                        onClick={() => setIsSupplierFormVisible(!isSupplierFormVisible)}
                      >
                        {isSupplierFormVisible ? 'Hide Apply to be Supplier' : 'Apply to be Supplier'}
                      </Button>

                      {isSupplierFormVisible && (
                        <Form className="supplier-form">
                          <Form.Group controlId="formFile">
                            <Form.Label>Upload ID: </Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                          </Form.Group>
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
                              </div>}
                            checked={termsAgreed}
                            onChange={handleTermsChange}
                          />
                          <Button 
                            className="btn btn-info" 
                            onClick={handleApplyForSupplier} 
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                          </Button>
                          {error && <p className="error-text">{error}</p>}
                          {isApplicationSubmitted && <p className="success-text">Application submitted successfully!</p>}
                        </Form>
                      )}
                    </>
                  )}
                  {userData?.supplierRequest?.status === 'pending' && (
                    <p>Your application to become a supplier is under review.</p>
                  )}
                </>
              )}

              <Button variant="info" onClick={toggleOrderHistoryVisibility}>
                {isOrderHistoryVisible ? 'Hide Order History' : 'Show Order History'}
              </Button>

              {isOrderHistoryVisible && (
                <OrderHistory orders={userData.orders || []} />
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserDashboard;
