import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ShoppingCart, Package, ArrowRight, Plus, Sparkles } from 'lucide-react';

export default function CartScreen() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [products, setProducts] = useState({});
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsData = {};
        const recommendationsData = {};

        const productsSnapshot = await getDocs(collection(db, 'products'));
        productsSnapshot.forEach((doc) => {
          const productData = doc.data();
          productsData[doc.id] = {
            id: doc.id,
            name: productData.name,
            price: productData.price,
          };
        });

        const recommendationsSnapshot = await getDocs(collection(db, 'recommendations'));
        recommendationsSnapshot.forEach((doc) => {
          recommendationsData[doc.id] = doc.data().recommendedProductIds || [];
        });

        setProducts(productsData);
        setRecommendations(recommendationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const cartItems = cart.map((productId) => products[productId]);
  const total = cartItems.reduce((sum, item) => sum + (item?.price || 0), 0);
  const lastAddedProduct = cart[cart.length - 1];
  const recommendedProductIds = recommendations[lastAddedProduct]?.map((id) => products[id]) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <ShoppingCart className="w-8 h-8 text-blue-200 mr-3" />
              <h1 className="text-4xl font-bold text-white">Your Cart</h1>
            </div>
            <p className="text-xl text-blue-100">
              {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="p-6">
              {cartItems.length > 0 ? (
                <>
                  {cartItems.map((item, index) => (
                    <div
                      key={`${item?.id}-${index}`}
                      className="flex items-center justify-between py-4 border-b last:border-b-0"
                    >
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">{item?.name}</h3>
                          <p className="text-blue-600 font-medium">${item?.price?.toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/location/${item?.id}`)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Find Item
                      </button>
                    </div>
                  ))}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-semibold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => alert('Checkout process not implemented in this demo')}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg py-4 px-6 flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <ArrowRight className="w-6 h-6 mr-2" />
                      <span className="text-lg font-medium">Proceed to Checkout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Start adding items to your cart</p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Products
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Products */}
          {recommendedProductIds.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-4 bg-gray-50 border-b flex items-center">
                <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-800">Recommended Products</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedProductIds.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/location/${product.id}`)}
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <Plus className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{product.name}</h4>
                          <p className="text-blue-600">${product.price?.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}