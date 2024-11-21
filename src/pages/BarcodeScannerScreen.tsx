import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useZxing } from "react-zxing";

export default function BarcodeScannerScreen() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(location.state?.product || null);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [showScanner, setShowScanner] = useState(true);

  const { ref } = useZxing({
    onDecodeResult(result) {
      setScannedData(result.getText());
      setShowScanner(false); // Hide scanner after successful scan
      setError(null); // Clear previous errors
    },
    onError(err) {
      console.error("Camera error:", err);
      setError("Camera access failed or not available.");
    },
  });

  // Fetch product details based on the scanned barcode
  useEffect(() => {
    if (scannedData) {
      const fetchProduct = async () => {
        try {
          const productRef = doc(db, "products", scannedData);
          const productDoc = await getDoc(productRef);
          if (productDoc.exists()) {
            const fetchedProduct = { id: productDoc.id, ...productDoc.data() };
            setScannedProduct(fetchedProduct);

            // Verify the product (if needed)
            if (fetchedProduct.id === product?.id) {
              setVerificationMessage("Product Verified! The IDs match.");
            } else {
              setVerificationMessage(
                "Scanned product differs from the current product."
              );
            }

            setError(null);
          } else {
            setError("Product not found.");
            setScannedProduct(null);
          }
        } catch (err) {
          console.error("Error fetching product:", err);
          setError("Error fetching product.");
          setScannedProduct(null);
        }
      };
      fetchProduct();
    }
  }, [scannedData]);

  const handleAddToCart = () => {
    if (scannedProduct) {
      addToCart({ id: scannedProduct.id, name: scannedProduct.name });// Add the scanned product to cart
      navigate("/"); // Redirect after adding to cart
    }
  };

  const handleScanAgain = () => {
    window.location.reload(); // Refresh the page when Scan Again is clicked
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Scan Product Barcode</h1>

      {/* Barcode Scanner */}
      {showScanner && (
        <div className="bg-gray-200 w-64 h-30 flex items-center justify-center mb-4">
          <video
            ref={ref}
            className="w-full rounded-lg border border-gray-300"
            autoPlay
            muted
          />
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Verification Message */}
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

      {/* Product Details */}
      {scannedProduct && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Scanned Product Details</h2>
          <p>Name: {scannedProduct.name}</p>
          <p>Price: ${scannedProduct.price.toFixed(2)}</p>
        </div>
      )}

      {/* Expected Product Details */}
      {product && scannedProduct && scannedProduct.id !== product.id && (
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-red-500">Expected Product</h2>
          <p>Name: {product.name}</p>
          <p>Price: ${product.price.toFixed(2)}</p>
        </div>
      )}

      {/* Add to Cart Button */}
      {scannedProduct && (
        <button
          onClick={handleAddToCart}
          className="w-full max-w-xs px-4 py-2 mt-4 text-lg text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add to Cart
        </button>
      )}

      {/* Scan Again Button */}
      {!showScanner && (
        <button
          onClick={handleScanAgain}
          className="w-full max-w-xs px-4 py-2 mt-4 text-lg text-white bg-gray-500 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Scan Again
        </button>
      )}
    </div>
  );
}
