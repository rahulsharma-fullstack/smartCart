import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import your Firebase db configuration

export default function CartScreen() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [products, setProducts] = useState({});
  const [recommendations, setRecommendations] = useState({});

  // Fetch products and recommendations from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      const productsData = {};
      const recommendationsData = {};

      // Fetch products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      productsSnapshot.forEach((doc) => {
        const productData = doc.data();
        productsData[doc.id] = {
          id: doc.id,
          name: productData.name,
          price: productData.price,
        };
      });

      // Fetch recommendations
      const recommendationsSnapshot = await getDocs(collection(db, 'recommendations'));
      recommendationsSnapshot.forEach((doc) => {
        recommendationsData[doc.id] = doc.data().recommendedProductIds || [];
      });

      setProducts(productsData);
      setRecommendations(recommendationsData);
    };

    fetchProducts();
  }, []);

  // Get cart items and total
  const cartItems = cart.map((productId) => products[productId]);
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Get the last added product and its recommendations
  const lastAddedProduct = cart[cart.length - 1];
  const recommendedProductIds = recommendations[lastAddedProduct]?.map((id) => products[id]) || [];

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span>{item.name}</span>
            <span>${item.price.toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      {recommendedProductIds.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Recommended Products</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {recommendedProductIds.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/location/${product.id}`)}
              >
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <button
        onClick={() => alert('Checkout process not implemented in this demo')}
        className="w-full px-4 py-2 text-lg text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
