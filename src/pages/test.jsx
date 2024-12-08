import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Search } from "lucide-react";
import axios from "axios";

export default function SearchScreen() {
  // ... existing state variables ...
  const [validatedRecommendations, setValidatedRecommendations] = useState([]);

  // Fetch recommendations and validate against Firebase
  useEffect(() => {
    const fetchAndValidateRecommendations = async () => {
      const useMockResponse = false;

      if (!lastAddedProduct || !lastAddedProduct.name) {
        console.warn("No valid product to fetch recommendations for.");
        return;
      }

      try {
        let recommendedItems = [];
        
        if (useMockResponse) {
          recommendedItems = ["Milk", "Chocolate", "Cookies"];
        } else {
          const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo-0125",
              messages: [
                {
                  role: "user",
                  content: `Suggest 6 products to buy with ${lastAddedProduct.name}. Return as 1 word JSON array of strings. e.g., ["Milk", "Butter", "Jam"]`,
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
          recommendedItems = JSON.parse(recommendedItemsText);
        }

        if (Array.isArray(recommendedItems)) {
          // Create case-insensitive queries for each recommended item
          const validatedItems = [];
          
          for (const item of recommendedItems) {
            const itemName = item.toLowerCase();
            const productsRef = collection(db, "products");
            const q = query(
              productsRef,
              where("name", ">=", itemName),
              where("name", "<=", itemName + "\uf8ff")
            );
            
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              // Get the first matching product
              const product = querySnapshot.docs[0].data();
              validatedItems.push({
                id: querySnapshot.docs[0].id,
                name: product.name,
                img: product.img,
                price: product.price,
                isRecommended: true
              });
            }
          }

          // Only update recommendations if we found valid products
          if (validatedItems.length > 0) {
            setValidatedRecommendations(validatedItems);
          } else {
            // If no valid recommendations, fall back to random products
            setValidatedRecommendations([]);
          }
        }
      } catch (error) {
        console.error("Error fetching/validating recommendations: ", error);
        setValidatedRecommendations([]);
      }
    };

    const timeout = setTimeout(() => {
      fetchAndValidateRecommendations();
    }, 500);

    return () => clearTimeout(timeout);
  }, [lastAddedProduct]);

  // Update the displayedProducts logic
  const displayedProducts = validatedRecommendations.length > 0
    ? validatedRecommendations
    : getRandomProducts(4);

  // Rest of the component remains the same...
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... existing JSX ... */}
      
      {/* Update the recommendations section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {validatedRecommendations.length > 0
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
                    src={product.img ? product.img : "../no_img.png"}
                    alt={product.name}
                    className="w-full h-38 object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  {product.isRecommended && (
                    <span className="text-xs text-blue-600">
                      Recommended AI
                    </span>
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