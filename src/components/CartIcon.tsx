import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ChevronRight, ShoppingBag } from 'lucide-react';
import React from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function CartIcon() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        let total = 0;
        const items = await Promise.all(
          cart.map(async (product) => {
            if (product.name && product.price) {
              total += product.price;
              return product;
            } else {
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

        setCartItems(items.filter(Boolean));
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
      {/* Cart Icon Button */}
      <div className="bg-blue-600 p-3 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:bg-blue-700 relative group">
        <ShoppingCart className="w-6 h-6 text-white" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
            {totalItems}
          </span>
        )}
      </div>

      {/* Cart Popup */}
      {isHovered && totalItems > 0 && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 transition-all duration-300 ease-in-out overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingBag className="w-5 h-5 text-blue-100 mr-2" />
                <h3 className="font-bold text-lg text-white">Your Cart</h3>
              </div>
              <span className="text-blue-100 text-sm">{totalItems} items</span>
            </div>
          </div>

          {/* Cart Items */}
          <div className="p-4">
            <div className="max-h-48 overflow-y-auto space-y-2">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-blue-600 font-semibold">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="border-t border-gray-100 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-lg font-bold text-blue-600">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => navigate('/cart')}
                className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300 flex items-center justify-center"
              >
                View Cart
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
              >
                Proceed to Checkout
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}