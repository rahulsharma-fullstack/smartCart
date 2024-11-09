import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import React from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import the Firebase db configuration

export default function BarcodeScannerScreen() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [scanning, setScanning] = useState(false);
  const [product, setProduct] = useState(null);

  // Fetch product details from Firestore based on productId
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'products', productId);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          setProduct({ id: productDoc.id, ...productDoc.data() });
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      if (product) {
        addToCart(product.id); // Add only the productId to the cart
        navigate('/'); // Redirect to home or another page after adding
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Scan Product Barcode</h1>
      <div className="bg-gray-200 w-64 h-64 flex items-center justify-center mb-4">
        {scanning ? (
          <div className="animate-pulse text-2xl">Scanning...</div>
        ) : (
          <div className="text-2xl">Camera Viewfinder</div>
        )}
      </div>
      <button
        onClick={handleScan}
        disabled={scanning || !product}
        className="w-full max-w-xs px-4 py-2 text-lg text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
      >
        {scanning ? 'Scanning...' : 'Scan Barcode'}
      </button>

      {/* Optionally display product information */}
      {product && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Product Details</h2>
          <p>Name: {product.name}</p>
          <p>Price: ${product.price.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
