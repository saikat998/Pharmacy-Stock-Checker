import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PharmacyProvider } from './context/PharmacyContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PharmacyProvider>
      <App />
    </PharmacyProvider>
  </React.StrictMode>,
)
