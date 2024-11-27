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
                const products = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setProductsData(products);
            } catch (e) {
                console.error("Error fetching products: ", e);
            }
        };

        fetchProducts();
    }, []);

    // Fetch recommendations based on the last added product
    useEffect(() => {
        const fetchRecommendations = async () => {
            const useMockResponse = false;

            if (!lastAddedProduct || !lastAddedProduct.name) {
                console.warn("No valid product to fetch recommendations for.");
                return;
            }

            try {
                if (useMockResponse) {
                    const recommendedItems = ["Milk", "Chocolate", "Cookies"];
                    setRecommendedProducts(recommendedItems);
                } else {
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

                    const recommendedItemsText = response.data.choices[0].message.content;
                    const recommendedItems = JSON.parse(recommendedItemsText);
                    if (Array.isArray(recommendedItems)) {
                        setRecommendedProducts(recommendedItems);
                    } else {
                        console.error("Unexpected response format, expected an array:", recommendedItems);
                        setRecommendedProducts([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching recommendations: ", error);
                setRecommendedProducts([]);
            }
        };

        const timeout = setTimeout(() => {
            fetchRecommendations();
        }, 500);

        return () => clearTimeout(timeout);
    }, [lastAddedProduct]);

    const getRandomProducts = (count) => {
        const shuffled = [...productsData].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

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

    const handleSuggestionClick = (product) => {
        setQuery(product.name);
        navigate(`/products/${encodeURIComponent(product.name)}`);
        setShowSuggestions(false);
    };

    const handleRecommendationClick = (productName) => {
        setQuery(productName);
        navigate(`/products/${encodeURIComponent(productName)}`);
    };

    const displayedProducts =
        recommendedProducts.length > 0
            ? recommendedProducts.map((productName) => ({
                  id: productName,
                  name: productName,
                  isRecommended: true,
              }))
            : getRandomProducts(4);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl md:text-5xl font-bold text-white text-center mb-6">
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
                                    placeholder="Search for a product..."
                                    className="w-full pl-12 pr-24 py-4 text-sm border-0 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Recommendations Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                        {recommendedProducts.length > 0
                            ? `Frequently Bought Together with ${lastAddedProduct.name}`
                            : "Explore These Popular Products"}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayedProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => handleRecommendationClick(product.name)}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer group"
                            >
                                <div className="aspect-w-1 aspect-h-1 w-full">
                                    <img
                                        src={`../no_img.png`}
                                        alt={product.name}
                                        className="w-full h-38 object-cover group-hover:scale-105 transition-transform"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {product.name}
                                    </h3>
                                    {product.isRecommended && (
                                        <span className="text-xs text-blue-600">Recommended AI</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
