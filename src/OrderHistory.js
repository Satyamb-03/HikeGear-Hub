import React, { useState, useEffect } from 'react';
import { useUserAuth } from './UserAuth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import './OrderHistory.css';

function OrderHistory() {
  const { user } = useUserAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user) return;

      try {
        const ordersQuery = query(collection(db, 'checkout'), where('userId', '==', user.uid));
        const ordersSnapshot = await getDocs(ordersQuery);

        if (!ordersSnapshot.empty) {
          const orderList = ordersSnapshot.docs.map(doc => {
            const data = doc.data();

            return {
              id: doc.id,
              address: data.address || 'No address provided',
              dateCreated: data.dateCreated ? data.dateCreated.toDate() : new Date(),
              endDate: data.endDate || '',
              finalTotal: data.finalTotal || 0,
              pickupDate: data.pickupDate || '',
              productIds: data.productIds || [],
              startDate: data.startDate || '',
              totalCost: data.totalCost || 0,
              totalDays: data.totalDays || 0,
              userId: data.userId || '',
              userName: data.userName || 'Anonymous',
            };
          });

          setOrders(orderList);

          const productIds = orderList.flatMap(order => order.productIds);
          if (productIds.length > 0) {
            fetchProducts(productIds);
          }
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError('Error fetching order history');
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async (productIds) => {
      try {
        const productsQuery = query(collection(db, 'products'), where('id', 'in', productIds));
        const productsSnapshot = await getDocs(productsQuery);

        if (!productsSnapshot.empty) {
          const productsData = productsSnapshot.docs.reduce((acc, doc) => {
            const data = doc.data();
            acc[doc.id] = data.mainImage || ''; // Assuming mainImage is the image URL
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
  }, [user, db]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="OrderHistory">
      <h2>Order History</h2>
      {error && <p className="error-text">{error}</p>}
      {orders.length > 0 ? (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Start Date:</strong> {order.startDate}</p>
              <p><strong>End Date:</strong> {order.endDate}</p>
              <p><strong>Pickup Date:</strong> {order.pickupDate}</p>
              <p><strong>Final Total:</strong> ${order.finalTotal.toFixed(2)}</p>
              <p><strong>Total Days:</strong> {order.totalDays}</p>
              <p><strong>Date Created:</strong> {order.dateCreated.toLocaleDateString()}</p>
              <p><strong>Product Images:</strong> 
                {order.productIds.length > 0 
                  ? order.productIds.map(id => 
                      products[id] 
                        ? <img key={id} src={products[id]} alt={`Product ${id}`} className="product-image" />
                        : 'No image'
                    ) 
                  : 'No products'}
              </p>
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
