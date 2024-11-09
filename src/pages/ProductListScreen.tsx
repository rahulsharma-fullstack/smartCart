import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import the Firebase db configuration

export default function ProductListScreen() {
  const { query } = useParams();
  const navigate = useNavigate();

  // State to hold the product data from Firestore
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Firestore when component mounts
  useEffect(() => {
    // Inside useEffect
const fetchProducts = async () => {
  setLoading(true);
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProductsData(products);
  } catch (e) {
    console.error('Error fetching products: ', e);
  } finally {
    setLoading(false);
  }
};

    fetchProducts();
  }, []);

  // Filter products based on the search query
  const filteredProducts = productsData.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Results for "{query}"</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/location/${product.id}`)} // Navigate to ProductLocationScreen
            >
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600">Price: ${product.price.toFixed(2)}</p>
              <p className="text-gray-600">Size: {product.size || 'N/A'}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products found for your search.</p>
        )}
      </div>
    </div>
  );
}
