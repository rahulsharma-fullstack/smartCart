import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import CartIcon from './components/CartIcon'
import SearchScreen from './pages/SearchScreen'
import ProductListScreen from './pages/ProductListScreen'
import ProductLocationScreen from './pages/ProductLocationScreen'
import BarcodeScannerScreen from './pages/BarcodeScannerScreen'
// import CartScreen from './pages/CartScreen'
import CheckoutScreen from './components/CheckoutScreen'
import LoginScreen from './pages/LoginScreen';

export default function App() {
  return (
    <CartProvider>
      <Router>
      <div className="min-h-screen bg-gray-100 relative">
          <CartIcon />
          <Routes>
            <Route path="/" element={<SearchScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/products/:query" element={<ProductListScreen />} />
            <Route path="/location/:productId" element={<ProductLocationScreen />} />
            <Route path="/scan/:productId" element={<BarcodeScannerScreen />} />
            <Route path="/cart" element={<CheckoutScreen />} />
            <Route path="/checkout" element={<CheckoutScreen />} />
            
          </Routes>
        </div>
      </Router>
    </CartProvider>
  )
}