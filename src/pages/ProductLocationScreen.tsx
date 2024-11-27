import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import StoreAisle from '../components/StoreAisle';
import { MapPin, Package, Layers, CheckCircle, Loader2 } from 'lucide-react';

export default function ProductLocationScreen() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState({ x: 0, y: 0 });
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product location...</p>
        </div>
      </div>
    );
  }

  if (!product) {
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

  const { name, aisle, shelf, price } = product;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-blue-200 mr-3" />
              <h1 className="text-2xl font-bold text-white">Product Location</h1>
            </div>
            <p className="text-lg md:text-xl text-blue-100">
              Finding: {name}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Product Info Card */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="p-6">
              {/* <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <img
                    src="../no_img.png"
                    alt={name}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
                    <p className="text-blue-600 font-medium">${price?.toFixed(2)}</p>
                  </div>
                </div>
              </div> */}

              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Layers className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-gray-600 font-medium">Aisle</span>
                  </div>
                  <p className="text-xl font-bold text-blue-600">{aisle}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Package className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-gray-600 font-medium">Shelf</span>
                  </div>
                  <p className="text-xl font-bold text-blue-600">{shelf}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Store Map */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="text-lg font-medium text-gray-800">Store Layout</h3>
            </div>
            <div className="p-4">
              <StoreAisle />
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate(`/product-details/${productId}`)}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg py-4 px-6 flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <CheckCircle className="w-6 h-6 mr-2" />
            <span className="text-lg font-medium">I've Reached the Product</span>
          </button>
        </div>
      </div>
    </div>
  );
}