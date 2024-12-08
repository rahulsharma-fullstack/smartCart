// CheckoutScreen.jsx
import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  CreditCard, 
  Package, 
  ChevronRight,
  Gauge,
  ClipboardList,
  User,
  X
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// BarcodeModal Component
const BarcodeModal = ({ isOpen, onClose, total, items }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-6">
          {/* Cart Icon and Title */}
          <div className="flex items-center">
            <ShoppingBag className="w-6 h-6 text-gray-600" />
            <p className="ml-2 text-gray-700">Here we have today</p>
          </div>

          {/* Items List */}
          <div className="space-y-4 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                </div>
                <span className="flex-grow mx-4 text-gray-700">{item.name}</span>
                <span className="text-gray-700">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center border-t pt-4">
            <span className="font-medium">Total</span>
            <div className="flex items-center">
              <span className="font-medium">${total.toFixed(2)}</span>
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Save $5.00 today!
              </span>
            </div>
          </div>

          {/* Barcode Section */}
          <div className="text-center space-y-4">
            <p className="text-gray-600">Can be scanned to checkout</p>
            <div className="mx-auto bg-pink-50 rounded-2xl p-6">
              <svg className="mx-auto" width="200" height="80" viewBox="0 0 200 80">
                <rect x="10" y="10" width="180" height="60" fill="none" stroke="black" strokeWidth="2"/>
                {Array.from({ length: 30 }).map((_, i) => (
                  <rect
                    key={i}
                    x={20 + (i * 5)}
                    y="20"
                    width="2"
                    height="40"
                    fill="black"
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Gauge className="w-6 h-6 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <CreditCard className="w-6 h-6 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ClipboardList className="w-6 h-6 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <User className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main CheckoutScreen Component
export default function CheckoutScreen() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProductsData(products);
      } catch (e) {
        console.error('Error fetching products:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const cartItems = cart.map((item) => {
    if (item.name && item.price) {
      return item;
    }
    return productsData.find((product) => product.id === item.id);
  }).filter(Boolean);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-blue-200 mr-3" />
              <h1 className="text-4xl font-bold text-white">Checkout</h1>
            </div>
            <p className="text-xl text-blue-100">
              Review your order details
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order Summary */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                  
                  {cartItems.length > 0 ? (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Package className="w-6 h-6 text-blue-500 mr-3" />
                            <div>
                              <h3 className="font-medium text-gray-800">{item.name}</h3>
                              <p className="text-sm text-gray-500">Standard delivery</p>
                            </div>
                          </div>
                          <span className="font-semibold text-gray-800">${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-600 mb-2">Your cart is empty</h3>
                      <p className="text-gray-500 mb-4">Add some items to get started</p>
                      <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={cartItems.length === 0}
                    className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Place Order</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => navigate('/')}
                    className="w-full mt-4 px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Home className="w-5 h-5" />
                    <span>Continue Shopping</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barcode Modal */}
      <BarcodeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        total={total}
        items={cartItems}
      />
    </div>
  );
}