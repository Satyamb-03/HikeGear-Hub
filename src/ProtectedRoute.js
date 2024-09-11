import React, { useEffect, useState } from "react";
import { useUserAuth } from './components/Context/UserAuth';
import { getDoc, doc } from "firebase/firestore";
import { db } from "./components/Context/firebase";  

const RESTRICTED_PATHS = ['/user-dashboard', '/supplier-dashboard'];

export const AdminRoute = ({ children }) => {
  const { user } = useUserAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setIsAdmin(userData.role === "admin");
          }
        } catch (error) {
          console.error("Error checking user role:", error);
        }
      }
      setLoading(false);
    };

    checkUserRole();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>You are not logged in. Please sign in to access this page.</div>;
  }

  const currentPath = window.location.pathname;

  if (isAdmin) {
    // Admins should not access these restricted paths
    if (RESTRICTED_PATHS.includes(currentPath)) {
      return <div>You do not have access to this page</div>;
    }
    return children;
  }

  // Non-admin users trying to access restricted pages or the Admin Dashboard
  if (currentPath === '/admin') {
    return <div>You are not allowed to access the Admin Dashboard</div>;
  }

  // For all other unauthorized access attempts
  return <div>You do not have access to this page</div>;
};
