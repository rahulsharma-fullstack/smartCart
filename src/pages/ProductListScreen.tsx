import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Search, Package, DollarSign, Ruler, ChevronDown } from 'lucide-react';

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
      {/* Hero Section - More compact for mobile */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-8 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-blue-200 mr-3 sm:mr-4" />
              <h1 className="text-2xl sm:text-4xl font-bold text-white">
                Search Results
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-blue-100 mb-4 sm:mb-8">
              Found {filteredProducts.length} products matching "{query}"
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-6 sm:py-12">
        {/* Sort Controls - Stack vertically on mobile */}
        <div className="max-w-7xl mx-auto mb-6 sm:mb-10">
          <div className="flex flex-col bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="text-gray-600 text-base sm:text-lg mb-4">
              Showing {filteredProducts.length} results
            </div>
            <div className="flex items-center">
              <label htmlFor="sort-select" className="text-gray-600 text-base sm:text-lg mr-3">Sort by:</label>
              <div className="relative flex-grow">
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full bg-gray-50 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition duration-150 ease-in-out"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid - Single column on mobile */}
        {loading ? (
          <div className="flex justify-center items-center py-12 sm:py-20">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/location/${product.id}`)}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
                  >
                    <div className="flex items-center">
                      <div className="w-1/3 sm:w-full">
                        <div className="aspect-w-1 aspect-h-1 sm:aspect-w-16 sm:aspect-h-9">
                          <img
                            src="../no_img.png"
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      <div className="w-2/3 sm:w-full p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-4 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h2>
                        
                        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-6">
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                            <span className="font-medium">${product.price.toFixed(2)}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Ruler className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                            <span className="text-sm sm:text-base">{product.size || 'Standard size'}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                            <span className="text-sm sm:text-base">In stock</span>
                          </div>
                        </div>
                        
                        <button className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          View Location
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-20 bg-white rounded-xl shadow-lg">
                <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4 sm:mb-6" />
                <h3 className="text-xl sm:text-2xl font-medium text-gray-700 mb-2 sm:mb-3">No products found</h3>
                <p className="text-gray-500 text-base sm:text-lg">Try adjusting your search terms or browse our categories</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

