import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Package, ShoppingCart, Barcode, LayersIcon, MapPin, Loader2, Box } from "lucide-react";

export default function ProductDetailScreen() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      addToCart({ id: product.id, name: product.name });
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-600 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-4">We couldn't find the product you're looking for.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
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
              <Package className="w-8 h-8 text-blue-200 mr-3" />
              <h1 className="text-4xl font-bold text-white">Product Details</h1>
            </div>
            <p className="text-xl text-blue-100">
              {product.name}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Product Info Card */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <img
                    src="/api/placeholder/100/100"
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{product.name}</h2>
                    <p className="text-blue-600 text-xl font-medium">${product.price?.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-gray-600 font-medium">Aisle</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{product.aisle}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <LayersIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-gray-600 font-medium">Shelf</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{product.shelf}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Box className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-gray-600 font-medium">Category</span>
                  </div>
                  <p className="text-xl font-bold text-blue-600">{product.category}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate(`/scan/${product.id}`, { state: { product } })}
                  className="flex items-center justify-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-md"
                >
                  <Barcode className="w-5 h-5 mr-2" />
                  <span className="font-medium">Verify with Barcode</span>
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  <span className="font-medium">Add to Cart</span>
                </button>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-100 text-gray-600 rounded-lg py-3 px-6 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}