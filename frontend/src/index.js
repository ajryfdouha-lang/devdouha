import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LangProvider } from './i18n/LangContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <LangProvider>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </LangProvider>
)