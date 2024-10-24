import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';
import productsData from '../data/dummyData.json'; // Import the JSON file

// Assuming recommendations are static for now
const recommendations = {
    1: [2, 3],
    2: [1, 4],
    3: [1, 2],
    4: [2, 3],
};

const previousPurchases = [
    { id: 1, name: 'Skimmed Milk', price: 2.99, lastPurchased: '2024-03-15' },
    { id: 3, name: 'Organic Milk', price: 4.99, lastPurchased: '2024-03-10' },
];

export default function SearchScreen() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const { cart } = useCart();

    const lastAddedProduct = cart[cart.length - 1];
    const recommendedProducts = recommendations[lastAddedProduct]?.map((id) => productsData[id]) || [];
    const hasItemsInCart = cart.length > 0;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/products/${encodeURIComponent(query.trim())}`);
            setShowSuggestions(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim()) {
            const filteredProducts = Object.values(productsData).filter(product =>
                product.name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredProducts);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
        setSelectedIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (suggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
            } else if (e.key === 'Enter' && selectedIndex >= 0) {
                e.preventDefault();
                const selected = suggestions[selectedIndex];
                handleSuggestionClick(selected);
            } else if (e.key === 'Escape') {
                setShowSuggestions(false);
            }
        }
    };

    const handleSuggestionClick = (product) => {
        setQuery(product.name);
        navigate(`/products/${encodeURIComponent(product.name)}`);
        setShowSuggestions(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-3xl font-bold mb-8">Find Products in Store</h1>
            <div className="w-full max-w-md relative" ref={searchRef}>
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search for a product..."
                        className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Search
                    </button>
                </form>

                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((product, index) => (
                            <div
                                key={product.id}
                                onClick={() => handleSuggestionClick(product)}
                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                    index === selectedIndex ? 'bg-gray-100' : ''
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{product.name}</span>
                                    <span className="text-gray-600">${product.price.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rest of your existing JSX for recommendations and previous purchases */}
            <div className="mt-12 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">
                    {hasItemsInCart ? 'Recommended Products' : 'Previous Purchases'}
                </h2>

                {hasItemsInCart ? (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {recommendedProducts.length > 0 ? (
                            recommendedProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
                                    onClick={() => navigate(`/location/${product.id}`)}
                                >
                                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                                    <p className="text-gray-600">${product.price.toFixed(2)}</p>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-2 text-center text-gray-500">
                                No recommendations available for your current cart items.
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {previousPurchases.length > 0 ? (
                            previousPurchases.map((purchase) => (
                                <div
                                    key={purchase.id}
                                    className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
                                    onClick={() => navigate(`/location/${purchase.id}`)}
                                >
                                    <h3 className="text-lg font-semibold mb-2">{purchase.name}</h3>
                                    <p className="text-gray-600">${purchase.price.toFixed(2)}</p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Last purchased: {new Date(purchase.lastPurchased).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-2 text-center text-gray-500">
                                No previous purchases found.
                            </p>
                        )}
                    </div>
                )}

                {hasItemsInCart && (
                    <button
                        onClick={() => navigate('/checkout')}
                        className="w-full px-4 py-2 text-lg text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Proceed to Checkout
                    </button>
                )}
            </div>
        </div>
    );
}
