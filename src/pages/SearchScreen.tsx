import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import Firebase db configuration
import axios from "axios"; // Add axios for API requests

export default function SearchScreen() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [productsData, setProductsData] = useState([]); // State for Firestore products
    const [recommendedProducts, setRecommendedProducts] = useState([]); // State for AI-based recommendations
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const { cart } = useCart();

    const hasItemsInCart = cart.length > 0;
    const lastAddedProduct = hasItemsInCart ? cart[cart.length - 1] : null;

    // Fetch products from Firestore
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProductsData(products);
            } catch (e) {
                console.error("Error fetching products: ", e);
            }
        };

        fetchProducts();
    }, []);
    useEffect(() => {
        
        const fetchRecommendations = async () => {
            // Toggle for development/testing mode
            const useMockResponse = false; // Change to false to use actual API
            // console.log(import.meta.env);

            if (lastAddedProduct) {
                try {
                    if (useMockResponse) {
                        // Dummy response for testing
                        const recommendedItems = ["Milk", "Chocolate", "Cookies"];
                        console.log("Using mock recommendations:", recommendedItems);
                        setRecommendedProducts(recommendedItems);
                    } else {
                        // Actual API call
                        const response = await axios.post(
                            "https://api.openai.com/v1/chat/completions",
                            {
                                model: "gpt-3.5-turbo-0125",
                                messages: [
                                    {
                                        role: "user",
                                        content: `Suggest 3 products that can be bought with ${lastAddedProduct.name}, in one-word array.`
                                    }
                                ]
                            },
                            {
                                headers: {
                                    "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                                    "Content-Type": "application/json"
                                }
                            }
                        );
    
                        const recommendedItemsText = response.data.choices[0].message.content;
                        console.log("AI Response:", recommendedItemsText);
    
                        // Parse the API response
                        const recommendedItems = recommendedItemsText
                            .split("\n")
                            .map(item => item.replace(/^\d+\.\s*/, ""))
                            .filter(item => item.trim() !== "");
    
                        console.log("Parsed Recommendations:", recommendedItems);
                        setRecommendedProducts(recommendedItems);
                    }
                } catch (error) {
                    console.error("Error fetching recommendations: ", error);
                    setRecommendedProducts([]);
                }
            }
        };
    
        fetchRecommendations();
    }, [lastAddedProduct]);
    
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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
            const filteredProducts = productsData.filter((product) =>
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
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
            } else if (e.key === "Enter" && selectedIndex >= 0) {
                e.preventDefault();
                const selected = suggestions[selectedIndex];
                handleSuggestionClick(selected);
            } else if (e.key === "Escape") {
                setShowSuggestions(false);
            }
        }
    };

    const handleSuggestionClick = (product) => {
        setQuery(product.name);
        navigate(`/products/${encodeURIComponent(product.name)}`);
        setShowSuggestions(false);
    };

    // Handle Recommendation Click
    const handleRecommendationClick = (productName) => {
        setQuery(productName);
        navigate(`/products/${encodeURIComponent(productName)}`);
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
                                    index === selectedIndex ? "bg-gray-100" : ""
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

            {/* Recommendations Section */}
            {hasItemsInCart && recommendedProducts.length > 0 && (
                <div className="mt-12 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Customers also buys these items with {lastAddedProduct.name}</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {recommendedProducts.map((product, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => handleRecommendationClick(product)}
                            >
                                <h3 className="text-lg font-semibold mb-2">
                                    {product}
                                </h3>
                                {/* {product.price && <p className="text-gray-600">${product.price.toFixed(2)}</p>} */}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
