import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext'


const products = {
    1: { id: 1, name: 'Skimmed Milk', price: 2.99 },
    2: { id: 2, name: 'Full-Cream Milk', price: 3.49 },
    3: { id: 3, name: 'Organic Milk', price: 4.99 },
    4: { id: 4, name: 'Lactose-Free Milk', price: 3.99 },
  }

const recommendations = {
    1: [2, 3],
    2: [1, 4],
    3: [1, 2],
    4: [2, 3],
  }
  

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { cart } = useCart()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products/${encodeURIComponent(query)}`);
    }
  };
  const lastAddedProduct = cart[cart.length - 1]
  const recommendedProducts = recommendations[lastAddedProduct]?.map((id) => products[id]) || []

  return (
    <>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Find Products in Store</h1>
      <form onSubmit={handleSearch} className="w-full max-w-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a product..."
          className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full mt-4 px-4 py-2 text-lg text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </form>
    <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Recommended Products</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {recommendedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/location/${product.id}`)}
          >
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600">${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => alert('Checkout process not implemented in this demo')}
        className="w-full px-4 py-2 text-lg text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Proceed to Checkout
      </button>
    </div>
    </div>
    </>
  );
}
