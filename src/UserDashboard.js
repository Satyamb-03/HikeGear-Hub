import React, { useEffect, useState } from 'react';
import { useUserAuth } from './UserAuth';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Card, Form } from 'react-bootstrap';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import OrderHistory from './OrderHistory'; // Import OrderHistory
import './UserDashboard.css';

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
  const [orders, setOrders] = useState([]);
  const [orderError, setOrderError] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true); // Loading state for orders
  const [isOrderHistoryVisible, setIsOrderHistoryVisible] = useState(false); // State for order history visibility
  const [products, setProducts] = useState({}); // To store product data

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

    const fetchOrderHistory = async () => {
      if (!user) return;

      setLoadingOrders(true);
      try {
        const ordersQuery = query(collection(db, 'checkout'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(ordersQuery);

        if (!querySnapshot.empty) {
          const orderList = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              productIds: data.productIds || [], // Ensure productIds is an array
              productName: data.productName || 'N/A',
              finalTotal: data.finalTotal || 0,
              unitCost: data.unitCost || 'N/A',
              numberOfRentalDays: data.numberOfRentalDays || 'N/A',
              quantity: data.quantity || 'N/A',
              startDate: data.startDate || null,
              endDate: data.endDate || null,
              dateCreated: data.dateCreated ? data.dateCreated.toDate() : new Date()
            };
          });
          setOrders(orderList);

          // Fetch product data
          const productIds = orderList.flatMap(order => order.productIds || []);
          if (productIds.length > 0) {
            fetchProducts(productIds);
          }
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrderError('Error fetching order history');
      } finally {
        setLoadingOrders(false);
      }
    };

    const fetchProducts = async (productIds) => {
      try {
        const productsQuery = query(collection(db, 'products'), where('id', 'in', productIds));
        const productsSnapshot = await getDocs(productsQuery);

        if (!productsSnapshot.empty) {
          const productsData = productsSnapshot.docs.reduce((acc, doc) => {
            const data = doc.data();
            acc[doc.id] = data.name; // Adjust field based on your data structure
            return acc;
          }, {});
          setProducts(productsData);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setOrderError('Error fetching product data');
      }
    };

    fetchUserData();
    fetchOrderHistory();
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

  const toggleOrderHistoryVisibility = () => {
    setIsOrderHistoryVisible(!isOrderHistoryVisible); // Toggle order history visibility
  };

  const handleNavigateToSupplierDashboard = () => {
    navigate('/supplier-dashboard'); // Adjust the route if needed
  };

  if (loading) {
    return <p>Loading...</p>;
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
<br></br>
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
<br></br>
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
      <Button 
        className="btn btn-primary" 
        onClick={handleSaveChanges}
      >
        Save Changes
      </Button>
      <Button 
        className="btn btn-secondary" 
        onClick={handleEditToggle}
      >
        Cancel
      </Button>
    </div>
  </Form>
) : (
  <Button className="btn btn-primary" onClick={handleEditToggle}>
    Edit Profile
  </Button>
)}


              <Button className="btn btn-info" onClick={toggleOrderHistoryVisibility}>
                {isOrderHistoryVisible ? 'Hide Order History' : 'Show Order History'}
              </Button>

              {isOrderHistoryVisible && (
                <OrderHistory orders={orders} products={products} error={orderError} loading={loadingOrders} />
              )}

              <Button className="btn btn-secondary" onClick={handleNavigateToSupplierDashboard}>
                Go to Supplier Dashboard
              </Button>

              <Button className="btn btn-success" onClick={toggleSupplierFormVisibility}>
                {isSupplierFormVisible ? 'Hide Supplier Form' : 'Apply to be a Supplier'}
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
                    className="btn btn-success" 
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
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserDashboard;
