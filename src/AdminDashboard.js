import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import ProductService from './ProductService';
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollection);
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);

      // Filter users with supplier requests and include user info
      const requests = usersList
        .filter(user => user.supplierRequest)
        .map(user => ({
          id: user.id,
          userName: user.name, // Assuming `name` field exists
          userEmail: user.email // Assuming `email` field exists
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
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Delete the user document from Firestore
      await deleteDoc(doc(db, 'users', userId));

      // Remove from local state
      setUsers(users.filter(user => user.id !== userId));
      setSupplierRequests(supplierRequests.filter(request => request.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleApproveSupplier = async (userId) => {
    try {
      // Update user document to reflect supplier approval
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        isSupplier: true,
        supplierRequest: null // Clear the supplier request after approval
      });

      // Remove from local state
      setSupplierRequests(supplierRequests.filter(request => request.id !== userId));
    } catch (error) {
      console.error('Error approving supplier request:', error);
    }
  };

  const handleDenySupplier = async (userId) => {
    try {
      // Remove supplier request field
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        supplierRequest: null
      });

      // Remove from local state
      setSupplierRequests(supplierRequests.filter(request => request.id !== userId));
    } catch (error) {
      console.error('Error denying supplier request:', error);
    }
  };

  return (
    <div className="admin-dashboard">
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
                  <option value="Kitchen">Camp Kitchen</option>
                  <option value="Packs">Packs</option>
                  <option value="Sleep">Sleep Systems</option>
                  <option value="Tents">Tents & Bivvies</option>
                  <option value="Additional">Additional Gear</option>
                </>
              )}
              {category === 'Accessories' && (
                <>
                  <option value="Headwear">Headwear</option>
                  <option value="Clothing">Clothing Accessories</option>
                  <option value="Footwear">Footwear Accessories</option>
                  <option value="Backpack">Backpack Accessories</option>
                </>
              )}
            </select>
          </label>
          <button type="submit">Add Product</button>
        </form>
      </div>
      <div className="user-list">
        <h2>All Users</h2>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.name} - {user.email}
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="supplier-requests">
        <h2>Supplier Requests</h2>
        <ul>
          {supplierRequests.map(request => (
            <li key={request.id}>
              {request.userName} - {request.userEmail}
              <button onClick={() => handleApproveSupplier(request.id)}>Approve</button>
              <button onClick={() => handleDenySupplier(request.id)}>Deny</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
