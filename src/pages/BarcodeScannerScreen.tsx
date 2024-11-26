import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useZxing } from "react-zxing";
import { Package, ShoppingCart, Barcode, Loader2, RefreshCcw, AlertCircle, CheckCircle2 } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);

  const { ref } = useZxing({
    onDecodeResult(result) {
      setScannedData(result.getText());
      setShowScanner(false);
      setError(null);
    },
    onError(err) {
      console.error("Camera error:", err);
      setError("Camera access failed or not available.");
    },
  });

  useEffect(() => {
    if (scannedData) {
      const fetchProduct = async () => {
        setIsLoading(true);
        try {
          const productRef = doc(db, "products", scannedData);
          const productDoc = await getDoc(productRef);
          if (productDoc.exists()) {
            const fetchedProduct = { id: productDoc.id, ...productDoc.data() };
            setScannedProduct(fetchedProduct);

            if (fetchedProduct.id === product?.id) {
              setVerificationMessage("Product verified successfully!");
            } else {
              setVerificationMessage("Product verification failed. Please check and try again.");
            }
            setError(null);
          } else {
            setError("Product not found in our database.");
            setScannedProduct(null);
          }
        } catch (err) {
          console.error("Error fetching product:", err);
          setError("Error fetching product details.");
          setScannedProduct(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [scannedData, product]);

  const handleAddToCart = () => {
    if (scannedProduct) {
      addToCart({ id: scannedProduct.id, name: scannedProduct.name });
      navigate("/");
    }
  };

  const handleScanAgain = () => {
    setShowScanner(true);
    setScannedData(null);
    setScannedProduct(null);
    setVerificationMessage("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Barcode className="w-8 h-8 text-blue-200 mr-3" />
              <h1 className="text-4xl font-bold text-white">Barcode Scanner</h1>
            </div>
            <p className="text-xl text-blue-100">
              {product ? `Verifying: ${product.name}` : "Scan a product barcode"}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Scanner Card */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="p-6">
              {showScanner ? (
                <div className="space-y-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-900">
                    <video
                      ref={ref}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                    />
                    <div className="absolute inset-0 border-2 border-blue-500 opacity-50 animate-pulse" />
                  </div>
                  <p className="text-center text-gray-600">
                    Center the barcode within the frame to scan
                  </p>
                </div>
              ) : isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Processing scan...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {error ? (
                    <div className="flex items-center justify-center text-red-500 gap-2">
                      <AlertCircle className="w-6 h-6" />
                      <span>{error}</span>
                    </div>
                  ) : (
                    verificationMessage && (
                      <div className={`flex items-center justify-center gap-2 ${verificationMessage.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
                        {verificationMessage.includes("successfully") ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <AlertCircle className="w-6 h-6" />
                        )}
                        <span>{verificationMessage}</span>
                      </div>
                    )
                  )}

                  {scannedProduct && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Scanned Product</h3>
                      <div className="space-y-2">
                        <p className="text-gray-600">Name: <span className="font-medium text-gray-800">{scannedProduct.name}</span></p>
                        <p className="text-gray-600">Price: <span className="font-medium text-gray-800">${scannedProduct.price.toFixed(2)}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!showScanner && (
              <button
                onClick={handleScanAgain}
                className="flex items-center justify-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RefreshCcw className="w-5 h-5 mr-2" />
                <span className="font-medium">Scan Again</span>
              </button>
            )}
            {scannedProduct && (
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                <span className="font-medium">Add to Cart</span>
              </button>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="w-full mt-4 bg-gray-100 text-gray-600 rounded-lg py-3 px-6 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}