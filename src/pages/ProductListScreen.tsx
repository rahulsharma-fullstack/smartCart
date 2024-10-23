import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// Mock data for demonstration
const products = [
  { id: 1, name: 'Skimmed Milk', price: 2.99, size: '1L' },
  { id: 2, name: 'Full-Cream Milk', price: 3.49, size: '2L' },
  { id: 3, name: 'Organic Milk', price: 4.99, size: '1L' },
  { id: 4, name: 'Lactose-Free Milk', price: 3.99, size: '1L' },
]

export default function ProductListScreen() {
  const { query } = useParams()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Results for "{query}"</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/location/${product.id}`)}
          >
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600">Price: ${product.price}</p>
            <p className="text-gray-600">Size: {product.size}</p>
          </div>
        ))}
      </div>
    </div>
  )
}