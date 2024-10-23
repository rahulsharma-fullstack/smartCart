import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { CartProvider } from './CartContext'
import SearchScreen from './SearchScreen'
import ProductListScreen from './ProductListScreen'
import ProductLocationScreen from './ProductLocationScreen'
import BarcodeScannerScreen from './BarcodeScannerScreen'
import CartScreen from './CartScreen'

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<SearchScreen />} />
            <Route path="/products/:query" element={<ProductListScreen />} />
            <Route path="/location/:productId" element={<ProductLocationScreen />} />
            <Route path="/scan/:productId" element={<BarcodeScannerScreen />} />
            <Route path="/cart" element={<CartScreen />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  )
}