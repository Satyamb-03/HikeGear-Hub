import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import ProductService from './ProductService';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [category, setCategory] = useState('Clothing');
  const [subcategory, setSubcategory] = useState('Men');
  const [users, setUsers] = useState([]);
  const [supplierRequests, setSupplierRequests] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [showSupplierRequests, setShowSupplierRequests] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [checkoutEarnings, setCheckoutEarnings] = useState([]);
  const [totalCheckoutEarnings, setTotalCheckoutEarnings] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchOrders();
    fetchCheckoutEarnings();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollection);
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);

      const requests = usersList
        .filter(user => user.supplierRequest)
        .map(user => ({
          id: user.id,
          userName: user.name,
          userEmail: user.email
        }));
      setSupplierRequests(requests);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const ordersCollection = collection(db, 'orders');
      const querySnapshot = await getDocs(ordersCollection);
      const ordersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const total = ordersList.reduce((acc, order) => acc + (order.serviceFee || 0), 0);
      setTotalEarnings(total);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchCheckoutEarnings = async () => {
    try {
      const checkoutCollection = collection(db, 'checkout');
      const querySnapshot = await getDocs(checkoutCollection);
      const checkoutList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const total = checkoutList.reduce((acc, order) => acc + (order.serviceFee || 0), 0);
      setTotalCheckoutEarnings(total);

      const earningsByCheckout = checkoutList.map(order => ({
        id: order.id,
        totalEarnings: order.serviceFee || 0
      }));
      setCheckoutEarnings(earningsByCheckout);
    } catch (error) {
      console.error('Error fetching checkout earnings:', error);
    }
  };

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImageFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      name,
      description,
      pricePerDay: parseInt(pricePerDay, 10),
      category,
      subcategory
    };

    try {
      await ProductService.addProduct(newProduct, mainImageFile, additionalImageFiles);
      setName('');
      setDescription('');
      setPricePerDay('');
      setMainImageFile(null);
      setAdditionalImageFiles([]);
      setShowProductForm(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
      setSupplierRequests(supplierRequests.filter(request => request.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleApproveSupplier = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        isSupplier: true,
        supplierRequest: null
      });
      setSupplierRequests(supplierRequests.filter(request => request.id !== userId));
    } catch (error) {
      console.error('Error approving supplier request:', error);
    }
  };

  const handleDenySupplier = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        supplierRequest: null
      });
      setSupplierRequests(supplierRequests.filter(request => request.id !== userId));
    } catch (error) {
      console.error('Error denying supplier request:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
      </header>
      <div className="dashboard-content">
        <div className="admin-actions">
          <button onClick={() => setShowUserList(!showUserList)} className="action-button">
            {showUserList ? 'Hide User List' : 'Show User List'}
          </button>
          <button onClick={() => setShowSupplierRequests(!showSupplierRequests)} className="action-button">
            {showSupplierRequests ? 'Hide Supplier Requests' : 'Show Supplier Requests'}
          </button>
          <button onClick={() => setShowProductForm(true)} className="action-button add-product-button">
            Add Product
          </button>
        </div>

        <div className="total-checkout-earnings">
          <h2>Total Earnings from Checkout</h2>
          <p>${totalCheckoutEarnings.toFixed(2)}</p>
        </div>
        <div className="checkout-earnings">
          <h2>Earnings by Checkout</h2>
          <table className="earnings-table">
            <thead>
              <tr>
                <th>Checkout ID</th>
                <th>Earnings ($)</th>
              </tr>
            </thead>
            <tbody>
              {checkoutEarnings.map(checkout => (
                <tr key={checkout.id}>
                  <td>{checkout.id}</td>
                  <td>${checkout.totalEarnings.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showUserList && (
          <div className="form-popup">
            <div className="form-container">
              <button type="button" className="close-button" onClick={() => setShowUserList(false)}>Close</button>
              <h2>User List</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role || 'User'}</td>
                      <td>
                        <button onClick={() => handleDeleteUser(user.id)} className="delete-button">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showSupplierRequests && (
          <div className="form-popup">
            <div className="form-container">
              <button type="button" className="close-button" onClick={() => setShowSupplierRequests(false)}>Close</button>
              <h2>Supplier Requests</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierRequests.map(request => (
                    <tr key={request.id}>
                      <td>{request.userName}</td>
                      <td>{request.userEmail}</td>
                      <td>
                        <button onClick={() => handleApproveSupplier(request.id)} className="approve-button">Approve</button>
                        <button onClick={() => handleDenySupplier(request.id)} className="deny-button">Deny</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showProductForm && (
          <div className="form-popup">
            <div className="form-container">
              <button type="button" className="close-button" onClick={() => setShowProductForm(false)}>Close</button>
              <h2>Add Product</h2>
              <form onSubmit={handleSubmit}>
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
                <label htmlFor="pricePerDay">Price per Day</label>
                <input
                  type="number"
                  id="pricePerDay"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value)}
                  required
                />
                <label htmlFor="mainImage">Main Image</label>
                <input
                  type="file"
                  id="mainImage"
                  onChange={(e) => setMainImageFile(e.target.files[0])}
                  required
                />
                <label htmlFor="additionalImages">Additional Images</label>
                <input
                  type="file"
                  id="additionalImages"
                  multiple
                  onChange={handleAdditionalImagesChange}
                />
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Clothing">Clothing</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Gear">Gear</option>
                  <option value="Accessories">Accessories</option>
                </select>
                <label htmlFor="subcategory">Subcategory</label>
                <select
                  id="subcategory"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                >
                  {/* Subcategory options based on the category */}
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
                <button type="submit" className="submit-button">Submit</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
