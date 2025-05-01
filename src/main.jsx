import React,{ StrictMode } from 'react'
import { createRoot ,HashRouter} from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>

  <HashRouter>
    <App />
  </HashRouter>,
  </React.StrictMode>
)
