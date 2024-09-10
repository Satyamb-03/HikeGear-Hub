import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc,getDoc } from 'firebase/firestore';
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
  const [subcategory, setSubcategory] = useState('Men\'s Clothing');
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
          userEmail: user.email,
          idProofUrl: user.supplierRequest.idFileUrl
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
  
      // Map the checkout data including the new fields
      const checkoutList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        serviceFee: doc.data().serviceFee || 0,  // Existing serviceFee
        finalTotal: doc.data().finalTotal || 0,  // New finalTotal field
        userId: doc.data().userId || 'Unknown',  // New userId field
        productNames: doc.data().productNames || [],  // New productNames field (as array or string)
      }));
  
      // Calculate total earnings (if needed for the existing functionality)
      const total = checkoutList.reduce((acc, order) => acc + (order.serviceFee || 0), 0);
      setTotalCheckoutEarnings(total);
  
      // Store checkout earnings data with new fields
      const earningsByCheckout = checkoutList.map(order => ({
        id: order.id,
        totalEarnings: order.serviceFee,
        finalTotal: order.finalTotal,   // New field added
        userId: order.userId,           // New field added
        productNames: order.productNames.join(', '),  // New field added (join to display as string)
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
      const user = users.find(user => user.id === userId);
      if (user.role === 'admin') {
        alert('Cannot delete an admin user.');
        return;
      }
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
      setSupplierRequests(supplierRequests.filter(request => request.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      if (userData.role === 'admin') {
        alert('The admin role cannot be changed.');
        return;
      }

      await updateDoc(userDocRef, {
        isSupplier: newRole === 'Supplier'
      });
      fetchUsers(); // Refresh user list to reflect changes
    } catch (error) {
      console.error('Error updating user role:', error);
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
      <th>Service Fee</th>
      <th>Final Total</th>  {/* New column */}
      <th>User ID</th>      {/* New column */}
      <th>Product Names</th>{/* New column */}
    </tr>
  </thead>
  <tbody>
    {checkoutEarnings.map((checkout) => (
      <tr key={checkout.id}>
        <td>{checkout.id}</td>
        <td>${checkout.totalEarnings}</td>
        <td>${checkout.finalTotal}</td>  {/* Display finalTotal */}
        <td>{checkout.userId}</td>       {/* Display userId */}
        <td>{checkout.productNames}</td> {/* Display productNames */}
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
                      <td>
                        <select 
                          value={user.isSupplier ? 'Supplier' : 'Customer'} 
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={user.role === 'admin'}
                        >
                          <option value="Customer">Customer</option>
                          <option value="Supplier">Supplier</option>
                        </select>
                      </td>
                      <td>
                        <button onClick={() => handleDeleteUser(user.id)} className="delete-button" disabled={user.role === 'admin'}>
                          Delete
                        </button>
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
                    <th>Username</th>
                    <th>Email</th>
                    <th>ID Proof</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierRequests.map(request => (
                    <tr key={request.id}>
                      <td>{request.userName}</td>
                      <td>{request.userEmail}</td>
                      <td><a href={request.idProofUrl} target="_blank" rel="noopener noreferrer">View</a></td>
                      <td>
                        <button onClick={() => handleApproveSupplier(request.id)} className="approve-button">
                          Approve
                        </button>
                        <button onClick={() => handleDenySupplier(request.id)} className="deny-button">
                          Deny
                        </button>
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
                  Product Name:
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label>
                  Description:
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </label>
                <label>
                  Price Per Day ($):
                  <input type="number" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} required />
                </label>
                <label>
                  Main Image:
                  <input type="file" accept="image/*" onChange={(e) => setMainImageFile(e.target.files[0])} required />
                </label>
                <label>
                  Additional Images:
                  <input type="file" accept="image/*" multiple onChange={handleAdditionalImagesChange} />
                </label>
                <label>
                  Category:
                  <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="Clothing">Clothing</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Gear">Gear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </label>
                <label>
                  Subcategory:
                  <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} required>
                    {category === 'Clothing' && (
                      <>
                        <option value="Men's Clothing">Men's Clothing</option>
                        <option value="Women's Clothing">Women's Clothing</option>
                        <option value="Kid's Clothing">Kid's Clothing</option>
                      </>
                    )}
                    {category === 'Footwear' && (
                      <>
                        <option value="Men's Footwear">Men's Footwear</option>
                        <option value="Women's Footwear">Women's Footwear</option>
                        <option value="Kid's Footwear">Kid's Footwear</option>
                      </>
                    )}
                    {category === 'Gear' && (
                      <>
                        <option value="Camp Kitchen">Camp Kitchen</option>
                        <option value="Packs">Packs</option>
                        <option value="Sleep Systems">Sleep Systems</option>
                        <option value="Tents & Bivvies">Tents & Bivvies</option>
                        <option value="Additional Gear">Additional Gear</option>
                      </>
                    )}
                    {category === 'Accessories' && (
                      <>
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
