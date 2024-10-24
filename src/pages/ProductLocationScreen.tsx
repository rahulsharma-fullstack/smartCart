import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';
import productsData from '../data/dummyData.json'; // Adjust the path as necessary

export default function ProductLocationScreen() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setUserLocation((prev) => ({
        x: Math.min(100, Math.max(0, prev.x + (Math.random() * 2 - 1))),
        y: Math.min(100, Math.max(0, prev.y + (Math.random() * 2 - 1))),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Find the product by ID
  const product = productsData[productId];

  // Debugging output
  console.log("Product ID from URL:", productId);
  if (!product) {
    return <p>Product not found.</p>; // Handle the case where the productId does not exist
  }

  const { aisle, shelf } = product; // Extract aisle and shelf from product

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Product Location</h1>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <p className="text-xl">Aisle: {aisle}</p>
        <p className="text-xl">Shelf: {shelf}</p>
      </div>
      <div className="bg-gray-200 w-full h-64 relative mb-4">
        <div
          className="absolute w-4 h-4 bg-blue-500 rounded-full"
          style={{ left: `${userLocation.x}%`, top: `${userLocation.y}%` }}
        ></div>
        <div
          className="absolute w-4 h-4 bg-red-500 rounded-full"
          style={{ left: '50%', top: '50%' }}
        ></div>
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
