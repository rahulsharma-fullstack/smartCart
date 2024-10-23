import React from 'react'
import { useCart } from '../context/CartContext'

export default function CheckoutScreen() {
  const { cart } = useCart()

  // Mock product data (replace with actual data in a real application)
  const products = {
    1: { id: 1, name: 'Skimmed Milk', price: 2.99 },
    2: { id: 2, name: 'Full-Cream Milk', price: 3.49 },
    3: { id: 3, name: 'Organic Milk', price: 4.99 },
    4: { id: 4, name: 'Lactose-Free Milk', price: 3.99 },
  }

  const cartItems = cart.map(id => products[id])
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen p-4 pt-16">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span>{item.name}</span>
            <span>${item.price.toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center font-bold">
            <span>Total:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => alert('Checkout process not implemented in this demo')}
        className="w-full px-4 py-2 text-lg text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        Place Order
      </button>
    </div>
  )
}