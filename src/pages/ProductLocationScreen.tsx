import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import React from 'react'

// Mock data for demonstration
const productLocations = {
  1: { aisle: 3, shelf: 2 },
  2: { aisle: 3, shelf: 3 },
  3: { aisle: 4, shelf: 1 },
  4: { aisle: 4, shelf: 2 },
}

export default function ProductLocationScreen() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [userLocation, setUserLocation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Simulate GPS location updates
    const interval = setInterval(() => {
      setUserLocation((prev) => ({
        x: prev.x + Math.random() * 2 - 1,
        y: prev.y + Math.random() * 2 - 1,
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const location = productLocations[productId]

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Product Location</h1>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <p className="text-xl">Aisle: {location.aisle}</p>
        <p className="text-xl">Shelf: {location.shelf}</p>
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
  )
}