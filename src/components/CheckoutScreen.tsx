import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react'; // Import the Home icon
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import Firestore configuration

export default function CheckoutScreen() {
  const { cart } = useCart();
  const [productsData, setProductsData] = useState([]); // State for products data
  const navigate = useNavigate(); // Initialize navigate function

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductsData(products);
      } catch (e) {
        console.error('Error fetching products: ', e);
      }
    };

    fetchProducts();
  }, []);

  // Get cart items based on product IDs in the cart
  const cartItems = cart.map(id => productsData.find(item => item.id === id)).filter(item => item); // Filter out undefined items

  // Check if there are any valid cart items to prevent errors in subtotal calculation
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0); // Default to 0 if price is undefined

  return (
    <div className="min-h-screen p-4 pt-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <button
          onClick={() => navigate('/')} // Navigate to the home page
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-300"
        >
          <Home className="w-6 h-6 text-gray-700" />
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center font-bold">
            <span>Total:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => alert('Checkout process not implemented in this demo')}
        className="w-full px-4 py-2 text-lg text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        Place Order
      </button>
    </div>
  );
}
