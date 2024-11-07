import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'; // Adjust path as needed

import App from './App.jsx'
import './index.css'
import './App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider> 
      <App />
    </AuthProvider>
  </StrictMode>
)
