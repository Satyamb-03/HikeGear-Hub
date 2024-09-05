import React, { useState, useEffect } from 'react';
import { useUserAuth } from './UserAuth'; // Your auth context
import { Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // Firestore database

const ProtectedSupplierDashboard = ({ children }) => {
  const { user } = useUserAuth(); // Assuming you have user authentication in context
  const [isLoading, setIsLoading] = useState(true);
  const [isSupplier, setIsSupplier] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().isSupplier) {
          setIsSupplier(true); // Allow access to the supplier dashboard
        } else {
          setShowWarning(true); // Show warning if not a supplier
          setTimeout(() => {
            setShowWarning(false);
          }, 3000); // Hide warning after 3 seconds
        }
      }
      setIsLoading(false);
    };

    checkUserRole();
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isSupplier) {
    return (
      <>
        {showWarning && (
          <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
            You don't have access to this page. Redirecting...
          </div>
        )}
        <Navigate to="/unauthorized" /> {/* Redirect to unauthorized page */}
      </>
    );
  }

  return children; // Render SupplierDashboard content
};

export default ProtectedSupplierDashboard;
