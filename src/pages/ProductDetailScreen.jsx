import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Firebase configuration
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function ProductDetailScreen() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", productId);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          setProduct({ id: productDoc.id, ...productDoc.data() });
          setError(null);
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Error fetching product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id);
      navigate("/"); // Redirect to home or cart screen
    }
  };

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Product Details</h1>
      {product && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold">Name: {product.name}</h2>
          <p className="text-lg">Price: ${product.price.toFixed(2)}</p>
          <p className="text-lg">Category: {product.category}</p>
          <p className="text-lg">Aisle: {product.aisle}</p>
          <p className="text-lg">Shelf: {product.shelf}</p>
        </div>
      )}
      <div className="flex flex-col space-y-4 w-full max-w-md">
        {/* Option to verify the product */}
        <button
          onClick={() => navigate(`/scan/${product.id}`, { state: { product } })}
          className="w-full px-4 py-2 text-lg text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          Verify Product by Scanning Barcode
        </button>
        {/* Option to add product directly to the cart */}
        <button
          onClick={handleAddToCart}
          className="w-full px-4 py-2 text-lg text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add to Cart Directly
        </button>
      </div>
    </div>
  );
}
