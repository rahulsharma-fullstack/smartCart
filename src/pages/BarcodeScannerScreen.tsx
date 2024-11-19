import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export default function BarcodeScannerScreen() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(location.state?.product || null);
  const [verificationMessage, setVerificationMessage] = useState("");

  // Fetch product details based on the scanned barcode
  useEffect(() => {
    if (scannedData) {
      const fetchProduct = async () => {
        try {
          const productRef = doc(db, "products", scannedData);
          const productDoc = await getDoc(productRef);
          if (productDoc.exists()) {
            setError(null);
            setVerificationMessage(""); // Clear any existing messages
          } else {
            setError("Product not found.");
          }
        } catch (err) {
          console.error("Error fetching product:", err);
          setError("Error fetching product.");
        }
      };
      fetchProduct();
    }
  }, [scannedData]);

  const handleScan = (result) => {
    if (result) {
      setScannedData(result.text);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id);
      navigate("/"); // Redirect after adding to cart
    }
  };

  const handleVerifyProduct = () => {
    if (scannedData === product?.id) {
      setVerificationMessage("Product Verified! The IDs match.");
    } else {
      setVerificationMessage("Product Mismatch! The IDs do not match.");
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Scan Product Barcode</h1>
      <div className="bg-gray-200 w-64 h-64 flex items-center justify-center mb-4">
        <BarcodeScannerComponent
          width={200}
          height={300}
          onUpdate={(err, result) => {
            if (result) handleScan(result);
            else setError("Not Found");
          }}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {product && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Product Details</h2>
          <p>Name: {product.name}</p>
          <p>Price: ${product.price.toFixed(2)}</p>
        </div>
      )}
      <div className="flex flex-col items-center mt-4 space-y-4">
        {/* Button to add product directly to cart */}
        <button
          onClick={handleAddToCart}
          disabled={!product}
          className="w-full max-w-xs px-4 py-2 text-lg text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          Add to Cart
        </button>
        {/* Button to verify the product */}
        <button
          onClick={handleVerifyProduct}
          disabled={!product || !scannedData}
          className="w-full max-w-xs px-4 py-2 text-lg text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
        >
          Verify Product
        </button>
        {verificationMessage && (
          <p
            className={`text-lg font-semibold ${
              verificationMessage.includes("Verified")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {verificationMessage}
          </p>
        )}
      </div>
    </div>
  );
}
