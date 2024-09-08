import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import ProductService from './ProductService';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'; 
import { auth } from './firebase'; 
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
  const [orderEarnings, setOrderEarnings] = useState([]); // For individual order earnings

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchOrders();
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

      // Calculate total earnings from service fees
      const total = ordersList.reduce((acc, order) => acc + (order.serviceFee || 0), 0);
      setTotalEarnings(total);

      // Aggregate earnings for each order
      const earningsByOrder = ordersList.map(order => ({
        id: order.id,
        totalEarnings: order.serviceFee || 0 // Assuming each order has a serviceFee
      }));
      setOrderEarnings(earningsByOrder);

    } catch (error) {
      console.error('Error fetching orders:', error);
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Log Out</button>
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
        <div className="total-earnings">
          <h2>Total Earnings</h2>
          <p>${totalEarnings.toFixed(2)}</p>
        </div>
        <div className="order-earnings">
          <h2>Earnings by Order</h2>
          <ul>
            {orderEarnings.map(order => (
              <li key={order.id}>
                Order ID: {order.id} - Earnings: ${order.totalEarnings.toFixed(2)}
              </li>
            ))}
          </ul>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
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
                    <th>User Name</th>
                    <th>User Email</th>
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
                <label>
                  Name:
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Description:
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Price per Day:
                  <input
                    type="number"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Main Image:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMainImageFile(e.target.files[0])}
                    required
                  />
                </label>
                <label>
                  Additional Images:
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                  />
                </label>
                <label>
                  Category:
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="Clothing">Clothing</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Gear">Gear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </label>
                <label>
                  Subcategory:
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    required
                  >
                    {category === 'Clothing' && (
                      <>
                        <option value="Men">Men's Clothing</option>
                        <option value="Women">Women's Clothing</option>
                        <option value="Kids">Kids' Clothing</option>
                      </>
                    )}
                    {category === 'Footwear' && (
                      <>
                        <option value="Men">Men's Footwear</option>
                        <option value="Women">Women's Footwear</option>
                        <option value="Kids">Kids' Footwear</option>
                      </>
                    )}
                    {category === 'Gear' && (
                      <>
                        <option value="Camp Furniture">Camp Furniture</option>
                        <option value="Camp Kitchen">Camp Kitchen</option>
                        <option value="Packs">Packs</option>
                        <option value="Sleep Systems">Sleep Systems</option>
                        <option value="Tents & Bivvies">Tents & Bivvies</option>
                        <option value="Additional Gear">Additional Gear</option>
                      </>
                    )}
                    {category === 'Accessories' && (
                      <>
                        <option value="Headwear">Headwear</option>
                        <option value="Clothing Accessories">Clothing Accessories</option>
                        <option value="Footwear Accessories">Footwear Accessories</option>
                        <option value="Backpack Accessories">Backpack Accessories</option>
                      </>
                    )}
                  </select>
                </label>
                <button type="submit" className="submit-button">Add Product</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
