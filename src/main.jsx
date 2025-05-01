import React,{ StrictMode } from 'react'
import { createRoot ,HashRouter} from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <HashRouter>
    <App />
  </HashRouter>,
  </StrictMode>
)
