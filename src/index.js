import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18
import App from './App';
import { UserAuthProvider } from './UserAuth';
import { CartProvider } from './CartContext';

// Get the root element
const rootElement = document.getElementById('root');

// Create a root
const root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
  <React.StrictMode>
    <UserAuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </UserAuthProvider>
  </React.StrictMode>
);
