import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { ShoppingCart } from 'lucide-react'
import React from 'react'

export default function CartIcon() {
  const navigate = useNavigate()
  const { cart } = useCart()
  const [isHovered, setIsHovered] = useState(false)

  // Mock product data (replace with actual data in a real application)
  const products = {
    1: { id: 1, name: 'Skimmed Milk', price: 2.99 },
    2: { id: 2, name: 'Full-Cream Milk', price: 3.49 },
    3: { id: 3, name: 'Organic Milk', price: 4.99 },
    4: { id: 4, name: 'Lactose-Free Milk', price: 3.99 },
  }

  const cartItems = cart.map(id => products[id])
  const totalItems = cart.length
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <div 
      className="fixed top-4 right-4 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="bg-orange-400 p-2 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:bg-orange-500"
       
      >
        <ShoppingCart className="w-6 h-6 text-white" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </div>
      
      {isHovered && totalItems > 0 && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 ease-in-out">
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">Cart ({totalItems} items)</h3>
            <div className="max-h-48 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-semibold">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-bold">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <button 
                onClick={() => navigate('/cart')}
                className="w-full px-4 py-2 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-600 transition-colors duration-300"
              >
                View Cart
              </button>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full px-4 py-2 text-sm text-white bg-orange-500 rounded hover:bg-orange-600 transition-colors duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}