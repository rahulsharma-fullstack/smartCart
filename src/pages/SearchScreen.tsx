import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Search } from "lucide-react";
import axios from "axios";

export default function SearchScreen() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [productsData, setProductsData] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
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
            const useMockResponse = false;
    
            if (!lastAddedProduct || !lastAddedProduct.name) {
                console.warn("No valid product to fetch recommendations for.");
                return;
            }
    
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
                                    content: `Suggest 6 products to buy with ${lastAddedProduct.name},  Return as 1 word JSON array of strings. e.g., ["Milk", "Butter", "Jam"]`,
                                },
                            ],
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
    // console.log(response)
                    // Validate response structure
                    if (!response.data || !response.data.choices || !response.data.choices[0].message) {
                        console.error("Unexpected API response structure:", response.data);
                        setRecommendedProducts([]);
                        return;
                    }
    
                    const recommendedItemsText = response.data.choices[0].message.content;
                    console.log("AI Response:", recommendedItemsText);
    
                    try {
                        // Handle stringified array responses
                        const recommendedItems = JSON.parse(recommendedItemsText);
    
                        if (Array.isArray(recommendedItems)) {
                            setRecommendedProducts(recommendedItems);
                        } else {
                            console.error("Unexpected response format, expected an array:", recommendedItems);
                            setRecommendedProducts([]);
                        }
                    } catch (err) {
                        console.error("Error parsing response as JSON:", err);
                        setRecommendedProducts([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching recommendations: ", error);
                setRecommendedProducts([]);
            }
        };
    
        // Debounced fetch
        const timeout = setTimeout(() => {
            fetchRecommendations();
        }, 500);
    
        return () => clearTimeout(timeout); // Cleanup
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
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
                        Find Products in Store
                    </h1>
                    <p className="text-blue-100 text-center mb-8 text-lg">
                        Search from our wide selection of products
                    </p>
                    
                    {/* Search Box */}
                    <div className="max-w-2xl mx-auto relative" ref={searchRef}>
                        <form onSubmit={handleSearch} className="relative">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => setShowSuggestions(true)}
                                    placeholder="Search for a product..."
                                    className="w-full pl-12 pr-24 py-4 text-lg border-0 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Search
                                </button>
                            </div>
                        </form>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 max-h-96 overflow-y-auto">
                                {suggestions.map((product, index) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleSuggestionClick(product)}
                                        className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                            index === selectedIndex ? "bg-gray-50" : ""
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-800">{product.name}</span>
                                            <span className="text-blue-600 font-semibold">${product.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recommendations Section */}
            {hasItemsInCart && recommendedProducts.length > 0 && (
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Frequently Bought Together with {lastAddedProduct.name}
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {recommendedProducts.map((product, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleRecommendationClick(product)}
                                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer group"
                                >
                                    <div className="aspect-w-1 aspect-h-1 w-full">
                                        <img
                                            src={`../img.webp`}
                                            alt={product}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Click to view details</span>
                                            <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                Recommended
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};