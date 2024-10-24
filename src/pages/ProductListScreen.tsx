import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productsData from '../data/dummyData.json'; // Assuming this imports your products data

export default function ProductListScreen() {
  const { query } = useParams();
  const navigate = useNavigate();

  // Filter products based on the search query
  const filteredProducts = Object.values(productsData).filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Results for "{query}"</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/location/${product.id}`)} // Navigate to ProductLocationScreen
          >
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600">Price: ${product.price.toFixed(2)}</p>
            <p className="text-gray-600">Size: {product.size || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
