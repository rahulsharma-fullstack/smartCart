import React, { useState } from "react";
import { useZxing } from "react-zxing";

const BarcodeScanner = () => {
  const [data, setData] = useState("No barcode detected");
  const [error, setError] = useState(null);

  const { ref } = useZxing({
    onDecodeResult(result) {
      setData(result.getText());
      setError(null); // Clear error if a valid barcode is scanned
    },
    onError(err) {
      console.error("Camera error:", err);
      setError("Camera access failed or not available.");
    },
  });

  const handleReset = () => {
    setData("No barcode detected");
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">React Barcode Scanner</h1>
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
        <video
          ref={ref}
          className="w-full rounded-lg border border-gray-300"
          autoPlay
          muted
        />
      </div>
      <p className="mt-4 text-lg">
        {error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          `Scanned Data: ${data}`
        )}
      </p>
      <button
        onClick={handleReset}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reset
      </button>
    </div>
  );
};

export default BarcodeScanner;
