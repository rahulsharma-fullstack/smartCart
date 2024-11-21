import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import React from 'react';
import { db } from '../firebaseConfig'; // Import your Firebase db configuration
import { doc, getDoc } from 'firebase/firestore';

export default function CartIcon() {
  const navigate = useNavigate();
  const { cart } = useCart(); // Cart now contains full product objects
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate cart items and subtotal
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        let total = 0;

        // Check if the cart items already have full details
        const items = await Promise.all(
          cart.map(async (product) => {
            if (product.name && product.price) {
              total += product.price;
              return product; // Use the existing product if it has details
            } else {
              // Fetch product from Firestore using ID if details are missing
              const productDoc = await getDoc(doc(db, 'products', product.id));
              if (productDoc.exists()) {
                const fetchedProduct = productDoc.data();
                total += fetchedProduct.price;
                return { id: product.id, ...fetchedProduct };
              } else {
                console.error('No product found for ID:', product.id);
                return null;
              }
            }
          })
        );

        setCartItems(items.filter(Boolean)); // Filter out null values
        setSubtotal(total);
      } catch (error) {
        console.error('Error fetching cart items from Firestore:', error);
      }
    };

    fetchCartItems();
  }, [cart]);

  const totalItems = cartItems.length;

  return (
    <div
      className="fixed top-4 right-4 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="bg-orange-400 p-2 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:bg-orange-500"
      >
        <ShoppingCart className="w-6 h-6 text-white" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </div>

      {isHovered && totalItems > 0 && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 ease-in-out">
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">Cart ({totalItems} items)</h3>
            <div className="max-h-48 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-semibold">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-bold">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => navigate('/cart')}
                className="w-full px-4 py-2 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-600 transition-colors duration-300"
              >
                View Cart
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full px-4 py-2 text-sm text-white bg-orange-500 rounded hover:bg-orange-600 transition-colors duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
