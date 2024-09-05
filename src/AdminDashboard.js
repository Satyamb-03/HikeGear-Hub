import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import ProductService from './ProductService';
import { useNavigate } from 'react-router-dom';

import { signOut } from 'firebase/auth'; // Import signOut from Firebase Auth
import { auth } from './firebase'; // Import Firebase auth


import './AdminDashboard.css';
import Header from "./Header";
import NavBar from "./NavBar";

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

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
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
      await signOut(auth); // Sign out using Firebase Auth
      navigate('/'); // Redirect to the home page after logging out
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  return (
    <div className="admin-dashboard">
      <Header/>
      <NavBar/>
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>

        <button className="logout-button" onClick={handleLogout}>Logout</button>

      </header>

      <div className="content">
        <div className="user-list">
          <h2>User List</h2>
          <table>
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

        <div className="supplier-requests">
          <h2>Supplier Requests</h2>
          <table>
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

      <div className="add-product-section">
        <button className="open-form-button" onClick={() => setShowProductForm(true)}>
          Add Product
        </button>

        {showProductForm && (
          <div className="form-popup">
            <div className="form-container">
              <form onSubmit={handleSubmit} className="add-product-form">
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
                  {additionalImageFiles.length > 0 && (
                    <div className="image-preview">
                      {Array.from(additionalImageFiles).map((file, index) => (
                        <img key={index} src={URL.createObjectURL(file)} alt={`Additional ${index + 1}`} />
                      ))}
                    </div>
                  )}
                </label>
                <label>
                  Category:
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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

                        <option value="Furniture">Camp Furniture</option>

                        <option value="Sleep Systems">Sleep Systems</option>
                        <option value="Tents & Bivvies">Tents & Bivvies</option>
                        <option value="Additional Gear">Additional Gear</option>

                      </>
                    )}
                    {category === 'Accessories' && (
                      <>

                        <option value="Clothing">Clothing Accessories</option>
                        <option value="Gear">Gear Accessories</option>

                        <option value="Headwear">Headwear</option>
                        <option value="Clothing Accessories">Clothing Accessories</option>
                        <option value="Footwear Accessories">Footwear Accessories</option>
                        <option value="Backpack Accessories">Backpack Accessories</option>

                      </>
                    )}
                  </select>
                </label>
                <button type="submit" className="submit-button">Submit</button>
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
