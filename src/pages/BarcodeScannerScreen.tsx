import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import React from 'react'

export default function BarcodeScannerScreen() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [scanning, setScanning] = useState(false)

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      addToCart(productId)
      navigate('/')
    }, 2000)
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Scan Product Barcode</h1>
      <div className="bg-gray-200 w-64 h-64 flex items-center justify-center mb-4">
        {scanning ? (
          <div className="animate-pulse text-2xl">Scanning...</div>
        ) : (
          <div className="text-2xl">Camera Viewfinder</div>
        )}
      </div>
      <button
        onClick={handleScan}
        disabled={scanning}
        className="w-full max-w-xs px-4 py-2 text-lg text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
      >
        {scanning ? 'Scanning...' : 'Scan Barcode'}
      </button>
    </div>
  )
}