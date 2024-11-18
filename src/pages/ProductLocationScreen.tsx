import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import the Firebase db configuration
import StoreAisle from '../components/StoreAisle';

export default function ProductLocationScreen() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState({ x: 0, y: 0 });
  const [product, setProduct] = useState(null);

  // Fetch product data from Firestore based on productId
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

  

  // Handle case when product is not found
  if (!product) {
    return <p>Loading product data...</p>;
  }

  const { aisle, shelf } = product;

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Product Location</h1>
      <div className="bg-white p-4 rounded-lg shadow m-8">
        <p className="text-xl text-center">Aisle : {aisle}</p>
        <p className="text-xl text-center mt-3">Shelf : {shelf}</p>
      </div>
      <div className="bg-gray-300 w-auto h-auto mb-8 mt-4" id='map'>
        <StoreAisle/>
      </div>
      <button
        onClick={() => navigate(`/scan/${productId}`)}
        className="w-full px-4 py-2 text-lg text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        I've reached the product
      </button>
    </div>
  );
}
