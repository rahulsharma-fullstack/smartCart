import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Search, Package, DollarSign, Ruler } from 'lucide-react';

export default function ProductListScreen() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductsData(products);
      } catch (e) {
        console.error('Error fetching products: ', e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  };

  const filteredProducts = productsData.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  const sortedProducts = sortProducts(filteredProducts);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-blue-200 mr-3" />
              <h1 className="text-4xl font-bold text-white">
                Search Results
              </h1>
            </div>
            <p className="text-xl text-blue-100 mb-4">
              Found {filteredProducts.length} products matching "{query}"
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Sort Controls */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            <div className="text-gray-600">
              Showing {filteredProducts.length} results
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/location/${product.id}`)}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex">
                      {/* Product Image */}
                      <div className="w-1/3 flex justify-center items-center p-2">
                        <div className="aspect-w-1 aspect-h-1">
                          <img
                            src="../no_img.png"
                            alt={product.name}
                            className="w-full h-full object-cover rounded-l-lg group-hover:opacity-90 transition-opacity"
                          />
                        </div>
                      </div>
                      
                      {/* Product Details */}
                      <div className="w-2/3 p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h2>
                        
                        <div className="space-y-3">
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-5 h-5 mr-2 text-blue-500" />
                            <span className="font-medium">${product.price.toFixed(2)}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Ruler className="w-5 h-5 mr-2 text-blue-500" />
                            <span>{product.size || 'Standard size'}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Package className="w-5 h-5 mr-2 text-blue-500" />
                            <span>In stock</span>
                          </div>
                        </div>
                        
                        <button className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
                          View Location →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}