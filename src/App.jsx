import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import CartIcon from './components/CartIcon';
import SearchScreen from './pages/SearchScreen';
import ProductListScreen from './pages/ProductListScreen';
import ProductLocationScreen from './pages/ProductLocationScreen';
import BarcodeScannerScreen from './pages/BarcodeScannerScreen';
import CheckoutScreen from './components/CheckoutScreen';
import LoginScreen from './pages/LoginScreen';
import { useAuth } from './context/AuthContext'; // Assuming you have an AuthContext to provide auth state
import ProductDetailScreen from './pages/ProductDetailScreen';

// Protected Route Component
// function ProtectedRoute({ children }) {
//   const { user } = useAuth(); // useAuth returns the logged-in user or null if not logged in

//   return user ? children : <Navigate to="/login" replace />;
// }

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 relative">
          <CartIcon />
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<LoginScreen />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                // <ProtectedRoute>
                  <SearchScreen />
                // {/* </ProtectedRoute> */}
              }
            />
            <Route
              path="/products/:query"
              element={
                // <ProtectedRoute>
                  <ProductListScreen />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/location/:productId"
              element={
                // <ProtectedRoute>
                  <ProductLocationScreen />
                // </ProtectedRoute>
              }
            />
            <Route path="/product-details/:productId" element={<ProductDetailScreen />} />

            <Route
              path="/scan/:productId"
              element={
                // <ProtectedRoute>
                  <BarcodeScannerScreen />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                // <ProtectedRoute>
                  <CheckoutScreen />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                // <ProtectedRoute>
                  <CheckoutScreen />
                // </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}
