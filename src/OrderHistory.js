import React, { useState, useEffect } from 'react';
import { useUserAuth } from './UserAuth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import './OrderHistory.css';

function OrderHistory() {
  const { user } = useUserAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState({}); // To store product data
  const db = getFirestore();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user) return;

      try {
        // Fetch orders
        const ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));
        const ordersSnapshot = await getDocs(ordersQuery);

        if (!ordersSnapshot.empty) {
          const orderList = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            dateCreated: doc.data().dateCreated ? doc.data().dateCreated.toDate() : new Date()
          }));
          setOrders(orderList);

          // Fetch product IDs from orders
          const productIds = orderList.map(order => order.productId); // Adjust this field based on your data structure
          if (productIds.length > 0) {
            fetchProducts(productIds);
          }
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError('Error fetching order history');
      }
    };

    const fetchProducts = async (productIds) => {
      try {
        // Fetch product data
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
        setError('Error fetching product data');
      }
    };

    fetchOrderHistory();
  }, [user]);

  return (
    <div className="OrderHistory">
      <h2>Order History</h2>
      {error && <p className="error-text">{error}</p>}
      {orders.length > 0 ? (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Product Name:</strong> {products[order.productId] || 'Unknown'}</p>
              <p><strong>Address:</strong> {order.address || 'N/A'}</p>
              <p><strong>Pickup Date:</strong> {order.pickupDate || 'N/A'}</p>
              <p><strong>Pickup Time:</strong> {order.pickupTime || 'N/A'}</p>
              <p><strong>Total Cost:</strong> ${order.totalCost?.toFixed(2) || 'N/A'}</p>
              <p><strong>Final Total:</strong> ${order.finalTotal?.toFixed(2) || 'N/A'}</p>
              <p><strong>Hiring Fee:</strong> ${order.hiringFee?.toFixed(2) || 'N/A'}</p>
              <p><strong>Service Fee:</strong> ${order.serviceFee?.toFixed(2) || 'N/A'}</p>
              <p><strong>Date Created:</strong> {order.dateCreated.toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default OrderHistory;
