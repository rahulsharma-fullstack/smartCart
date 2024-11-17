import React, { useState } from "react";

import BarcodeScannerComponent from "react-qr-barcode-scanner";


const BarcodeScanner = () => {
  const [data, setData] = useState("No barcode detected");
  const [error, setError] = useState(null);

  const handleScan = (result) => {
    if (result) {
      setData(result.text);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError("Camera access failed or not available.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">React Barcode Scanner</h1>
      <div className="bg-white p-4 rounded shadow-lg">
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={(err, result) => {
          if (result) setData(result.text);
          else setData("Not Found");
        }}
      />
      </div>
      <p className="mt-4 text-lg">
        {error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          `Scanned Data: ${data}`
        )}
      </p>
    </div>
  );
};

export default BarcodeScanner;
